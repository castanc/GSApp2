import { KVPCollection } from "../models/KVPCollection";
import { NamedArray } from "../models/NamedAray";
import { G } from "./G";
import { SysLog } from "./SysLog";
import { Utils } from "./utils";

export class Service {
    db;
    folder;
    result = 0;
    message = "";
    ex;


    constructor() {
        this.folder = Utils.getCreateFolder(G.FolderName);
        this.db = Utils.openSpreadSheet(G.DatabaseUrl);
    }

    getSelect(name: String, arr: Array<Array<string>>, idCol: number = 0, valueCol: number = 1, title = "", selectedValue = ""): string {
        let options = "";
        if (title.length == 0)
            title = "Select...";

        options = `<option value="">${title}</option>`
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][idCol] == selectedValue)
                options = `${options}<option value="${arr[i][idCol]}" selected>${arr[i][valueCol]}</option>`
            else
                options = `${options}<option value="${arr[i][idCol]}">${arr[i][valueCol]}</option>`
        }

        let html = `
<select name="SELECT_${name}" id="SELECT_${name}" onchange="onchange_${name}('${name}',this.options[this.selectedIndex].value))">
${options}
</select>`


        return html;

    }

    getHtmlSelectFiltered(tableName: string, groupId: string, title: string = "", value: string = ""): string {
        let arr = new Array<Array<string>>();
        arr = Utils.getData(this.db, tableName).filter(x => x[0] == groupId);
        return this.getSelect(groupId, arr, 0, 2, title, value);
    }



    getDataDeclarations(names): string {
        let nameList = names.split(',');
        let data = new Array<NamedArray>();
        let collection = new KVPCollection();

        let js = "";
        for (var i = 0; i < nameList.length; i++) {
            js = `${js}let ${nameList[i]} = ${JSON.stringify(new NamedArray(nameList[i]))};
        console.log("${nameList[i]}",${nameList[i]})
        `;
        }

        // js = `${js}let cache = ${JSON.stringify(collection)};console.log("cache",cache)`;
        SysLog.log(0, "getNamedArray()", js);
        return js;

    }

    //todo: for now get the raw array, later a typed array
    getItems(): string {
        let grid = Utils.getData(this.db, "Items");
        let js = `Items.arr = ${JSON.stringify(grid)}
        console.log("Items",Items)`;

        return js;
    }

    getForm(formId:string, formUrl: string): string {
        let html = "";
        if ( formUrl.length > 0 )
            html = Utils.getDocTextByName(formUrl);
        else 
            html = Utils.getDocTextByName(formId);

        if (html.length == 0) {
            html = HtmlService.createTemplateFromFile(`frontend/${formId}`).evaluate().getContent();
            //todo: create doc with html
        }

        if ( html.length == 0)
        {
            this.result = -1;
            this.message = `form ${formId} not found`;
        }

        return html;
    }



}