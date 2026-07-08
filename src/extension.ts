import * as vscode from 'vscode';
import * as fs from 'fs/promises';

import path from 'path';

import { Logger } from './services/logger';

import { PandocInstaller } from './services/pandoc/pandocInstaller';
import { PandocService } from './services/pandoc/pandocService';

import { DocxPreviewProvider } from './services/docxPreviewProvider';

import { openAsMarkdown } from './commands/openAsMarkdown';
import { convertTo } from './commands/convertTo';
import { createDocx } from './commands/createDocx';

import { saveAsDocx } from './commands/saveAsDocx';

import { getErrorMessage } from './utils/errorHelper';


export async function activate(context: vscode.ExtensionContext) {
	const logger = new Logger();

	logger.info('Docx Markdown Editor is now active');

	try {
		const tempPath = path.join(context.globalStorageUri.fsPath, 'temp');
		logger.info(`Clearing temporary storage (${tempPath})`);

		await fs.rm(tempPath, { recursive: true, force: true });
		await fs.mkdir(tempPath);

		logger.info('Temporary storage cleared.\n');
	}
	catch (error) {
		logger.warn('Failed to clear temporary storage.\n');
	}

	let pandocPath: string;
	try {
		pandocPath = await new PandocInstaller(logger, context).ensureInstalled();
	} 
	catch (error) {
        logger.notifyError(`Failed to initialize Pandoc: ${getErrorMessage(error)}`);
        return;
	}

    const pandocService = new PandocService(pandocPath);

	const provider = new DocxPreviewProvider(logger, pandocService, context);
 	const editorWaiter = vscode.window.registerCustomEditorProvider("docxMarkdownEditor.preview", provider);

	const openWaiter = vscode.commands.registerCommand('docx.openAsMarkdown', (uri) => openAsMarkdown(logger, pandocService, uri));
	const convertWaiter = vscode.commands.registerCommand('docx.convertTo', (uri) => convertTo(logger, pandocService, uri));
	const createWaiter = vscode.commands.registerCommand('docx.createDocx', (uri) => createDocx(context, uri));

    const saveListener = vscode.workspace.onDidSaveTextDocument((document) => saveAsDocx(logger, pandocService, document.uri));

	context.subscriptions.push(openWaiter);
    context.subscriptions.push(convertWaiter);
    context.subscriptions.push(createWaiter);

    context.subscriptions.push(saveListener);

	context.subscriptions.push(editorWaiter);
}

export function deactivate() {}