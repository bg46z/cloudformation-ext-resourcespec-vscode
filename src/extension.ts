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
		var elements : string[] = [];
		
		//apparently you can't run javascript like this in a template string
		ResourceSpecItem.completionItemProperties.forEach( (e, index) => { 
			var eindex = index + 2; 
			elements.push(e.PropertyName + ": ${" + eindex + "}" );
		});

		var elementStringWithNewLine : string = elements.join('\n    ');

		var snippetString =`\n  Type: ${ResourceSpecItem.completionItemName}\n  Properties:\n    ${elementStringWithNewLine}`;
		vsitem.insertText = new vscode.SnippetString("${1:itemName}:" + snippetString);

		completions.push(vsitem);
	});


	let resourceTypeProviderYAML = vscode.languages.registerCompletionItemProvider( 'yaml', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			return completions;
		}
	});

	//todo resourceTypeProviderJSON

	context.subscriptions.push(resourceTypeProviderYAML);
}

export function deactivate() {}
