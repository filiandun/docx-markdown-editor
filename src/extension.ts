import * as vscode from 'vscode';

import { Logger } from './services/logger';

import { PandocInstaller } from './services/pandocInstaller';
import { PandocService } from './services/pandocService';

import { openAsMarkdown } from './commands/openAsMarkdown';
import { convertTo } from './commands/convertTo';
import { createDocx } from './commands/createDocx';

import { saveAsDocx } from './commands/saveAsDocx';


export async function activate(context: vscode.ExtensionContext) {
	const logger = new Logger();

	logger.info('Docx Markdown Editor is now active');

	let pandocPath: string;
	try {
		pandocPath = await new PandocInstaller(logger, context).ensureInstalled();
	} 
	catch (error) {
		const message = error instanceof Error? error.message : "Unknown error";

        logger.notifyError(`Failed to initialize Pandoc: ${message}`);

        return;
	}

    const pandocService = new PandocService(pandocPath);

	const openWaiter = vscode.commands.registerCommand('docx.openAsMarkdown', (uri) => openAsMarkdown(pandocService, uri));
	const convertWaiter = vscode.commands.registerCommand('docx.convertTo', (pandocService) => convertTo(pandocService));
	const createWaiter = vscode.commands.registerCommand('docx.createDocx', (uri) => createDocx(context, uri));

    const saveListener = vscode.workspace.onDidSaveTextDocument((document) => saveAsDocx(pandocService, document.uri));


	context.subscriptions.push(openWaiter);
    context.subscriptions.push(convertWaiter);
    context.subscriptions.push(createWaiter);

    context.subscriptions.push(saveListener);
}

export function deactivate() {}