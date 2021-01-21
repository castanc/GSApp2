import { GSResponse } from "../Models/GSResponse";
import { Service } from "./service";
import { SysLog } from "./SysLog";


/* @Include JavaScript and CSS Files */
function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
        .getContent(); 303
}

function doGet(e) {
    return  HtmlService.createTemplateFromFile('frontend/index').evaluate();
}

function getDataDeclarations(names):string
{
    let sv = new Service();
    return sv.getDataDeclarations(names);
}

function getPageArr(){
    return "";
}

function getSelectArr(){
    return "";
}

function getRecTypes()
{
    let sv = new Service();
    let html = sv.getHtmlSelectFiltered("Items","RT","Select Record Type");
    return html;
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
    response.addError("StackTrace",ex.StackTrace);

    SysLog.logException(ex,method,additional)
}

function getForm(formId, formUrl):string{
    var response = new GSResponse();
    
    try
    {
        let sv = new Service();
        let html = sv.getForm(formId,formUrl);
        if ( html.length == 0 )
        {
            response.domainResult = sv.result;
            response.addError("result",sv.message,404);
            response.addError("link",`<a href="${formUrl}">Check Form</a>`);
        }
        response.addHtml("content",html);
    }
    catch(ex)
    {
       handleException(ex,response,"code.ts getForm()")
    }
    return JSON.stringify(response);
}




