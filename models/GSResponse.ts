import { KeyValuePair } from "./KeyValuePair";

export class GSResponse {
    result: number = 0;
    controlId: string = "";
    formId: string = "";
    domainResult: number = 0;
    html: Array<KeyValuePair<string,string>> = new Array<KeyValuePair<string,string>>();
    data: Array<KeyValuePair<string,string>> = new Array<KeyValuePair<string,string>>();
    error: Array<KeyValuePair<string,string>> = new Array<KeyValuePair<string,string>>();
    messages = new Array<string>();
    
    constructor(){
        this.result = 200;
    }

    addHtml(key:string,value:string)
    {
        this.html.push(new KeyValuePair<string,string>(key, value))
    }
    
    addData(key:string,value:string)
    {
        this.data.push(new KeyValuePair<string,string>(key, value))
    }

    addError(key:string,value:string, errorCode = 500)
    {
        this.result = errorCode;
        this.error.push(new KeyValuePair<string,string>(key, value))
    }

}
