import data from './CloudFormationResourceSpecification.original.json';
const cf = data.ResourceTypes;

interface ICloudFormationResourceProperty {
    PropertyName: string;
    Documentation: string;
}

export class ResourceSpecCompletionItem {

    private _completionItemName: string;
    public get completionItemName(): string {
        return this._completionItemName;
    }
    public set completionItemName(v: string) {
        this._completionItemName = v;
    }
    
    private _completionItemProperties : ICloudFormationResourceProperty[];
    public get completionItemProperties() : ICloudFormationResourceProperty[] {
        return this._completionItemProperties;
    }

    constructor(name: string) {
        this._completionItemName = name;
        this._completionItemProperties = this.getCompletionItemProperties(name);
    }
    
    private getCompletionItemProperties(itemName: string) : ICloudFormationResourceProperty[] {
        var properties = cf[itemName].Properties;
        var requiredProperties : ICloudFormationResourceProperty[] = [];
        var entries = Object.entries(properties);
        entries.map( (entry : any ) => {
            if ( entry[1].Required === true) {
                requiredProperties.push(
                    {
                        PropertyName: entry[0],
                        Documentation: entry[1].Documentation.toString()
                    }
                );
            }
        });
        return requiredProperties;
    }
}

