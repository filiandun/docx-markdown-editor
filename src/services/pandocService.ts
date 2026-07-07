import { execFile } from 'child_process';


export class PandocService {
	constructor(private readonly pandocPath: string) {}

	public async convertPandoc(inputFile: string, outputFile: string): Promise<void>  {		
		await this.runPandoc([inputFile, '-o', outputFile]);
	}

	private runPandoc(args: string[]): Promise<void> {
		return new Promise((resolve, reject) => {
			execFile(this.pandocPath, args, { windowsHide: true }, (error, _stdout, stderr) => {
				if (error) {
					reject(new Error(stderr || error.message));
					return;
				}
				resolve();
			});
		});
	}
}
