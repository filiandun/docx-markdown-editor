import * as vscode from 'vscode';
import * as path from 'path';

import { Logger } from '../services/logger';
import { PandocService } from '../services/pandoc/pandocService';

import { resolveFileUri } from '../utils/resolveUri';
import { getErrorMessage } from '../utils/errorHelper';


export async function openAsMarkdown(logger: Logger, pandocService: PandocService, uri?: vscode.Uri) {
    logger.info(`Command 'openAsMarkDown'`);
    
    const targetUri = await resolveFileUri(uri);
    if (!targetUri) { 
        logger.warn(`No target file selected.\n`);
        return; 
    }

    if (!targetUri.fsPath.toLowerCase().endsWith('.docx')) {
        logger.notifyWarn(`Command 'Open as Markdown' works only with .docx files`);
        return;
    }
    
    const docxFilePath = targetUri.fsPath;
    const mdFilePath = docxFilePath + ".md";

    try {
        await pandocService.convertDocxToMd(docxFilePath, mdFilePath);

        const mdFileUri = vscode.Uri.file(mdFilePath);

        await vscode.commands.executeCommand('vscode.open', mdFileUri);

        logger.info(`\'${path.basename(docxFilePath)}\' open as \'${path.basename(mdFilePath)}\'`);
    }
    catch (error) {
        logger.notifyError(getErrorMessage(error));
    }
}
