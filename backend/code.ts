import { GSResponse } from "../Models/GSResponse";
import { RecordItem } from "../models/RecordItem";
import { Service } from "./service";
import { SysLog } from "./SysLog";


function testProcessForm()
{
    let d = `{"arr":[{"value":"GLUC","key":"REC_TYPE"},{"key":"FECHA","value":"2021-01-25"},{"key":"HORA","value":"16:26"},{"key":"GLUC","value":"CESAR CASTANO,,,,,,,,;# 59320932,,,,,,,,;LAGY322S00919,,,,,,,,;Time,Record Type,Meal Insulin (units),Long Acting Insulin (units),Glucose (mg/dL),Ketone (mmol/L),Adjustment Insulin (units),User Change Insulin (units),;09/01/2020 15:48,2,,,127,,,,;10/01/2020 12:34,2,,,144,,,,;10/01/2020 18:46,2,,,107,,,,;11/01/2020 14:30,2,,,135,,,,;12/01/2020 13:26,2,,,133,,,,"}]}`;
    let r = `[{"itemId":3,"cant":50,"id":0},{"itemId":4,"id":0,"cant":50}]`;
    r = "[]";

    let data = JSON.parse(d);
    let records = JSON.parse(r);
    processForm(data,records);
}
function testGetId()
{
    let sv = new Service();
    let result = sv.getId("Id");
}


function getDataDeclarations(names):string
{
    let sv = new Service();
    return sv.getDataDeclarations(names);
}

/* @Include JavaScript and CSS Files */
function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .getContent(); 303
}

function doGet(e) {
    return  HtmlService.createTemplateFromFile('frontend/index').evaluate();
}

function getSportTypes()
{
    let sv = new Service();
    let html = sv.getHtmlSelectFiltered("Items","SP","Select Sport","",true);
    return html;

}

function getEvents()
{
    let sv = new Service();
    let html = sv.getHtmlSelectFiltered("Items","EV","Select Event","",true);
    return html;

}

function getDrugItems()
{
    let sv = new Service();
    let response = new GSResponse();
    let json = "";
    try
    {
        json = sv.getDrugItems();
        SysLog.log(0,"DrugItems","code.ts getDrugItems()",json);
        response.addData("DrugItems",json)
    }
    catch(ex)
    {
        handleException(ex,response,"code.ts getFoodItems()")
    }
    return json;    //JSON.stringify(response);
}



function getExeItems()
{
    let sv = new Service();
    let response = new GSResponse();
    let json = "";
    try
    {
        json = sv.getExeItems();
        response.addData("ExeItems",json)
    }
    catch(ex)
    {
        handleException(ex,response,"code.ts getExeItems()")
    }
    return json;    //JSON.stringify(response);
}


function getRecTypes()
{
    let sv = new Service();
    let html = sv.getHtmlSelectFiltered("Items","RT","Select Record Type","",true);
    return html;
}

function getFoodItems()
{
    let sv = new Service();
    let response = new GSResponse();
    let json = "";
    try
    {
        json = sv.getFoodItems();
        SysLog.log(0,"FoodItems","code.ts getFoodItems()",json);
        response.addData("FoodItems",json)
    }
    catch(ex)
    {
        handleException(ex,response,"code.ts getFoodItems()")
    }
    return json;    //JSON.stringify(response);
}




function getPageArr(){
    return "";
}

function processForm(Data, records) {
    Logger.log("processForm() Data");
    Logger.log(Data);
    Logger.log(records);

    let sv = new Service();
    let html = "";
    let result = new GSResponse();
    try {
        let id = sv.processForm(Data, records);
        if ( id >= 0 )
        {
            result.id = id;
            result.domainResult = 0;
            result.messages.push(`Record was added with id: ${id}`);
        }
        else
        {
            result.domainResult = -1;
            result.id = -1;
        }
    }
    catch (ex) {
        Logger.log("Exception. parameters received:");
        Logger.log(ex);
        result.addError("error", ex.message);
        result.messages.push(ex.message);
        result.messages.push(ex.stack);
    }
    return JSON.stringify(result);
}


function getSelectArr(){
    return "";
}


function getItems()
{
    let sv = new Service();
    return sv.getItems();
}

function handleException(ex, response, method ="", additional = "" )
{
    response.result = 500;
    response.addError("Exception",ex.message);
    response.addError("StackTrace",ex.stackTrace);
    response.addError("method", method);
    response.addError("additional",additional);

    SysLog.logException(ex,method,additional)
}

function getForm(controlId,formId, formUrl):string{
    var response = new GSResponse();

    response.controlId = controlId;
    response.formId = formId;
    
    try
    {
        let sv = new Service();
        response =  sv.getForm(formId,formUrl);
    }
    catch(ex)
    {
       handleException(ex,response,"code.ts getForm()")
    }
    return JSON.stringify(response);
}




