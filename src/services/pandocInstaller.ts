import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs/promises';

import * as vscode from 'vscode';

import * as tar from "tar";
import extract from 'extract-zip';

import { execFile } from 'child_process';

import { Logger } from './logger';
import { getExecutable, getFolder, getDownloadUrl } from './pandocConfig';


export class PandocInstaller {
    private readonly logger: Logger;

    private readonly storagePath: string;

    private readonly platform: NodeJS.Platform;
    private readonly arch: string;


    constructor(logger: Logger, context: vscode.ExtensionContext) {
        this.logger = logger;

        this.storagePath = context.globalStorageUri.fsPath;

        this.platform = os.platform();
        this.arch = os.arch();
    }


    public async ensureInstalled(): Promise<string> {
        this.logger.info("Checking for Pandoc in PATH");
        if (await this.isPandocInPath()) {
            this.logger.info("Pandoc found in PATH.\n");
            return 'pandoc';
        }
        this.logger.warn("Pandoc not found in PATH.\n");

        this.logger.info("Checking for local Pandoc installation");
        const installedPath = await this.findInstalledPandoc();
        if (installedPath) {
            this.logger.info("Local Pandoc installation found.\n");
            return installedPath;
        }
        this.logger.info("Local Pandoc installation not found.\n");
        
        return vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: "Installing Pandoc..",
                cancellable: false,
            },
            async () => {
                return await this.installPandoc();
            }
        );
    }

        
    private async isPandocInPath(): Promise<boolean> {
        return new Promise((resolve) => {
            execFile('pandoc', ['--version'], (error) => {
                resolve(!error);
            });
        });
    }

    private async findInstalledPandoc(): Promise<string | null> {
        const pandocExecutable = this.getPandocExecutablePath();

        try {
            await fs.access(pandocExecutable);

            return pandocExecutable;
        } catch {
            return null;
        }
    }


    private async installPandoc(): Promise<string> {
        this.logger.info("Downloading Pandoc");
        const pandocArchive = await this.downloadPandoc();
        this.logger.info("Download completed.\n");

        this.logger.info("Extracting archive");
        await this.extractArchive(pandocArchive, this.storagePath);
        this.logger.info("Extract completed.\n");
        try {
            this.logger.info("Removing temporary archive");
            await fs.unlink(pandocArchive);
            this.logger.info("Remove completed.\n");
        }
        catch {
            this.logger.warn("Failed to removing temporary archive.\n");
        }

        this.logger.info("Pandoc installation completed");
        const pandocExecutable = this.getPandocExecutablePath();
        this.logger.info(`Pandoc executable: ${pandocExecutable}.\n`);

        return pandocExecutable;
    }
    
    private async downloadPandoc(): Promise<string> {
        const downloadingUrl = getDownloadUrl(this.platform, this.arch);
        const installingPath = await this.getPandocArchivePath();
                
        await this.downloadFile(downloadingUrl, installingPath);

        return installingPath;
    }


    private async getPandocArchivePath(): Promise<string> {
        await fs.mkdir(this.storagePath, { recursive: true });
        
        const archivePath = path.join(this.storagePath, 'pandoc.zip');
        
        return archivePath;
    }

    private getPandocExecutablePath(): string {
        return path.join(this.storagePath, getFolder(), getExecutable(this.platform));
    }


    private async downloadFile(url: string, destination: string): Promise<void> {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Download Pandoc failed: ${response.status} ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        await fs.writeFile(destination, buffer);
    }
    
    private async extractArchive(archive: string, destination: string) {
        switch (this.platform) {
            case "win32": await extract(archive, { dir: destination }); break;
            case "darwin": await extract(archive, { dir: destination }); break;
            case "linux": await tar.x({file: archive, cwd: destination}); break;

            default: throw new Error(`Unsupported platform: ${this.platform}`);
        }
    }
}