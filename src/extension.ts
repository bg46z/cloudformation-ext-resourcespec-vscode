import * as vscode from 'vscode';
import cloudformation from './CloudFormationResourceSpecification.original.json';
import allproperties from './AllPropertiesSorted.json';
import * as rs from './resourcespec';


export function activate(context: vscode.ExtensionContext) {

	var resourceCompletions : vscode.CompletionItem[] = [];
	var propertiesCompletions : vscode.CompletionItem[] = [];
	let resourceKeys : string[] = Object.keys(cloudformation.ResourceTypes);
	resourceKeys.forEach( key => {
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

		resourceCompletions.push(vsitem);
	});

	//let propertyKeys : string[] = Object.keys(allproperties);
	allproperties.forEach( key => {
		var propertiesItem = new vscode.CompletionItem(key);
		propertiesItem.insertText = new vscode.SnippetString(`${key}: ` + "${1:Value}");
		propertiesCompletions.push(propertiesItem);
	});

	let resourceTypeProviderYAML = vscode.languages.registerCompletionItemProvider( 'yaml', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			return resourceCompletions;
		}
	});

	let propertyProviderYAML = vscode.languages.registerCompletionItemProvider( 'yaml', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			return propertiesCompletions;
		}
	});

	//todo resourceTypeProviderJSON

	context.subscriptions.push(resourceTypeProviderYAML,propertyProviderYAML);
}

export function deactivate() {}
