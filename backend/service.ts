import { DomainResponse } from "../models/DomainResponse";
import { GSResponse } from "../Models/GSResponse";
import { KVPCollection } from "../models/KVPCollection";
import { NamedArray } from "../models/NamedAray";
import { RecordItem } from "../models/RecordItem";
import { RecordItemBase } from "../models/RecordItemBase";
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
        SysLog.level = 0;
    }

    //build html select
    getSelect(name: string, arr: Array<Array<string>>, idCol: number = 0, valueCol: number = 1, title = "", selectedValue = "", req = false, startRow = 0): string {
        let options = "";
        let onChange = `onchange="onchange_${name}(this.options[this.selectedIndex].value)"`;

        let required = "";

        if (title.length == 0)
            title = "Select...";

        if (req)
            required = "required";

        options = `<option value="">${title}</option>`
        for (var i = startRow; i < arr.length; i++) {
            if (arr[i][idCol] == selectedValue)
                options = `${options}<option value="${arr[i][idCol]}" selected>${arr[i][valueCol]}</option>`
            else
                options = `${options}<option value="${arr[i][idCol]}">${arr[i][valueCol]}</option>`
        }

        let html = `<select name="SELECT_${name}" id="SELECT_${name}" ${required} ${onChange} class="form-control" style="font-size:28px">
        ${options}
    </select>`

        return html;

    }

    getData(tabName, title = "", startRow) {
        let grid = Utils.getData(this.db, tabName);
        let html = this.getSelect(tabName, grid, 0, 1, title, "", true, startRow);
        return html;
    }

    getHtmlSelectFiltered(tableName: string, groupId: string, title: string = "", value: string = "", required = false): string {
        let arr = new Array<Array<string>>();
        arr = Utils.getData(this.db, tableName).filter(x => x[0] == groupId);
        let html = this.getSelect(groupId, arr, 1, 2, title, value, required);
        return html;
    }


    getId(tabName): number {
        let id = 0;
        let sheet = this.db.getSheetByName(tabName);
        let rangeData = sheet.getRange(1, 1, 1, 1);
        let cell = rangeData.getCell(1, 1).getValue();
        if (cell == null)
            cell = 0;

        id = cell + 1;  //Number(cell);
        rangeData.getCell(1, 1).setValue(id);
        return id;
    }

    updateId(tabName, id): number {
        let sheet = this.db.getSheetByName(tabName);
        let rangeData = sheet.getRange(1, 1, 1, 1);
        let cell = rangeData.getCell(1, 1).getValue();
        if (cell == null)
            cell = 0;
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

        //js = `${js}let record = ${JSON.stringify(record)};`;
        //js = `${js}let records = ${JSON.stringify(records)};`;
        return js;

    }

    //todo: for now get the raw array, later a typed array
    getItems(): string {
        let grid = Utils.getData(this.db, "Items");
        let js = `Items.arr = ${JSON.stringify(grid)}`;
        return js;
    }

    getFoodItems() {
        let grid = Utils.getData(this.db, "FoodItems");
        let js = JSON.stringify(grid);
        return js;
    }

    getDrugItems() {
        let grid = Utils.getData(this.db, "DrugItems");
        let js = JSON.stringify(grid);
        return js;
    }

    getExeItems() {
        let grid = Utils.getData(this.db, "ExeItems");
        let js = JSON.stringify(grid);
        return js;
    }


    getForm(formId: string, formUrl: string = ""): GSResponse {
        let html = "";
        let response = new GSResponse();
        if (formUrl == null)
            formUrl = "";

        // if (formUrl.length > 0)
        //     html = Utils.getDocTextByName(formUrl);
        // else
        //     html = Utils.getDocTextByName(formId);

        if (html == null || html.length == 0) {
            html = HtmlService.createTemplateFromFile(`frontend/${formId}`).evaluate().getContent();
            //todo: create doc with html
        }
        if (html.length > 0) {
            response.addHtml("content", html);
            if (formId == "FOOD ") {
                // response.addData("fields", `["FECHA","HORA","REC_TYPE","MEAL_TYPES"]`)
                // response.addData("types", `["date","time","number","text"]`);
                // response.addData("controls", `["input","input","select","select"]`);
                // response.addData("childFields", `["itemId","descr","cant"]`);
                // response.addData("childTypes", `["hidden","text","number"]`);
                // response.addData("childControls", `["input","input","input"]`);
            }
        }
        else {
            this.result = -1;
            this.message = `form ${formId} not found`;
            //response.addError("error", `form ${formId} not found`, 404);
        }

        return response;
    }

    importLegacy(Data: KVPCollection, colSep ="\t", lineSep = "\n"): number {
        let data2 = new KVPCollection();
        data2.initialize("ROW,ID,INACTIVE,DAYS,MINUTES,REC_TYPE,FECHA,HORA,DATA,DATA1,DATA2,DATA3");
        data2.addRange(Data);

        SysLog.level = 1;


        let id = this.getId("Id");
        let fecha = data2.get("FECHA");
        let dt = Utils.getDateFromYMD(fecha);
        let days = 0;
        let year = fecha.substring(0, 4);
        let hora = data2.get("HORA");
        let fileName = `${year}_data`;
        let lastRow = 2;
        let grid2;
        let ss;
        let sheet;
        let range;
        let lastColumn=0;
        let lastYear = new Date().getFullYear();
        let grid;
        let value;
        let recType="";
        let drugItems = Utils.getData(this.db,"DrugItems");
        let records = new Array<RecordItemBase>();
        let c;
        let minutes = 0;
        let v;


        let legacyData = data2.get("LEGACY");
        let lines = legacyData.split(lineSep);

        for (var i = 0; i < lines.length; i++) {
            c = lines[i].split(colSep);
            if (c.length > 4) {
                recType =c[1].toUpperCase();
                fecha = c[2];
                dt = Utils.getDateFromYMD(fecha);
                if ( dt == null )
                    continue;

                days = Utils.getDays(dt);                    
                hora = c[3];
                value = c[4];
                minutes = Utils.getMinutes(hora);


                if ( dt.getFullYear() != lastYear )
                {
                    year = dt.getFullYear();
                    fileName = `${year}_data`;
                    ss = Utils.getCreateSpreadSheet(this.folder, fileName, "Master,Detail", data2.getColNames());
                    sheet = ss.getActiveSheet();
                    range = sheet.getDataRange();
                    lastColumn = range.getLastColumn();
                    lastRow = range.getLastRow() + 1;
                    lastYear = dt;
                    grid = range.getValues();
                }

                grid2 = grid.filter(x => x[3] == days.toString() &&
                    x[4] == minutes.toString() &&
                    x[5] == recType);
                
                    

                if (grid2.length == 0) {
                    data2.updateOnly("ID", id.toString());
                    data2.updateOnly("ROW", lastRow.toString());
                    data2.updateOnly("DAYS", days.toString());
                    data2.updateOnly("MINUTES", minutes.toString());
                    data2.updateOnly("FECHA",fecha);
                    data2.updateOnly("HORA",hora);

                    let r = new RecordItemBase();
                    r.id = id;



                    data2.updateOnly("REC_TYPE", recType);
                    if ( recType == "DRUG"){
                        data2.updateOnly("DATA", "");
                        let drug = drugItems.filter(x=>x[5]== value)
                        if (drug.length > 0 )
                        {
                            r.cant = 1;
                            r.itemId = Number(drug[0][0]);
                            records.push(r);
                        }
                    }
                    else if ( recType == "EXE"){
                        data2.updateOnly("DATA", "");
                        r.itemId = 0;
                        r.cant = Number(value);
                        if ( c.length < 4)
                        {
                            r.time = Utils.getSeconds(c[5]).toString();
                            r.data2 = c[5];
                        }
                        records.push(r);
                    }
                    else if ( recType == "WGT"){
                        data2.updateOnly("REC_TYPE", "WEIGHT");
                        if ( c.length > 7 )
                        {
                            data2.updateOnly("DATA",value);
                            data2.updateOnly("DATA1",c[5]);
                            data2.updateOnly("DATA2",c[6]);
                            data2.updateOnly("DATA3",c[7]);
                        }
                        else
                            data2.updateOnly("DATA",value);
                    }
                    else if ( recType == "PRESURE"){
                        data2.update("REC_TYPE", "PRS");
                        if ( c.length > 5 )
                        {
                            data2.updateOnly("DATA",value);
                            data2.updateOnly("DATA1",c[5]);
                            data2.updateOnly("DATA2",c[6]);
                        }
                        else
                            data2.updateOnly("DATA",value);
                    }
                    else
                        data2.update("DATA",value);
    
                    data2.updateOnly("LEGACY","");
                    v = data2.getColValues().split(",");
                    sheet.appendRow(v);
                    id++;
                    lastRow++;

                    if ( data2.arr.length > 13 )
                    {
                        SysLog.log(1,"COLNAMES","IMPROT LEGACY",data2.getColNames());
                        SysLog.log(1,"IMPROT LEGACY","data growing horizontally");
                        SysLog.log(1,"Data","IMPROT LEGACY",JSON.stringify(data2));
                        SysLog.log(1,"v length","IMPROT LEGACY",v.length.toString());
                        SysLog.log(1,"v tos end to sheet","IMPROT LEGACY",JSON.stringify(v));
                        
                        return 0;
                    }

                }
            }
        }
        if (records != null && records.length > 0) {
            sheet = ss.getSheetByName("Detail");
            range = sheet.getDataRange();
            lastRow = range.getLastRow();

            data2 = new KVPCollection();
            data2.initialize("ROW,IDMASTER,INACTIVE,ITEMID,CANT,DATA2");
            if (lastRow < 2) {
                let cols = data2.getColNames().split(",");
                sheet.appendRow(cols);
            }
            lastRow++;

            for (var i = 0; i < records.length; i++) {
                let row = [lastRow, id, "", records[i].itemId, records[i].cant, records[i].time,records[i].data2];
                sheet.appendRow(row);
                lastRow++;
            }
        }
        this.updateId("Id", id);
        SysLog.log(0,"RETURNING FROM IMPORT LEGACY");
        return id;
    }

    importGLUC(Data: KVPCollection): number {
        let data2 = new KVPCollection();
        data2.initialize("ROW,ID,INACTIVE,DAYS,MINUTES");
        data2.addRange(Data);


        let id = this.getId("Id");
        let fecha = data2.get("FECHA");
        let dt = Utils.getDateFromYMD(fecha);
        let days = Utils.getDays(dt);
        let year = fecha.substring(0, 4);
        let hora = data2.get("HORA");
        let fileName = `${year}_data`;
        let lastRow = 2;
        let ss = Utils.getCreateSpreadSheet(this.folder, fileName, "Master,Detail", data2.getColNames());
        let sheet = ss.getActiveSheet();
        let range = sheet.getDataRange();
        var lastColumn = range.getLastColumn();
        let lastYear:Number = new Date().getFullYear();
        lastRow = range.getLastRow() + 1;
        let recType = "";


        let glucData = data2.get("GLUC");
        let lines = data2.get("GLUC").split("\n");
        if ( lines.length < 2 )
        {
            lines = data2.get("GLUC").split(";");
        }
        let grid = range.getValues();
        grid = grid.filter(x => x[5] == "GLUC");
        let grid2;
        for (var i = 0; i < lines.length; i++) {
            let c = lines[i].split("\t");
            if (c.length > 4) {
                let dateParts = c[0].split(" ");
                let value = c[4];
                dt = Utils.getDateFromDMY(dateParts[0],"/");

                if ( dt == null )
                    continue;
                
                if ( dt.getFullYear() != lastYear )
                {
                    year = dt.getFullYear();
                    fileName = `${year}_data`;
                    ss = Utils.getCreateSpreadSheet(this.folder, fileName, "Master,Detail", data2.getColNames());
                    sheet = ss.getActiveSheet();
                    range = sheet.getDataRange();
                    lastColumn = range.getLastColumn();
                    lastRow = range.getLastRow() + 1;
                    lastYear = dt;
                    grid = range.getValues();
                }
                days = Utils.getDays(dt);
                fecha = dateParts[0];
                let fp = fecha.split("/");
                fecha = `${fp[2]}-${fp[1]}-${fp[0]}`;
                let minutes = Utils.getMinutes(dateParts[1]);
                hora = dateParts[1];

                grid2 = grid.filter(x => x[3] == days.toString() &&
                    x[4] == minutes.toString());
                

                if (grid2.length == 0) {
                    data2.update("ID", id.toString());
                    data2.update("ROW", lastRow.toString());
                    data2.update("DAYS", days.toString());
                    data2.update("MINUTES", minutes.toString());
                    data2.update("GLUC", value);
                    data2.update("FECHA",fecha);
                    data2.update("HORA",hora);
                    let v = data2.getColValues().split(",");
                    sheet.appendRow(v);
                    id++;
                    lastRow++;
                }
            }
        }
        this.updateId("Id", id);
        return id;
    }

    processForm(Data: KVPCollection, records: Array<RecordItemBase>, colSep="\t", lineSep = "\n"): number {
        SysLog.log(0, "data received", "processForm()", JSON.stringify(Data));
        SysLog.log(0, "records", "processForm()", JSON.stringify(records));

        let data2 = new KVPCollection();
        data2.initialize("ROW,ID,INACTIVE,DAYS,MINUTES");
        data2.addRange(Data);

        let recType = data2.get("REC_TYPE");
        if (recType == "GLUC")
            return this.importGLUC(Data);
        else if ( recType == "LEG")
            return this.importLegacy(Data, colSep,lineSep);


        let id = this.getId("Id");
        let fecha = data2.get("FECHA");
        let dt = Utils.getDateFromYMD(fecha);
        let days = Utils.getDays(dt);
        let year = fecha.substring(0, 4);
        let hora = data2.get("HORA");
        let fileName = `${year}_data`;
        let lastRow = 2;
        let ss = Utils.getCreateSpreadSheet(this.folder, fileName, "Master,Detail", data2.getColNames());
        let sheet = ss.getActiveSheet();
        let range = sheet.getDataRange();
        var lastColumn = range.getLastColumn();
        lastRow = range.getLastRow() + 1;

        data2.update("ID", id.toString());
        data2.update("ROW", lastRow.toString());
        data2.update("DAYS", days.toString());
        data2.update("MINUTES", Utils.getMinutes(hora).toString());


        let v = data2.getColValues().split(",");
        sheet.appendRow(v);

        if (records != null && records.length > 0) {
            sheet = ss.getSheetByName("Detail");
            range = sheet.getDataRange();
            lastRow = range.getLastRow();

            data2 = new KVPCollection();
            data2.initialize("ROW,IDMASTER,INACTIVE,ITEMID,CANT");
            if (lastRow < 2) {
                let cols = data2.getColNames().split(",");
                sheet.appendRow(cols);
            }
            lastRow++;

            for (var i = 0; i < records.length; i++) {
                let row = [lastRow, id, "", records[i].itemId, records[i].cant];
                sheet.appendRow(row);
                lastRow++;
            }
        }
        return id;
    }
}