import { GSResponse } from "../Models/GSResponse";
import { RecordItem } from "../models/RecordItem";
import { Service } from "./service";
import { SysLog } from "./SysLog";
import { Utils } from "./Utils";


function testGetLogLevel()
{
    let sv = new Service();
    sv.getLogLevel("Id");
}
function testImportBatchGLUC()
{
    let url = "https://docs.google.com/spreadsheets/d/18TRvXTSThhQHQ9KzhHC8_aTttC9Uc08TOCx1Zf4gfqI/edit#gid=0";
    try
    {
    let sv = new Service();
    let result = sv.importBatchGluc(url);
    }
    catch(ex)
    {
        SysLog.logException(ex,"test");
    }

}

function testImportLegacy()
{
    try
    {
    let sv = new Service();
    let result = sv.importBatchLegacy("https://docs.google.com/spreadsheets/d/1p6R1hKee7tp8OWwkSIvlgmHP2yz2jVMymBbmRKCZd3M/edit#gid=0");
    }
    catch(ex)
    {
        SysLog.logException(ex,"test");
    }
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

function processForm(Data, records, colSep = "\t", lineSep = "\bn") {

    let sv = new Service();
    let html = "";
    let result = new GSResponse();
    try {
        SysLog.level = 1;
        result = sv.processForm(Data, records,colSep,lineSep);
        if ( result.id >= 0 )
        {
            result.domainResult = 0;
            result.messages.push(`Record was added with id: ${result.id}`);
        }
        else
        {
            result.domainResult = -1;
            result.id = -1;
        }
    }
    catch (ex) {
        SysLog.logException(ex,"processForm()");
        result.addError("error", ex.message);
        result.messages.push(ex.message);
        result.messages.push(ex.stack);
        result.showModal = false;
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




