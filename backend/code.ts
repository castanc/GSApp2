import { GSResponse } from "../Models/GSResponse";
import { RecordItem } from "../models/RecordItem";
import { Service } from "./service";
import { SysLog } from "./SysLog";

function testProcessForm()
{
    let d = `{"arr":[{"key":"REC_TYPE","value":"FOOD"},{"key":"FECHA","value":"2021-01-23"},{"key":"HORA","value":"09:32"},{"value":"BRKF","key":"MEAL_TYPES"}]}`;
    let r = `[{"itemId":3,"cant":50,"id":0},{"itemId":4,"id":0,"cant":50}]`;

    let data = JSON.parse(d);
    let records = JSON.parse(r);
    processForm(data,records);
}
function testGetId()
{
    let sv = new Service();
    let result = sv.getId("Id");
}



/* @Include JavaScript and CSS Files */
function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .getContent(); 303
}

function doGet(e) {
    return  HtmlService.createTemplateFromFile('frontend/index').evaluate();
}

function getRecTypes()
{
    let sv = new Service();
    let html = sv.getHtmlSelectFiltered("Items","RT","Select Record Type",true);
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



function getDataDeclarations(names):string
{
    let sv = new Service();
    return sv.getDataDeclarations(names);
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




