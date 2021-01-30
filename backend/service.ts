import { DomainResponse } from "../models/DomainResponse";
import { FileInfo } from "../Models/FileInfo";
import { FileProcessItem } from "../models/FileProcessItem";
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

    getLogLevel(tabName): number {
        SysLog.level = 0;
        let sheet = this.db.getSheetByName(tabName);
        let rangeData = sheet.getRange(1, 1, 2, 2);
        let value = rangeData.getCell(2, 2).getValue();
        if (value == null)
            value = 0;

        SysLog.level = Number(value);
        return value;
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

    importBatchLegacy(url): FileProcessItem {
        let dt;
        let days = 0;

        let year = 0;
        let hora = "";
        let fileName = "";
        let lastRow = 2;
        let grid2;
        let ss;
        let sheet;
        let range;
        let lastColumn = 0;
        let lastYear = new Date().getFullYear();
        let grid;
        let value;
        let recType = "";
        let drugItems = Utils.getData(this.db, "DrugItems");
        let records = new Array<RecordItemBase>();
        let minutes = 0;
        let v;
        let Y = 0;
        let M = 0;
        let D = 0;
        let DOW = 0;
        let fecha = "";
        let i = 0;
        let ssSource;
        let gridSource;
        let fpi = new FileProcessItem();
        let c;


        ssSource = Utils.openSpreadSheet(url);
        if (ssSource == null)
            return fpi;

        let ssFile = Utils.getFileByName(ssSource.getName());
        let fi = new FileInfo();
        fi.setFileInfo(ssFile);
        fpi.setFileInfo(fi);

        sheet = ssSource.getActiveSheet();
        var rangeData = sheet.getDataRange();
        lastColumn = rangeData.getLastColumn();
        fpi.totalRows = rangeData.getLastRow();
        gridSource = rangeData.getValues();

        let data2 = new KVPCollection();
        data2.initialize("ROW,ID,INACTIVE,DAYS,MINUTES,Y,M,D,DOW,REC_TYPE,FECHA,HORA,DATA");

        let id = this.getId("Id");

        SysLog.log(0, "grid", "importLegacy()", `grid length: ${gridSource.length} lastColumn:${lastColumn}`);
        for (i = 1; i < gridSource.length; i++) {
            try {
                Logger.log(`Processing ${fi.name} ${i}/${gridSource.length}`);
                c = gridSource[i];
                dt = c[2];
                if (dt == null) {
                    SysLog.log(0, "date is NULL", "improtBatchLegacy()", `${i} ${recType}`)
                    continue;
                }

                if (dt.getFullYear() != lastYear) {
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

                SysLog.log(1,`Processing ${i}`,"importBatchLegacy()",JSON.stringify(c));
                recType = c[1].toUpperCase();
                fecha = Utils.getYMD(dt);
                days = Utils.getDays(dt);
                let tm = c[3];
                //minutes = tm.getHours() * 60 + tm.getMinutes();
                hora = Utils.getHM(tm);
                minutes = Utils.getMinutes(hora);
                value = c[4];

                grid2 = grid.filter(x => x[3] == days.toString() &&
                    x[4] == minutes.toString() &&
                    x[5] == recType);

                if (grid2.length > 0) {
                    SysLog.log(0, "row exists.", "improtBatchLegacy()", `${i} ${recType}`, JSON.stringify(grid2));
                    continue;
                }

                Y = dt.getFullYear();
                M = dt.getMonth() + 1;
                D = dt.getDate();
                DOW = dt.getDay();
                data2.update("D", D.toString());
                data2.update("M", M.toString());
                data2.update("Y", Y.toString());
                data2.update("DOW", DOW.toString());
                data2.update("ID", id.toString());
                data2.update("ROW", lastRow.toString());
                data2.update("DAYS", days.toString());
                data2.update("MINUTES", minutes.toString());
                data2.update("FECHA", fecha);
                data2.update("HORA", hora);

                let r = new RecordItemBase();
                r.id = id;

                data2.update("REC_TYPE", recType);
                if (recType == "DRUG") {
                    data2.update("DATA", "");
                    let drug = drugItems.filter(x => x[5] == value)
                    if (drug.length > 0) {
                        r.cant = 1;
                        r.itemId = Number(drug[0][0]);
                        records.push(r);
                    }
                }
                else if (recType == "EXE") {
                    data2.update("DATA", "");
                    r.itemId = 0;
                    r.cant = Number(value);
                    if (c.length < 4) {
                        r.time = Utils.getSeconds(c[5]).toString();
                        r.data2 = c[5];
                    }
                    records.push(r);
                }
                else if (recType == "WGT") {
                    data2.update("REC_TYPE", "WEIGHT");
                    if (c.length > 7) {
                        data2.update("DATA", value);
                        data2.update("DATA1", c[5]);
                        data2.update("DATA2", c[6]);
                        data2.update("DATA3", c[7]);
                    }
                    else
                        data2.update("DATA", value);
                }
                else if (recType == "PRESURE") {
                    data2.update("REC_TYPE", "PRS");
                    if (c.length > 5) {
                        data2.update("DATA", value);
                        data2.update("DATA1", c[5]);
                        data2.update("DATA2", c[6]);
                    }
                    else
                        data2.update("DATA", value);
                }
                else
                    data2.update("DATA", value);

                data2.update("LEGACY", "");
                v = data2.getColValues().split(",");
                sheet.appendRow(v);
                id++;
                lastRow++;
            }
            catch (ex) {
                fpi.failRows++;
                fpi.failRow = i;
                fpi.error = ex.message;
                SysLog.logException(ex, `importBatchLegacy() Error Line ${i}`, JSON.stringify(c));
                //break;
                //throw ex;
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

            for (i = 0; i < records.length; i++) {
                let row = [lastRow, records[i].id, "", records[i].itemId, records[i].cant, records[i].time, records[i].data2];
                sheet.appendRow(row);
                lastRow++;
            }
        }
        id--;
        this.updateId("Id", id);
        SysLog.log(0, "MOVING SOURCE FILE");
        try {
            Utils.moveFiles(ssFile.getId(), this.folder);
            let movedFile = DriveApp.getFileById(fpi.fi.id);
            fi = new FileInfo();
            fi.setFileInfo(movedFile);
            fpi.setFileInfo(fi);
            fpi.id = id;
        }
        catch (ex) {
            SysLog.logException(ex, `importBatchLegacy() Moving files`, JSON.stringify(fpi), JSON.stringify(fi));
        }
        Logger.log("RETURNING...");
        return fpi;
    }


    importBatchGluc(url): FileProcessItem {
        let dt;
        let days = 0;

        let year = 0;
        let hora = "";
        let fileName = "";
        let lastRow = 2;
        let grid2;
        let ss;
        let sheet;
        let range;
        let lastColumn = 0;
        let lastYear = 0;
        let grid;
        let recType = "";
        let drugItems = Utils.getData(this.db, "DrugItems");
        let records = new Array<RecordItemBase>();
        let minutes = 0;
        let v;
        let Y = 0;
        let M = 0;
        let D = 0;
        let DOW = 0;
        let fecha = "";
        let i = 0;
        let ssSource;
        let gridSource;
        let fpi = new FileProcessItem();
        let c;
        let value;


        ssSource = Utils.openSpreadSheet(url);
        if (ssSource == null)
            return fpi;

        let ssFile = Utils.getFileByName(ssSource.getName());
        let fi = new FileInfo();
        fi.setFileInfo(ssFile);
        fpi.setFileInfo(fi);

        sheet = ssSource.getActiveSheet();
        var rangeData = sheet.getDataRange();
        lastColumn = rangeData.getLastColumn();
        fpi.totalRows = rangeData.getLastRow();
        gridSource = rangeData.getValues();

        let data2 = new KVPCollection();
        data2.initialize("ROW,ID,INACTIVE,DAYS,MINUTES,Y,M,D,DOW,REC_TYPE,FECHA,HORA,DATA");

        let id = this.getId("Id");
        data2.update("REC_TYPE","GLUC")

        SysLog.log(0, "grid", "importLegacyGLUC()", `grid length: ${gridSource.length} lastColumn:${lastColumn}`);
        for (i = 1; i < gridSource.length; i++) {
            try {

                c = gridSource[i];
                if (c[1] != "2")
                    continue;

                dt = c[0];
                if ( !Utils.isDate(dt))
                    dt = Utils.getDateYMDFromDMY(dt.toString(),"/");

                SysLog.log(1,`Processing ${i}`,"importBatchGLUC()",JSON.stringify(c));


                value = c[4];

                if (dt.getFullYear() != lastYear) {
                    year = dt.getFullYear();
                    fileName = `${year}_data`;
                    ss = Utils.getCreateSpreadSheet(this.folder, fileName, "Master,Detail", data2.getColNames());
                    sheet = ss.getActiveSheet();
                    range = sheet.getDataRange();
                    lastColumn = range.getLastColumn();
                    lastRow = range.getLastRow() + 1;
                    lastYear = year;
                    grid = range.getValues();
                    Logger.log(`Processing New Year ${fi.name} ${i}/${gridSource.length} date:${JSON.stringify(dt)}`);
                }

                days = Utils.getDays(dt);


                grid2 = grid.filter(x => x[3] == days.toString() &&
                    x[4] == minutes.toString());

                if (grid2.length > 0) {
                    fpi.duplicates++;
                    fpi.failRow = i;
                    SysLog.log(0, `duplicatesGLUC ${i}","importBatchGLUC()`, JSON.stringify(c));
                    continue;
                }

                Y = dt.getFullYear();
                M = dt.getMonth() + 1;
                D = dt.getDate();
                DOW = dt.getDay();
                fecha = Utils.getYMD(dt);
                if ( fecha == "" )
                {
                    fecha = Utils.getDateYMDFromDMY(dt.toString());
                    hora = Utils.getHourFromDMY(dt.toString());
                }
                else
                    hora = Utils.getHM(dt);
                minutes = Utils.getMinutes(hora);

                data2.update("D", D.toString());
                data2.update("M", M.toString());
                data2.update("Y", Y.toString());
                data2.update("DOW", DOW.toString());
                data2.update("ID", id.toString());
                data2.update("ROW", lastRow.toString());
                data2.update("DAYS", days.toString());
                data2.update("MINUTES", minutes.toString());
                data2.update("DATA", value);
                data2.update("FECHA", fecha);
                data2.update("HORA", hora);
                let v = data2.getColValues().split(",");
                sheet.appendRow(v);
                fpi.okRows++;
                id++;
                lastRow++;
            }
            catch (ex) {
                fpi.failRows++;
                fpi.failRow = i;
                fpi.error = ex.message;
                SysLog.logException(ex, `importBatchGLUC() Error Line ${i}`, JSON.stringify(c));

                //break;
                //throw ex;
            }

        }

        id--;
        this.updateId("Id", id);
        SysLog.log(0, "MOVING SOURCE FILE");
        try {
            Utils.moveFiles(ssFile.getId(), this.folder);
            let movedFile = DriveApp.getFileById(fpi.fi.id);
            fi = new FileInfo();
            fi.setFileInfo(movedFile);
            fpi.setFileInfo(fi);
            fpi.id = id;
        }
        catch (ex) {
            SysLog.logException(ex, `importBatchGLUC() Moving files`, JSON.stringify(fpi), JSON.stringify(fi));
        }
        Logger.log("RETURNING...");
        return fpi;
    }

    renderBatchResults(fpi: FileProcessItem):string {
        let html = `<table>
        <tr>
            <td>File Name:</td>
            <td>${fpi.fi.name}</td>
        </tr>
        <tr>
            <td>Folder:</td>
            <td>${fpi.fi.getFirstDir()}</td>
        </tr>
        <tr>
            <td>Date Modified:</td>
            <td>${fpi.fi.dateModified.toString()}</td>
        </tr>
        <tr>
            <td>Total Rows:</td>
            <td>${fpi.totalRows}</td>
        </tr>
        <tr>
            <td>OK Rows:</td>
            <td>${fpi.okRows}</td>
        </tr>
        <tr>
            <td>Fail Rows:</td>
            <td>${fpi.failRows}</td>
        </tr>
        <tr>
            <td>Duplicates</td>
            <td>${fpi.duplicates}</td>
        </tr>
    
    </table>
        `;

        return html;
    }

    processForm(Data: KVPCollection, records: Array<RecordItemBase>, colSep = "\t", lineSep = "\n"): GSResponse {
        this.getLogLevel("Id");
        SysLog.log(1, "data received", "processForm()", JSON.stringify(Data));
        SysLog.log(1, "records", "processForm()", JSON.stringify(records));

        let response = new GSResponse();
        let data2 = new KVPCollection();
        data2.initialize("ROW,ID,INACTIVE,DAYS,MINUTES,Y,M,D,DOW");
        data2.addRange(Data);

        let recType = data2.get("REC_TYPE");
        let fpi = new FileProcessItem();
        let url = "";
        if (recType == "GLUC")
        {
            url = data2.get("URL");
            if ( url != "" )
            {
                fpi = this.importBatchGluc(url);
                response.addHtml("modalBody",this.renderBatchResults(fpi));
                return response;
            }
        }
        else if (recType == "LEG")
        {
            url = data2.get("URL");
            if ( url != "" )
            {
                fpi = this.importBatchLegacy(url);
                response.addHtml("modalBody",this.renderBatchResults(fpi));
                return response;
            }
        }


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
        let Y = 0;
        let M = 0;
        let D = 0;
        let DOW = 0;
        lastRow = range.getLastRow() + 1;


        data2.update("ID", id.toString());
        data2.update("ROW", lastRow.toString());
        data2.update("DAYS", days.toString());
        data2.update("MINUTES", Utils.getMinutes(hora).toString());
        Y = dt.getFullYear();
        M = dt.getMonth() + 1;
        D = dt.getDate();
        DOW = dt.getDay();
        data2.update("D", D.toString());
        data2.update("M", M.toString());
        data2.update("Y", Y.toString());
        data2.update("DOW", DOW.toString());


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
                let row;
                
                if ( recType == "EXE")
                {
                    let seconds = Utils.getSeconds2(records[i].time);
                    row  = [lastRow, id, "", records[i].itemId, records[i].cant,seconds,records[i].time];
                }
                else 
                    row  = [lastRow, id, "", records[i].itemId, records[i].cant];

                sheet.appendRow(row);
                lastRow++;
            }
        }
        response.showModal = true;
        response.id = id;
        return response;
    }

    importGLUC(Data: KVPCollection): number {
        let data2 = new KVPCollection();
        data2.initialize("ROW,ID,INACTIVE,DAYS,MINUTES,Y,M,D,DOW");
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
        let lastYear: Number = new Date().getFullYear();
        lastRow = range.getLastRow() + 1;
        let recType = "";
        let Y = 0;
        let M = 0;
        let D = 0;
        let DOW = 0;


        let glucData = data2.get("GLUC");
        let lines = data2.get("GLUC").split("\n");
        if (lines.length < 2) {
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
                fecha = dateParts[0];
                dt = Utils.getDateFromDMY(dateParts[0], "/");

                if (dt == null)
                    continue;

                if (dt.getFullYear() != lastYear) {
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
                let fp = fecha.split("/");
                fecha = `${fp[2]}-${fp[1]}-${fp[0]}`;
                let minutes = Utils.getMinutes(dateParts[1]);
                hora = dateParts[1];

                grid2 = grid.filter(x => x[3] == days.toString() &&
                    x[4] == minutes.toString());


                if (grid2.length == 0) {
                    Y = dt.getFullYear();
                    M = dt.getMonth() + 1;
                    D = dt.getDate();
                    DOW = dt.getDay();
                    data2.update("D", D.toString());
                    data2.update("M", M.toString());
                    data2.update("Y", Y.toString());
                    data2.update("DOW", DOW.toString());
                    data2.update("ID", id.toString());
                    data2.update("ROW", lastRow.toString());
                    data2.update("DAYS", days.toString());
                    data2.update("MINUTES", minutes.toString());
                    data2.update("GLUC", value);
                    data2.update("FECHA", fecha);
                    data2.update("HORA", hora);
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

}