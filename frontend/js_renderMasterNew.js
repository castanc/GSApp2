    function buildEmptyRow(recType, id, iconTag, styleTag, divRecords) {
        return `<div class="row"  onclick="openDetail('${recType}',-1)">
                        <div class="col-md-1">
                            ${iconTag}
                        </div>

                        <div class="col-md-1" ${styleTag}>
                        </div>
                        <div class="col-md-2" ${styleTag}>
                        </div>
                        <div class="col-md-2" ${styleTag} >
                            ${divRecords}
                        </div>
                    </div>
                    <div id="detail${id}" class="row">
                    </div>`
    }

    function buildRow(recType, iconTag, styleTag, divRecords, master2) {
        return `<div class="row"  onclick="openDetail('${recType}',${master2[1]})">
                        <div class="col-md-1">
                            ${iconTag}
                        </div>

                        <div class="col-md-1" ${styleTag}>
                            ${days[master2[8] + 1]} 
                        </div>
                        <div class="col-md-2" ${styleTag}>
                        ${months[master2[6]]}-${master2[7]}
                        </div>
                        <div class="col-md-2" ${styleTag} >
                        ${master2[11]}
                        </div>
                        <div id="data${master2[1]}" class="col-md-6" ${styleTag}>
                            ${divRecords}
                        </div>
                    </div>
                    <div id="detail${master2[1]}" class="row">
                    </div>`
    }


    function openDay(dayId) {
        //hideDiv(`day${lastDay}`);
        lastDay = dayId;
        showDiv(`day${dayId}`);
    }

    function renderMaster() {
        let recType = "";
        let classText = "";
        let icon = "";
        let iconColor = "";
        let styleTag = "";
        let fontSize = "font-size:22px;";
        let color = "color:white;";
        let style = `style="${fontSize} ${color}"`;
        let lastDay = 0;
        let glucRow = "";
        let dayRows = "";
        let rti;
        let value;

        if (master == null) {
            //show error
            return;
        }
        if (master.lenght < 1)
            return;

        showDiv("content");
        hideDiv("DIVrecType");
        hideDiv("SELECT_RT");

        let row = `<div style="font-size:32px;">
            <hr>
            <div class="row">
            <div class="col-md-1"></div>
            <div class="col-md-1">Dia</div>
            <div class="col-md-2">Fecha</div>
            <div class="col-md-2">Hora</div>
            <div class="col-md-6">Data</div>
            </div>
            `;

        if (master.length > 0) {

            let master2;
            if (filterRT != "") {
                master2 = master.filter(x => x[9] = filterRT);
                master2 = sortArray(master2, 3);
            }
            else {
                master2 = sortArray(master, 3);
            }

            GlucLevels.forEach(item => {
                item.count = 0;
                item.acumulado = 0;
            })

            let divRecords = "";
            countGluc = 0;
            for (var i = 0; i < master2.length; i++) {
                if (master2[i].length < 9)
                    continue;

                recType = master2[i][9].trim();
                if (master2[i][5] != lastDay) {
                    lastDay = master2[i][5];
                    glucRow = "";
                    dayRows = "";
                    while (master2[i][5] == lastDay) {
                        rti = RecTypes.filter(x => x.name == recType);
                        icon = "";
                        iconColor = "";
                        styleTag = "";

                        if (rti.length > 0) {
                            icon = rti[0].icon;
                            iconColor = `color:${rti[0].textColor};`;
                            styleTag = `style="${iconColor}"`;
                        }

                        let iconTag = `<span style="font-size: 40px; ${iconColor}">
                                    <i class="${icon}"></i>
                                </span>`;

                        value = master2[i][12];
                        divRecords = buildRecords(recType, master2[i][1], master2[i][12]);

                        if (recType == "GLUC") {
                            countGluc++;
                            let gl = GlucLevels.filter(x => value >= x.min && value < x.max);
                            if (gl.length > 0) {
                                styleTag = `style="background-color:${gl[0].backgroundColor};"`;
                                gl[0].count++;
                            }
                        }

                        if (master2[i][5] == "GLUC" && glucRow == "") {
                            glucRow = buildRow(recType, iconTag, styleTag, divRecords, master2[i]);
                        }
                        else {
                            dayRows = `${dayRows} ${buildRow(recType, iconTag, styleTag, divRecords, master2[i])}`;
                        }
                        i++;
                        recType = master2[i][9].trim();
                    }
                    if (glucRow == "") {
                        glucRow = buildEmptyRow("GLUC", lastDay, iconTag, styleTag, "NO GLUC MEASURE");
                    }
                    glucRow = `${glucRow}
                        <div id="day${lastDay} onclick=openDay(${lastDay})>${dayRows}</div>`
                    row = `${row}${glucRow}`;
                }
            }
        }
        row = `${row}</div>`;
        countGluc--;
        let glucTotalsHtml = getGlucTotals();
        writeInnerHtml("btnReport", "Reporte");
        writeInnerHtml("title", glucTotalsHtml);
        writeInnerHtml("report", row);
        setFilterData();
    }


