// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import fetch from 'node-fetch';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "blameai" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('blameai.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from blameAI!');
	});

	context.subscriptions.push(disposable);

	// Register 'Line History (AI)' command for editor context menu
	const lineHistoryDisposable = vscode.commands.registerCommand('blameai.lineHistoryAI', (args) => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const line = editor.selection.active.line + 1;
			vscode.window.showInformationMessage(`Line History (AI) for line ${line}`);
    }
	});
	context.subscriptions.push(lineHistoryDisposable);

	// Register 'File History (AI)' command for explorer context menu
	const fileHistoryDisposable = vscode.commands.registerCommand('blameai.fileHistoryAI', (uri: vscode.Uri) => {
		const filePath = uri ? uri.fsPath : 'Unknown file';
		vscode.window.showInformationMessage(`File History (AI) for ${filePath}`);
	});
	context.subscriptions.push(fileHistoryDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
