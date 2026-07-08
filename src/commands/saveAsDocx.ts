import * as vscode from 'vscode';
import * as path from 'path';

import { Logger } from '../services/logger';
import { PandocService } from '../services/pandoc/pandocService';

import { getErrorMessage } from '../utils/errorHelper';


export async function saveAsDocx(logger: Logger, pandocService: PandocService, uri: vscode.Uri) {
    logger.info(`Command 'saveAsDocx'`);
    
    const mdFilePath = uri.fsPath;
    
    if (!mdFilePath.endsWith('.docx.md')) {
        return;
    }
    
    const docxFilePath = mdFilePath.replace(/\.md$/, "");
    
    try {
        await pandocService.convertMdToDocx(mdFilePath, docxFilePath);

        logger.info(`\'${path.basename(mdFilePath)}\' saved as \'${path.basename(docxFilePath)}\'`);
    }
    catch (error) {
        logger.notifyError(getErrorMessage(error));        
    }
}