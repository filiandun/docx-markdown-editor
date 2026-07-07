import * as vscode from 'vscode';
import * as path from 'path';

import { PandocService } from '../services/pandocService';
import { resolveFileUri } from "../utils/resolveUri";

export async function convertTo(pandocService: PandocService, uri?: vscode.Uri) {
    console.log('convertFromMarkdown');

    const targetUri = await resolveFileUri(uri);
    if (!targetUri) { return; }
    
    const formats = getFilteredFormats(targetUri.fsPath);
    if (!formats || formats.length === 0) {
        vscode.window.showErrorMessage(`DMB: unsupported file type`);
        return;
    }

    const selectedFormat = await vscode.window.showQuickPick(formats, {
        placeHolder: 'Convert to...'
    });

    if (!selectedFormat) { return; }

    const inputFile = targetUri.fsPath;
    const inputPath = path.parse(inputFile);

    const outputFile = path.join(inputPath.dir, `${inputPath.name}${selectedFormat}`);
    
    try {
        await pandocService.convertPandoc(inputFile, outputFile);

        vscode.window.showInformationMessage(`DMB: \'${path.basename(inputFile)}\' convert to \'${path.basename(outputFile)}\'`);
    }
    catch (err: any) {
        vscode.window.showErrorMessage(`DMB: Error: ${err.message || err}`);
    }
}


function getFilteredFormats(filePath: string) {
    const currentFormat = path.extname(filePath).replace('.', ''); 

    const map: Record<string, string[]> = {
        md: ['.docx', '.pdf', '.html', '.epub'],
        docx: ['.md', '.pdf', '.html'],
        html: ['.md', '.docx', '.pdf'],
    };

    return map[currentFormat];
}