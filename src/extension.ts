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
	const lineHistoryDisposable = vscode.commands.registerCommand('blameai.lineHistoryAI', async (args) => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const document = editor.document;
        const filePath = document.uri.fsPath;
        const line = editor.selection.active.line + 1;
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri)?.uri.fsPath || '';
        // Get last 3 commit hashes for this line
        let commitHashes = [];
        try {
            const exec = await import('child_process');
            const { execSync } = exec;
            // Use git log -L to get commits for the specific line
            const gitCmd = `git log -L ${line},${line}:"${filePath}" --pretty=format:%H`;
            const stdout = execSync(gitCmd, { cwd: workspaceFolder });
            commitHashes = stdout.toString().trim().split(/\r?\n/)
                .filter(line => /^[0-9a-f]{40}$/i.test(line))
                .slice(0, 3);
        } catch (err) {
            vscode.window.showErrorMessage('Failed to get line commit hashes: ' + (err instanceof Error ? err.message : String(err)));
            return;
        }
        // Get repo name
        let repoName = '';
        try {
            const exec = await import('child_process');
            const { execSync } = exec;
            const remoteUrl = execSync('git config --get remote.origin.url', { cwd: workspaceFolder }).toString().trim();
            // Extract repo name from URL (supports both HTTPS and SSH)
            const match = remoteUrl.match(/[:\/]{1}([^\/]+\/[^\/]+)(?:\.git)?$/);
            repoName = match ? match[1].replace(/\.git$/, '') : '';
        } catch (err) {
            vscode.window.showErrorMessage('Failed to get repo name: ' + (err instanceof Error ? err.message : String(err)));
            return;
        }
        // Get relative file path
        const relativePath = workspaceFolder ? filePath.replace(workspaceFolder + '/', '') : filePath;
        // Show info before calling backend API
        vscode.window.showInformationMessage(`Calling line-history-ai with repoName: ${repoName}, line: ${line}, relativePath: ${relativePath}, commitHashes: ${commitHashes.join(', ')}`);
        // Call backend API
        try {
            const response = await fetch('http://localhost:8000/line-history-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoName, line, relativePath, commitHashes }),
            });
            if (!response.ok) { throw new Error(`HTTP ${response.status}`); }
            const data = await response.json() as { result: string };
            vscode.window.showInformationMessage(`AI Line History: ${data.result}`);
        } catch (err) {
            vscode.window.showErrorMessage(`Failed to fetch AI line history: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
});
context.subscriptions.push(lineHistoryDisposable);

	// Register 'File History (AI)' command for explorer context menu
	const fileHistoryDisposable = vscode.commands.registerCommand('blameai.fileHistoryAI', async (uri: vscode.Uri) => {
    const filePath = uri ? uri.fsPath : 'Unknown file';
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri)?.uri.fsPath || '';
    // Get last 3 commit hashes for this file
    let commitHashes = [];
    try {
        const exec = await import('child_process');
        const { execSync } = exec;
        const gitCmd = `git log -n 3 --pretty=format:%H -- "${filePath}"`;
        const stdout = execSync(gitCmd, { cwd: workspaceFolder });
        commitHashes = stdout.toString().trim().split(/\r?\n/);
    } catch (err) {
        vscode.window.showErrorMessage('Failed to get commit hashes: ' + (err instanceof Error ? err.message : String(err)));
        return;
    }
    // Get repo name
    let repoName = '';
    try {
        const exec = await import('child_process');
        const { execSync } = exec;
        const remoteUrl = execSync('git config --get remote.origin.url', { cwd: workspaceFolder }).toString().trim();
        const match = remoteUrl.match(/[:\/]{1}([^\/]+\/[^\/]+)(?:\.git)?$/);
        repoName = match ? match[1].replace(/\.git$/, '') : '';
    } catch (err) {
        vscode.window.showErrorMessage('Failed to get repo name: ' + (err instanceof Error ? err.message : String(err)));
        return;
    }
    // Get relative file path
    const relativePath = workspaceFolder ? filePath.replace(workspaceFolder + '/', '') : filePath;
    // Show info before calling backend API
    vscode.window.showInformationMessage(`Calling file-history-ai with repoName: ${repoName}, relativePath: ${relativePath}, commitHashes: ${commitHashes.join(', ')}`);
    // Call backend API
    try {
        const response = await fetch('http://localhost:8000/file-history-ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ repoName, relativePath, commitHashes }),
        });
        if (!response.ok) { throw new Error(`HTTP ${response.status}`); }
        const data = await response.json() as { result: string };
        vscode.window.showInformationMessage(`AI File History: ${data.result}`);
    } catch (err) {
        vscode.window.showErrorMessage(`Failed to fetch AI file history: ${err instanceof Error ? err.message : String(err)}`);
    }
});
context.subscriptions.push(fileHistoryDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
