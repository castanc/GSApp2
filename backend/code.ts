import { GSResponse } from "../Models/GSResponse";
import { RecordItem } from "../models/RecordItem";
import { Service } from "./service";
import { SysLog } from "./SysLog";
import { Utils } from "./Utils";


function testLegacy(){
    let d = `{"arr":[{"value":"LEG","key":"REC_TYPE"},{"value":"2021-01-26","key":"FECHA"},{"value":"14:05","key":"HORA"},{"value":"0\tFOOD\t2020-11-29\t13:16\tColita de cuadril, puré, agua\t\n1\tEXE\t2020-11-28\t13:00\t2000\t0:47:33\n2\tEXE\t2020-11-28\t13:00\t2000\t0:47:33\n4\tFOOD\t2020-11-30\t22:11\tMilanesa pescado, puré, lechuga, agua\t\n5\tDRUG\t2020-11-30\t22:11\tDIAF\t\n6\tDRUG\t2020-11-30\t22:11\tNOVONORM\t\n7\tFOOD\t2020-11-30\t20:00\tChocolatina arcor 1/5\t\n8\tEXE\t2020-11-30\t21:00\t2000\t0:47:33\n9\tFOOD\t2020-11-30\t8:00\t2 huevos, chocolight\t\n10\tFOOD\t2020-11-30\t13:00\tEntrecort, lechug, agua\t\n11\tFOOD\t2020-11-29\t20:00\tEspaguetis al tuco*n*, agua\t\n12\tDRUG\t2020-11-29\t20:00\tNOVONORM\t\n13\tDRUG\t2020-11-29\t20:00\tDIAF\t\n14\tFOOD\t2020-11-29\t23:00\tCerveza patricia 1 bt, paoas ceunch 90 gr, queso muzarela 200 gr\t\n15\tFOOD\t2020-11-29\t13:00\tColita de cuadril, puré, agua\t\n16\tEXE\t2020-11-28\t22:18\t2000\t0:47:30\n17\tFOOD\t2020-12-01\t16:55\tCarne , kale,lechuga,agua\t\n18\tDRUG\t2020-12-01\t16:55\tDIAF\t\n19\tDRUG\t2020-12-01\t13:30\tDIARIS\t\n20\tFOOD\t2020-12-01\t7:40\t2 huevos, chocolight\t\n21\tFOOD\t2020-12-01\t20:00\tChocolatina arcor 16 gr\t\n22\tEXE\t2020-12-01\t21:00\t2050\t0:48:33\n23\tFOOD\t2020-12-01\t21:00\tMilanesa pescado, kale, lechuga, limón, melón, agua, 1 galleta\t\n24\tDRUG\t2020-12-01\t21:00\tDIAF\t\n25\tDRUG\t2020-12-02\t8:30\tDIARIS\t\n26\tFOOD\t2020-12-02\t8:30\t2 huevos, chocolight, melòn\t\n27\tFOOD\t2020-12-02\t13:50\tCarne, puré, mrlón, lechuga, kale, limón\t\n28\tDRUG\t2020-12-02\t13:50\tDIAF\t\n29\tDRUG\t2020-12-03\t23:30\tDIAF\t\n30\tFOOD\t2020-12-03\t13:30\tCarne, kale, melòn, limòn, agua\t\n31\tFOOD\t2020-12-04\t7:00\tW hiebos, vhocomight, gslketas integrales\t\n32\tFOOD\t2020-12-04\t13:36\tCarne colita de cuadtil, puré, kale, melón, likòn\t\n33\tDRUG\t2020-12-04\t13:36\tDIAF\t\n34\tDRUG\t2020-12-04\t13:36\tDIARIS\t\n35\tFOOD\t2020-12-05\t9:11\t2 huevos, chocolight, melón\t\n36\tFOOD\t2020-12-06\t8:50\t2 huevos, chocolight, melón, galletas integrales\t\n37\tDRUG\t2020-12-06\t8:50\tDIARIS\t\n38\tDRUG\t2020-12-05\t8:50\tDIARIS\t\n39\tDRUG\t2020-12-05\t13:00\tDIAF\t\n40\tFOOD\t2020-12-05\t13:00\tRollo carne, puré, kale, melón, limón\t\n41\tFOOD\t2020-12-06\t18:14\tGalletas integrales, dulce de leche\t\n42\tFOOD\t2020-12-05\t23:30\tCerveza patricia 1 lt, queso muzatela conapeole 200 gt, papas crunch 90 gr\t\n43\tFOOD\t2020-12-06\t18:39\tGalletas integrales\t\n44\tFOOD\t2020-12-06\t13:30\tMilanesa pescado, puré, melón, limón, agua\t\n45\tFOOD\t2020-12-06\t21:17\tEespaguetis al tuco, agua, galletas integrales\t\n46\tDRUG\t2020-12-06\t21:17\tDIAF\t\n47\tDRUG\t2020-12-06\t21:17\tNOVONORM\t\n48\tFOOD\t2020-12-07\t13:05\tCarne, pure, melon, limon, agua\t\n49\tDRUG\t2020-12-07\t13:05\tDIAF\t\n50\tFOOD\t2020-12-08\t22:08\tMilanesa pescado, kale, pure, limon, agua\t\n51\tDRUG\t2020-12-08\t22:08\tDIAF\t\n52\tDRUG\t2020-12-08\t22:08\tNOVONORM\t\n53\tFOOD\t2020-12-08\t8:20\t2 huevos, chocolight\t\n54\tFOOD\t2020-12-10\t23:30\tCerveza patricia peq, papas crunch 90 gt, queso mozarela 100 gr\t\n55\tDRUG\t2020-12-10\t23:30\tDIAF\t\n56\tDRUG\t2020-12-10\t23:30\tNOVONORM\t\n57\tDRUG\t2020-12-10\t6:25\tDIARIS\t\n58\tFOOD\t2020-12-10\t6:38\t2 huevos, chocolight\t\n59\tFOOD\t2020-12-10\t12:32\tRillo carne, pure, ksle, limon, agua\t\n60\tDRUG\t2020-12-10\t12:32\tDIAF\t\n61\tFOOD\t2020-12-10\t17:44\t4 bizcochos,collet bombom\t\n62\tFOOD\t2020-12-10\t22:45\t\t\n63\tDRUG\t2020-12-10\t22:45\tDIAF\t\n64\tDRUG\t2020-12-10\t22:45\tNOVONORM\t\n65\tFOOD\t2020-12-11\t13:07\tRollo carne, pure, kale, nelon, limon, agua\t\n66\tDRUG\t2020-12-11\t13:07\tDIAF\t\n67\tFOOD\t2020-12-11\t21:00\tMilanesa pescado, kale, limon, melon, agua\t\n68\tDRUG\t2020-12-11\t21:00\tDIAF\t\n69\tDRUG\t2020-12-11\t21:00\tNOVONORM\t\n70\tDRUG\t2020-12-12\t12:01\tDIARIS\t\n71\tFOOD\t2020-12-12\t12:01\t2 huevos, chocolight\t\n72\tFOOD\t2020-12-12\t20:31\tMilanesa pescado, queso muzarella 1 tj, kale, melón, limon, agua\t\n73\tDRUG\t2020-12-12\t20:31\tDIAF\t\n74\tDRUG\t2020-12-12\t20:31\tNOVONORM\t\n75\tFOOD\t2020-12-12\t23:30\t1 cerveza pateicia litro, queso muzarella 400 papas ruffles 90 gr\t\n76\tFOOD\t2020-12-13\t20:30\tHelado dulce de keche\t\n77\tDRUG\t2020-12-13\t11:25\tDIARIS\t\n78\tFOOD\t2020-12-13\t11:25\t2 huevos, chocolight\t\n79\tFOOD\t2020-12-13\t20:22\tSpaghetis al ruco 500 gr, melin, limon, agua\t\n80\tDRUG\t2020-12-13\t20:22\tDIAF\t\n81\tDRUG\t2020-12-13\t20:22\tNOVONORM\t\n82\tDRUG\t2020-12-13\t20:22\tNOVONORM\t\n83\tFOOD\t2020-12-14\t21:48\tMilanesa pescado, pure, melon, kale, limon\t\n84\tDRUG\t2020-12-14\t21:48\tDIAF\t\n85\tDRUG\t2020-12-14\t21:48\tNOVONORM\t\n86\tFOOD\t2021-01-08\t18:03\tSanduche atun, tomate,  lechuga, agua\t\n87\tDRUG\t2021-01-08\t18:03\tDIAF\t\n88\tDRUG\t2021-01-08\t18:03\tNOVONORM\t\n89\tDRUG\t2021-01-08\t18:03\tNOVONORM\t\n90\tFOOD\t2021-01-08\t22:00\tSanduche atun, lechiga, tomatr, agua\t\n91\tDRUG\t2021-01-08\t22:00\tDIAF\t\n92\tDRUG\t2021-01-08\t22:00\tNOVONORM\t\n93\tFOOD\t2021-01-11\t19:32\tSanduche atun, agua\t\n94\tFOOD\t2021-01-11\t19:32\tSanduche atun, agua\t\n95\tDRUG\t2021-01-11\t19:32\tDIAF\t\n96\tFOOD\t2021-01-11\t13:30\tSanduche atun, agua\t\n97\tDRUG\t2021-01-11\t13:30\tDIAF\t\n98\tFOOD\t2021-01-11\t8:00\t2 huevos, chocolate instantaneo\t\n99\tFOOD\t2021-01-12\t17:30\t5 bizcochos, collet bo.bom\t\n100\tFOOD\t2021-01-12\t12:30\tSanduche arun, agua\t\n101\tFOOD\t2021-01-12\t8:00\t2 huevos, choco normal\t\n102\tFOOD\t2021-01-13\t23:24\tMedio pan frances\t\n103\tFOOD\t2021-01-14\t7:25\t2 huevos, chocolate instantaneo, melon\t\n104\tFOOD\t2021-01-16\t21:00\tCerveza litro patrivia, papas lays 150 gr, wueso muzarella 100 gr\t\n105\tFOOD\t2021-01-15\t21:00\tCerveza litro patrivia, papas lays 150 gr, wueso muzarella 100 gr\t\n106\tFOOD\t2021-01-18\t17:02\t4 bizcochiz, collet vombom\t\n107\tFOOD\t2021-01-18\t20:02\tChoc arcor 1 linea\t\n108\tEXE\t2021-01-18\t20:02\t1500\t0:36:00\n109\tFOOD\t2021-01-19\t17:00\t4 bizcochos, collwt bomvom\t\n110\tFOOD\t2021-01-19\t19:50\tArcor, 1 fila\t\n111\tEXE\t2021-01-19\t19:50\t1500\t0:39:36\n112\tFOOD\t2021-01-20\t17:00\t4 bizcochis, collet bombom\t\n113\tFOOD\t2021-01-20\t19:50\tArcir 1 linea\t\n114\tEXE\t2021-01-20\t21:05\t1500\t0:39:43\n115\tFOOD\t2021-01-22\t8:00\t2 huevos, chocolate, pan\t\n116\tDRUG\t2021-01-22\t8:00\tDIARIS\t\n117\tDRUG\t2021-01-21\t8:00\tDIARIS\t\n118\tEXE\t2021-01-21\t21:00\t1500\t0:38:43\n119\tFOOD\t2021-01-21\t20:00\tArcor chocolatina 1 linea\t\n120\tFOOD\t2021-01-21\t23:30\tCoca light, pan\t\n121\tEXE\t2021-01-22\t20:59\t1500\t0:40:11\n122\tFOOD\t2021-01-22\t19:55\tArcor chocita, 1 fila\t\n123\tDRUG\t2021-01-22\t12:30\tDIAF\t\n124\tDRUG\t2021-01-22\t8:00\tDIARIS\t\n125\tFOOD\t2021-01-22\t23:30\t1 cerveza patricia litro, papas las lays 150 gr, queso muzarella 100 gr\t\n126\tDRUG\t2021-01-22\t23:30\tDIAF\t\n127\tDRUG\t2021-01-22\t23:30\tNOVONORM\t\n128\tFOOD\t2021-01-24\t21:22\tCrepes, coca light,an, queso crema\t\n129\tDRUG\t2021-01-24\t21:22\tDIAF\t\n130\tDRUG\t2021-01-24\t21:22\tNOVONORM\t\n131\tEXE\t2021-01-25\t21:02\t1500\t0:38:17\n132\tFOOD\t2021-01-25\t20:02\tChovolatina srcor una fula\t\n133\tFOOD\t2021-01-25\t17:02\t5 bizcochos, collet bombom\t\n134\tDRUG\t2021-01-25\t12:30\tDIAF\t\n135\tDRUG\t2021-01-25\t8:00\tDIARIS\t","key":"LEGACY"}]}`;

    d = Utils.replace(d,"\t",",");
    d = Utils.replace(d,"\n",";");
    
    let data = JSON.parse(d);
    let r = "[]";
    let records = JSON.parse(r);
    SysLog.level = 1;
    processForm(data,records,",",";");
}

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

function processForm(Data, records, colSep = "\t", lineSep = "\bn") {
    Logger.log("processForm() Data");
    Logger.log(Data);
    Logger.log(records);

    let sv = new Service();
    let html = "";
    let result = new GSResponse();
    try {
        let id = sv.processForm(Data, records,colSep,lineSep);
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




