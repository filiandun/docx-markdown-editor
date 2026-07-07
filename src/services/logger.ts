import * as vscode from 'vscode';

export class Logger {
    private readonly BASE_PREFIX = "[DME]";

    private readonly INFO_PREFIX = "[INFO]";
    private readonly WARN_PREFIX = "[WARN]";
    private readonly ERROR_PREFIX = "[ERROR]";

    private readonly output: vscode.OutputChannel;
    

    public constructor() {
        this.output = vscode.window.createOutputChannel("Docx Markdown Editor");
        this.output.show();
    }


    public info(message: string) {
        this.log(this.INFO_PREFIX, message);
    }
    
    public warn(message: string){
        this.log(this.WARN_PREFIX, message);
    }

    public error(message: string) {
        this.log(this.ERROR_PREFIX, message);
    }


    public notifyInfo(message: string) {
        vscode.window.showInformationMessage(`${this.BASE_PREFIX} ${message}`);
    }
    
    public notifyError(message: string) {
        vscode.window.showErrorMessage(`${this.BASE_PREFIX} ${message}`);
    }


    private log(prefix: string, message: string) {
        this.output.appendLine(`${this.BASE_PREFIX} ${prefix} ${this.getTimeNow()} ${message}`);
    }

    private getTimeNow(): string {
        const timeNow = new Date();

        return timeNow.toLocaleTimeString("en-GB");
    }
}