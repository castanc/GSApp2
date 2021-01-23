import { DomainResponse } from "../models/DomainResponse";
import { GSResponse } from "../Models/GSResponse";
import { KVPCollection } from "../models/KVPCollection";
import { NamedArray } from "../models/NamedAray";
import { RecordItem } from "../models/RecordItem";
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

    //build html select
    getSelect(name: string, arr: Array<Array<string>>, idCol: number = 0, valueCol: number = 1, title = "", selectedValue = ""): string {
        let options = "";
        let onChange = `onchange="onchange_${name}(this.options[this.selectedIndex].value)"`;
        if (title.length == 0)
            title = "Select...";

        options = `<option value="">${title}</option>`
        for (var i = 0; i < arr.length; i++) {
            if (arr[i][idCol] == selectedValue)
                options = `${options}<option value="${arr[i][idCol]}" selected>${arr[i][valueCol]}</option>`
            else
                options = `${options}<option value="${arr[i][idCol]}">${arr[i][valueCol]}</option>`
        }

        let html = `<select name="SELECT_${name}" id="SELECT_${name}" ${onChange}>
        ${options}
    </select>`

        return html;

    }

    getHtmlSelectFiltered(tableName: string, groupId: string, title: string = "", value: string = ""): string {
        let arr = new Array<Array<string>>();
        arr = Utils.getData(this.db, tableName).filter(x => x[0] == groupId);
        let html = this.getSelect(groupId, arr, 1, 2, title, value);
        SysLog.log(0,"select RT","getHtmlSelectFiltered()",html);
        return html;
    }


    getId(tabName):number{
        let id = 0;
        let sheet = this.db.getSheetByName(tabName);
        let rangeData = sheet.getRange(1,1,1,1);
        id = Number(rangeData.getCell(1, 1))+1;
        rangeData.getCell(1, 1).setValue(id);
        return id;
    }

    getDataDeclarations(names): string {
        let nameList = names.split(',');
        let data = new Array<NamedArray>();
        let collection = new KVPCollection();
        let records = new Array<RecordItem>();
        let record = new RecordItem();


        let js = "";
        for (var i = 0; i < nameList.length; i++) {
            js = `${js}let ${nameList[i]} = ${JSON.stringify(new NamedArray(nameList[i]))};`;
        }

        js = `${js}let record = ${JSON.stringify(record)};`;
        js = `${js}let records = ${JSON.stringify(records)};`;
        SysLog.log(0, "getNamedArray()", js);
        return js;

    }

    //todo: for now get the raw array, later a typed array
    getItems(): string {
        let grid = Utils.getData(this.db, "Items");
        let js = `Items.arr = ${JSON.stringify(grid)}`;
        return js;
    }

    getFoodItems()
    {
        let grid = Utils.getData(this.db, "FoodItems");
        let js = JSON.stringify(grid);
        return js;
    }

    getForm(formId:string, formUrl: string=""): GSResponse {
        let html = "";
        let response = new GSResponse();
        if ( formUrl == null )
            formUrl = "";

        if ( formUrl.length > 0 )
            html = Utils.getDocTextByName(formUrl);
        else 
            html = Utils.getDocTextByName(formId);

        if (html == null || html.length == 0) {
            html = HtmlService.createTemplateFromFile(`frontend/${formId}`).evaluate().getContent();
            //todo: create doc with html
        }
        if (html.length > 0 )
        {
            response.addHtml("content",html);
            if ( formId == "FOOD ")
            {
                response.addData("fields",`["FECHA","HORA","REC_TYPE","MEAL_TYPES"]`)
                response.addData("types",`["date","time","number","text"]`);
                response.addData("controls",`["input","input","select","select"]`);
                response.addData("childFields",`["itemId","descr","cant"]`);
                response.addData("childTypes",`["hidden","text","number"]`);
                response.addData("childControls",`["input","input","input"]`);
            }
        }
        else 
        {
            this.result = -1;
            this.message = `form ${formId} not found`;
            response.addError("error",`form ${formId} not found`,404);
        }

        return response;
    }

    processForm(Data,records):DomainResponse
    {
        let dr = new DomainResponse();
        SysLog.log(0,"data received","processForm()",JSON.stringify(Data));
        SysLog.log(0,"records","processForm()",JSON.stringify(records));

        let id = this.getId("Id");

        return dr;
    }



}