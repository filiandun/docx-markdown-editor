import * as vscode from 'vscode';
import * as path from 'path';

import { Logger } from '../services/logger';
import { PandocService } from '../services/pandoc/pandocService';

import { resolveFileUri } from "../utils/resolveUri";
import { getErrorMessage } from '../utils/errorHelper';


export async function convertTo(logger: Logger, pandocService: PandocService, uri?: vscode.Uri) {
    logger.info(`Command 'convertTo'`);

    const targetUri = await resolveFileUri(uri);
    if (!targetUri) { 
        logger.warn(`No target file selected.\n`);
        return; 
    }
    
    const currentFormat = path.extname(targetUri.fsPath);
    const formats = pandocService.getSupportedConversions(currentFormat);
    if (!formats || formats.length === 0) {
        logger.notifyWarn(`Unsupported file type (${targetUri.fsPath}).`);
        return;
    }
    
    const selectedFormat = await vscode.window.showQuickPick(formats, {
        placeHolder: 'Convert to...'
    });
    
    if (!selectedFormat) { 
        logger.warn(`No file format selected.\n`);
        return; 
    }
    
    const inputFile = targetUri.fsPath;
    const inputPath = path.parse(inputFile);

    const outputPath = path.join(inputPath.dir, `${inputPath.name}${selectedFormat}`);
        
    try {
        await pandocService.convert(inputFile, outputPath);

        logger.notifyInfo(`\'${path.basename(inputFile)}\' convert to \'${path.basename(outputPath)}\'`);
    }
    catch (error) {
        logger.notifyError(getErrorMessage(error));
    }
}