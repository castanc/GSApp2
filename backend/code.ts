import { GSResponse } from "../Models/GSResponse";
import { RecordItem } from "../models/RecordItem";
import { Service } from "./service";
import { SysLog } from "./SysLog";


function testProcessForm()
{
    let glucData = `CESAR CASTANO							
    # 59320932							
    LAGY322S00919							
    Time	Record Type	Meal Insulin (units)	Long Acting Insulin (units)	Glucose (mg/dL)	Ketone (mmol/L)	Adjustment Insulin (units)	User Change Insulin (units)
    09/01/2020 15:48	2			127			
    10/01/2020 12:34	2			144			
    10/01/2020 18:46	2			107			
    11/01/2020 14:30	2			135			
    12/01/2020 13:26	2			133			
    13/01/2020 10:42	2			128			
    13/01/2020 23:23	2			111			
    14/01/2020 09:38	2			93			
    14/01/2020 20:42	2			90			
    14/01/2020 23:18	2			158			
    15/01/2020 13:55	2			126			
    15/01/2020 21:06	2			102			
    15/01/2020 23:10	2			96			
    16/01/2020 10:43	2			106			
    16/01/2020 20:36	2			103			
    16/01/2020 22:58	2			113			
    17/01/2020 11:25	2			113			
    17/01/2020 21:05	2			158			
    17/01/2020 23:21	2			160			
    18/01/2020 12:38	2			119			
    18/01/2020 17:36	2			86			
    18/01/2020 19:34	2			118			
    19/01/2020 13:47	2			129			
    19/01/2020 19:27	2			84			
    19/01/2020 21:12	2			127			
    20/01/2020 10:11	2			110			
    21/01/2020 09:38	2			112			
    22/01/2020 21:06	2			86			
    23/01/2020 21:13	2			20			
    24/01/2020 09:05	2			111			
    25/01/2020 11:42	2			116			
    27/01/2020 08:53	2			111			
    29/01/2020 20:15	2			102			
    30/01/2020 00:00	2			173			
    30/01/2020 20:03	2			98			
    31/01/2020 08:17	2			113			
    31/01/2020 21:22	2			90			
    31/01/2020 23:10	2			155			
    01/02/2020 14:14	2			117			
    03/02/2020 20:39	2			92			
    03/02/2020 23:38	2			118			
    05/02/2020 21:21	2			101			
    05/02/2020 23:09	2			91			
    06/02/2020 20:43	2			87			
    06/02/2020 22:51	2			96			
    08/02/2020 0:13	2			96			
    08/02/2020 15:05	2			108			
    08/02/2020 21:27	2			155			
    09/02/2020 13:40	2			119			
    09/02/2020 21:36	2			129			
    10/02/2020 8:35	2			131			
    10/02/2020 21:19	2			91			
    11/02/2020 9:21	2			104			
    12/02/2020 8:32	2			103			
    12/02/2020 23:13	2			113			
    13/02/2020 09:20	2			118			
    13/02/2020 22:39	2			133			
    14/02/2020 09:09	2			98			
    14/02/2020 20:44	2			118			
    14/02/2020 23:02	2			110			
    15/02/2020 11:53	2			116			
    15/02/2020 19:52	2			100			
    16/02/2020 15:01	2			105			
    17/02/2020 23:18	2			103			
    18/02/2020 22:53	2			118			
    19/02/2020 21:17	2			106			
    21/02/2020 08:01	2			117			
    26/02/2020 20:45	2			20			
    14/03/2020 12:33	2			89			
    15/03/2020 11:12	2			96			
    16/03/2020 09:28	2			112			
    17/03/2020 09:35	2			125			
    18/03/2020 09:24	2			117			
    18/03/2020 14:52	2			95			
    19/03/2020 09:47	2			138			
    20/03/2020 09:35	2			108			
    21/03/2020 10:30	2			120			
    22/03/2020 12:53	2			115			
    23/03/2020 07:21	2			110			
    23/03/2020 18:13	2			105			
    25/03/2020 08:44	2			108			
    26/03/2020 09:20	2			126			
    27/03/2020 08:28	2			131			
    28/03/2020 08:41	2			127			
    29/03/2020 09:59	2			123			
    29/03/2020 18:48	2			166			
    30/03/2020 08:56	2			135			
    30/03/2020 19:20	2			172			
    31/03/2020 10:13	2			127			
    31/03/2020 16:51	2			73			
    01/04/2020 9:34	2			128			
    01/04/2020 16:47	2			86			
    02/04/2020 8:39	2			105			
    03/04/2020 8:30	2			111			
    03/04/2020 19:34	2			101			
    04/04/2020 11:04	2			111			
    05/04/2020 10:23	2			120			
    06/04/2020 8:50	2			114			
    07/04/2020 8:48	2			122			
    08/04/2020 8:44	2			105			
    27/04/2020 17:41	2			158			
    28/04/2020 08:26	2			137			
    28/04/2020 18:49	2			98			
    29/04/2020 08:50	2			151			
    29/04/2020 18:33	2			107			
    30/04/2020 09:48	2			152			
    30/04/2020 18:30	2			80			
    01/05/2020 9:50	2			126			
    02/05/2020 10:23	2			155			
    02/05/2020 18:41	2			89			
    03/05/2020 10:34	2			134			
    03/05/2020 19:13	2			138			
    04/05/2020 8:43	2			146			
    05/05/2020 8:39	2			127			
    05/05/2020 18:04	2			73			
    06/05/2020 7:48	2			141			
    06/05/2020 18:18	2			134			
    07/05/2020 9:22	2			103			
    08/05/2020 8:50	2			119			
    08/05/2020 18:49	2			103			
    08/05/2020 19:58	2			59			
    09/05/2020 10:52	2			138			
    10/05/2020 11:25	2			135			
    11/05/2020 11:51	2			138			
    13/05/2020 11:01	2			133			
    25/05/2020 19:35	2			135			
    26/05/2020 07:37	2			188			
    26/05/2020 16:22	2			157			
    27/05/2020 07:31	2			156			
    27/05/2020 20:25	2			117			
    28/05/2020 07:24	2			135			
    28/05/2020 15:21	2			109			
    28/05/2020 21:44	2			179			
    29/05/2020 07:51	2			144			
    29/05/2020 17:10	2			115			
    30/05/2020 11:01	2			138			
    31/05/2020 12:39	2			158			
    31/05/2020 17:13	2			59			
    01/06/2020 7:51	2			151			
    01/06/2020 17:53	2			117			
    02/06/2020 9:13	2			161			
    03/06/2020 8:35	2			141			
    03/06/2020 18:20	2			74			
    04/06/2020 8:07	2			128			
    04/06/2020 17:50	2			112			
    05/06/2020 9:18	2			147			
    06/06/2020 9:27	2			173			
    06/06/2020 21:07	2			130			
    07/06/2020 11:58	2			146			
    07/06/2020 19:33	2			151			
    08/06/2020 8:07	2			152			
    08/06/2020 19:48	2			115			
    09/06/2020 8:30	2			129			
    10/06/2020 8:46	2			145			
    11/06/2020 8:43	2			142			
    12/06/2020 7:59	2			154			
    13/06/2020 09:32	2			181			
    13/06/2020 19:57	2			114			
    14/06/2020 09:49	2			194			
    15/06/2020 10:55	2			145			
    15/06/2020 17:36	2			126			
    16/06/2020 08:17	2			141			
    16/06/2020 21:16	2			100			
    17/06/2020 08:11	2			151			
    17/06/2020 17:41	2			87			
    18/06/2020 08:08	2			128			
    19/06/2020 09:02	2			140			
    19/06/2020 17:40	2			93			
    20/06/2020 10:03	2			158			
    21/06/2020 10:52	2			166			
    22/06/2020 08:45	2			146			
    23/06/2020 20:15	2			85			
    24/06/2020 19:21	2			128			
    25/06/2020 17:03	2			128			
    26/06/2020 08:30	2			148			
    26/06/2020 18:04	2			119			
    28/06/2020 13:19	2			151			
    28/06/2020 17:44	2			93			
    29/06/2020 09:49	2			157			
    29/06/2020 17:12	2			135			
    30/06/2020 10:01	2			170			
    30/06/2020 17:24	2			90			
    01/07/2020 8:21	2			156			
    02/07/2020 10:21	2			137			
    02/07/2020 19:11	2			112			
    03/07/2020 11:10	2			131			
    03/07/2020 21:24	2			123			
    04/07/2020 11:39	2			133			
    05/07/2020 17:24	2			135			
    06/07/2020 7:52	2			143			
    06/07/2020 17:29	2			135			
    06/07/2020 21:27	2			118			
    07/07/2020 12:00	2			154			
    08/07/2020 21:34	2			96			
    09/07/2020 9:19	2			146			
    10/07/2020 8:23	2			138			
    11/07/2020 17:33	2			107			
    13/07/2020 08:23	2			135			
    14/07/2020 09:25	2			168			
    15/07/2020 10:48	2			159			
    15/07/2020 17:43	2			120			
    16/07/2020 09:32	2			130			
    17/07/2020 18:05	2			103			
    18/07/2020 12:11	2			165			
    19/07/2020 13:02	2			149			
    19/07/2020 20:46	2			82			
    20/07/2020 09:39	2			145			
    20/07/2020 17:32	2			106			
    21/07/2020 09:33	2			149			
    21/07/2020 20:25	2			99			
    22/07/2020 09:09	2			135			
    22/07/2020 17:43	2			114			
    22/07/2020 21:29	2			116			
    23/07/2020 09:16	2			134			
    23/07/2020 13:22	2			66			
    24/07/2020 09:12	2			128			
    24/07/2020 20:54	2			128			
    26/07/2020 12:49	2			167			
    27/07/2020 09:15	2			145			
    11/08/2020 9:19	2			178			
    12/08/2020 8:39	2			189			
    12/08/2020 17:52	2			148			
    12/08/2020 20:22	2			133			
    13/08/2020 08:46	2			133			
    13/08/2020 19:46	2			114			
    14/08/2020 08:16	2			156			
    15/08/2020 08:39	2			165			
    16/08/2020 09:46	2			187			
    16/08/2020 18:16	2			81			
    17/08/2020 08:03	2			130			
    17/08/2020 17:49	2			119			
    17/08/2020 21:55	2			100			
    18/08/2020 09:56	2			138			
    18/08/2020 19:32	2			108			
    18/08/2020 21:33	2			120			
    19/08/2020 08:34	2			141			
    19/08/2020 19:52	2			130			
    19/08/2020 21:58	2			117			
    20/08/2020 10:06	2			131			
    21/08/2020 07:51	2			145			
    26/08/2020 21:07	2			215			
    27/08/2020 17:34	2			203			
    28/08/2020 09:45	2			210			
    29/08/2020 11:29	2			255			
    30/08/2020 13:03	2			201			
    31/08/2020 09:07	2			166			
    01/09/2020 9:02	2			137			
    01/09/2020 16:27	2			74			
    02/09/2020 10:21	2			149			
    02/09/2020 17:50	2			53			
    03/09/2020 10:16	2			151			
    03/09/2020 18:02	2			128			
    04/09/2020 10:23	2			157			
    05/09/2020 11:43	2			154			
    05/09/2020 17:44	2			178			
    06/09/2020 13:12	2			213			
    07/09/2020 9:24	2			163			
    08/09/2020 10:27	2			178			
    08/09/2020 17:27	2			93			
    09/09/2020 9:32	2			154			
    09/09/2020 18:01	2			87			
    10/09/2020 9:59	2			182			
    10/09/2020 18:13	2			80			
    10/09/2020 21:24	2			139			
    11/09/2020 11:38	2			156			
    11/09/2020 18:19	2			65			
    11/09/2020 21:33	2			192			
    12/09/2020 11:04	2			140			
    12/09/2020 13:42	2			126			    `;
    let d = `{"arr":[{"key":"REC_TYPE","value":"GLUC"},{"key":"FECHA","value":"2021-01-23"},{"key":"HORA","value":"09:32"},{"value":"${glucData}","key":"GLUC"}]}`;
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




