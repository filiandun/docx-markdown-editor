import * as vscode from 'vscode';
import * as path from 'path';

import { PandocService } from '../services/pandocService';
import { resolveFileUri } from '../utils/resolveUri';

export async function openAsMarkdown(pandocService: PandocService, uri?: vscode.Uri) {
    console.log('openAsMarkDown');
    
    const targetUri = await resolveFileUri(uri);
    if (!targetUri) { return; }

    if (!targetUri.fsPath.toLowerCase().endsWith('.docx')) {
        vscode.window.showErrorMessage('DME: Open as Markdown only works with .docx files');
        return;
    }
    
    const docxFilePath = targetUri!.fsPath;
    const mdFilePath = docxFilePath + ".md";

    try {
        await pandocService.convertPandoc(docxFilePath, mdFilePath);

        const mdFileUri = vscode.Uri.file(mdFilePath);

        await vscode.commands.executeCommand('vscode.open', mdFileUri);

        vscode.window.showInformationMessage(`DME: \'${path.basename(docxFilePath)}\' open as \'${path.basename(mdFilePath)}\'`);
    }
    catch (err: any) {
        vscode.window.showErrorMessage(`DME: Error: ${err.message || err}`);
    }
}
