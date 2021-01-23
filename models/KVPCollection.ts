import { KeyValuePair } from "./KeyValuePair";

export class KVPCollection {
    arr = new Array<KeyValuePair<string,string>>();


    add(key,value)
    {
        this.arr.push(new KeyValuePair<string,string>(key,value));
    }

    update(key,value)
    {
        let existing = this.arr.filter(x=>x.key==key);
        if ( existing.length > 0)
            existing[0].value = value;
        else
            this.arr.push(new KeyValuePair<string,string>(key,value));
    }

    get(key):string
    {
        let existing = this.arr.filter(x=>x.key==key);
        if ( existing.length > 0)
            return existing[0].value;
        else
            return "";
    }


}