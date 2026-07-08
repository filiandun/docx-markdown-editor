import * as vscode from 'vscode';
import * as fs from 'fs/promises';

import path from 'path';

import { Logger } from './logger';
import { PandocService } from './pandoc/pandocService';

import { getErrorMessage } from '../utils/errorHelper';
import { getHtmlLikeWord } from '../utils/htmlHelper';


export class DocxPreviewProvider implements vscode.CustomReadonlyEditorProvider {
    private readonly logger: Logger;
    private readonly pandocService: PandocService;

    private readonly tempPath: string;


    constructor(logger: Logger, pandocService: PandocService, context: vscode.ExtensionContext) {
        this.logger = logger;
        this.pandocService = pandocService;

        this.tempPath = path.join(context.globalStorageUri.fsPath, 'temp');
    }

    
    public async resolveCustomEditor(document: vscode.CustomDocument, webviewPanel: vscode.WebviewPanel, token: vscode.CancellationToken): Promise<void> {
        this.logger.info('command previewDocx');
        
        const watcher = vscode.workspace.createFileSystemWatcher(
            new vscode.RelativePattern(path.dirname(document.uri.fsPath), path.basename(document.uri.fsPath))
        );
        
        if (await this.updatePreview(document, webviewPanel)) {
            this.logger.info(`Opened preview for "${path.basename(document.uri.fsPath)}".`);
            
        }

        watcher.onDidChange(async () => { 
            if (await this.updatePreview(document, webviewPanel)) {
                this.logger.info(`Updated preview for "${path.basename(document.uri.fsPath)}".`);
            }
        });
        
        webviewPanel.onDidDispose(() => {
            watcher.dispose();
        });
    }

    public openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext, token: vscode.CancellationToken): vscode.CustomDocument | Thenable<vscode.CustomDocument> {
        return { uri, dispose: () => {} };
    }


    private async updatePreview(document: vscode.CustomDocument, webviewPanel: vscode.WebviewPanel): Promise<boolean> {  
        const docxFilePath = document.uri.fsPath;
        const htmlFilePath = path.join(this.tempPath, `${Date.now()}_${path.basename(docxFilePath)}.html`); 

        try {
            this.logger.info(`Converting '${docxFilePath}' to '${htmlFilePath}'..`);
            await this.pandocService.convertDocxToHtml(docxFilePath, htmlFilePath);
            this.logger.info(`Converted completed.\n`);

            webviewPanel.webview.html = getHtmlLikeWord(await fs.readFile(htmlFilePath, 'utf-8'));

            return true;
        }
        catch (error) {
            webviewPanel.webview.html = getHtmlLikeWord('<h1 class="error-text">Failed to open document :(</h1>');

            this.logger.notifyError(getErrorMessage(error));

            return false;
        }
        finally {
            await fs.unlink(htmlFilePath).catch(() => {});
        }
    }
}