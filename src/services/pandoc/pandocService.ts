import path from 'path';

import { execFile } from 'child_process';


export class PandocService {
	private readonly supportedConversions = new Map([
		['.md',   ['.docx', '.html', '.pdf', '.epub']],
		['.docx', ['.md', '.html', '.pdf', '.epub']],
		['.html', ['.md', '.docx', '.pdf', '.epub']],
		['.epub', ['.md', '.docx', '.html', '.pdf']],
	]);

	constructor(private readonly pandocPath: string) { }

	
	public getSupportedConversions(format: string) {
    	return this.supportedConversions.get(format);
	}


	public async convertDocxToMd(docxFile: string, mdFile: string) {
		const mediaDir = path.basename(mdFile) + ".assets";
		
		await this.runPandoc([docxFile, '-o', mdFile, `--extract-media=${mediaDir}`], path.dirname(mdFile));
	}

	public async convertMdToDocx(mdFile: string, docxFile: string) {
		await this.runPandoc([mdFile, '-o', docxFile], path.dirname(mdFile));
	}
	
	public async convertDocxToHtml(docxFile: string, htmlFile: string) {
		await this.runPandoc([docxFile, '-o', htmlFile, '--embed-resources'], path.dirname(docxFile));
	}
	

	public async convert(inputFile: string, outputFile: string): Promise<void>  {		
		const inputExt = path.extname(inputFile).toLowerCase();
		const outputExt = path.extname(outputFile).toLowerCase();

		if (inputExt === ".docx" && outputExt === ".md") {
			return await this.convertDocxToMd(inputFile, outputFile);
		}

		if (inputExt === ".md" && outputExt === ".docx") {
			return await this.convertMdToDocx(inputFile, outputFile);
		}

		if (inputExt === ".docx" && outputExt === ".html") {
			return await this.convertDocxToHtml(inputFile, outputFile);
		}

		await this.runPandoc([inputFile, '-o', outputFile], path.dirname(inputFile));
	}


	private runPandoc(args: string[], cwd: string): Promise<void> {
		return new Promise((resolve, reject) => {
			execFile(this.pandocPath, args, { windowsHide: true, cwd }, (error, _stdout, stderr) => {
				if (error) {
					reject(new Error(stderr || error.message));
					return;
				}
				resolve();
			});
		});
	}
}
