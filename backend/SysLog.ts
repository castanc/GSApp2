import { Utils } from "./Utils";

export class SysLog {
    static folder;
    static ssLog;
    static level = 0;

    constructor() {
        SysLog.initialize();
    }

    static initialize() {
        if (this.ssLog == undefined) {
            SysLog.folder = Utils.getCreateFolder("SysLog");
            SysLog.ssLog = Utils.getCreateSpreadSheet(SysLog.folder, "SysLogs.txt");
            let sheet = this.ssLog.getActiveSheet();
            var range = sheet.getDataRange();
            range.clearContent();
        }
    }

    static log(level, msg, method = "", additional = "") {
        if (this.level == level || level == 9999)
        {
            SysLog.initialize();
            let ts = Utils.getTimeStamp();
            let row = [ts, "INFO", method, msg, additional];
            this.ssLog.appendRow(row);
            Logger.log(JSON.stringify(row));
        }
    }

    static logException(ex, method = "", additional = "") {
        SysLog.initialize();
        let ts = Utils.getTimeStamp();
        let row = [ts, "EXCEPTION", ex.messaage, method, additional, ex.stacktrace,];
        this.ssLog.appendRow(row);
        Logger.log(JSON.stringify(row));
    }

}
