import * as vscode from 'vscode';
import cloudformation from './CloudFormationResourceSpecification.original.json';
import * as rs from './resourcespec';


export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "cloudformation-ext-vscode" is now active!');
	let keys : string[] = Object.keys(cloudformation.ResourceTypes);
	var completions : vscode.CompletionItem[] = [];
	
	keys.forEach( key => {
		var ResourceSpecItem = new rs.ResourceSpecCompletionItem(key);
		var vsitem = new vscode.CompletionItem(key);
		var elements : any[] = [];
		ResourceSpecItem.completionItemProperties.forEach( (e) => {elements.push(e.PropertyName + ": ");});
		var elementStringWithNewLine :string = elements.join('\n    ');
		var snippetString =`\n  Type: ${ResourceSpecItem.completionItemName}\n  Properties:\n    ${elementStringWithNewLine}`;
		vsitem.insertText = new vscode.SnippetString("${1:itemName}" + snippetString);

		completions.push(vsitem);
	});


	let resourceTypeProvider = vscode.languages.registerCompletionItemProvider( 'yaml', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

			return completions;
		}
	});

	// let propertyTypeProvider = vscode.languages.registerCompletionItemProvider( 'yaml', {
	// 	provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
	// 		let keys : string[] = Object.keys(cloudformation.PropertyTypes);
	// 		var completions : vscode.CompletionItem[] = [];
			
	// 		keys.forEach( key => {
	// 			completions.push(new vscode.CompletionItem(key.toString()));
	// 		});

	// 		return completions;
	// 	}
	// });

	let completionProvider2 = vscode.languages.registerCompletionItemProvider('plaintext', {

		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {

			const snippetCompletion = new vscode.CompletionItem('Good part of the day');
			snippetCompletion.insertText = new vscode.SnippetString('Good ${1|morning,afternoon,evening|}. It is ${1}, right?');
			snippetCompletion.documentation = new vscode.MarkdownString("Inserts a snippet that lets you select the _appropriate_ part of the day for your greeting.");

			// return all completion items as array
			return [
				snippetCompletion,
			];
		}
	});

	context.subscriptions.push(resourceTypeProvider);
}

export function deactivate() {}
