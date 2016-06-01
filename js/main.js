class Selector {

    constructor(){
        this.sheetList={}

    }

    init(){
        this.getOptions();
        this.generateOptions();
        var select = document.querySelector('select[data-select="sel"]');
        select.addEventListener('change',function(){
            sheet.saveSheetData();
            //console.log(select.value);
            document.querySelector('div[data-name="table"]').innerHTML = '';
            document.querySelector('div[data-name="tcol"]').innerHTML = '';
            document.querySelector('div[data-name="trow"]').innerHTML = '';

            var divIdTable = document.querySelector('div#table');
            divIdTable.style.width = "1300px";
            divIdTable.scrollTop = 0;
            divIdTable.scrollLeft = 0;
            divIdTable.style.height = "500px";
            var divTLet = document.querySelector('div[data-name="trow"]');
            var divTLet1 = document.querySelector('div[data-name="tcol-table"]');
            var divTNum = document.querySelector('div[data-name="tcol"]');
            divTLet.style.width = "2000px";
            divTLet1.style.width = "2060px";
            divTLet1.style.height = "940px";
            divTNum.style.height = "940px";


            sheet = undefined;
            sheet = new Sheet(45,25,select.value);
            sheet.init();

        });
        this.toggleBlock();
        this.addOption();
        this.saveOptionsData();



    }

    generateOptions(){
        var select = document.querySelector('select[data-select="sel"]');
        select.innerHTML = '';
        var fragmentSel = document.createDocumentFragment();
        for (var key in this.sheetList){
            var option = document.createElement('option');
            option.setAttribute('value',key);
            option.innerHTML = this.sheetList[key];
            fragmentSel.appendChild(option);
        }
        select.appendChild(fragmentSel);
    }

    getOptions(){

        //this.sheetList = {1:'Sher', 2:'Sheet2',3:'Sheet3',4:'ss'};
        //console.log(this.sheetList);
        if(localStorage['sheetList']){
            this.sheetList = JSON.parse(localStorage['sheetList']);
        }
        else {
            this.getJSONData('http://rangebag.org/data/getJson.php?file=sheetlist.json', (function (data) {
                this.sheetList = data;

            }).bind(this));
        }

    }

    getJSONData(url, callback){
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {

                if (httpRequest.status === 200) {
                    var data = JSON.parse(httpRequest.responseText);
                    if (callback) callback(data);
                    console.log('data',data);

                }
            }
        };
        httpRequest.open('GET', url, false);
        httpRequest.send();

    }

    setJSONData(url, data) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var sendd = 'jsonData='+encodeURIComponent(JSON.stringify(data));
        xmlhttp.send(sendd);
    }

    toggleBlock(){
        var plusButton = document.querySelector('.glyphicon.glyphicon-plus').parentNode;
        plusButton.addEventListener('click',toggleBl);
        function toggleBl(){
            var addBlock = document.querySelector('.navbar-form');
            addBlock.classList.toggle('display-none');
        }
    }

    addOption(){
        var addButton = document.querySelector('.btn.btn-success');
        var inputB = document.querySelector('.form-control');
        addButton.addEventListener('click',addOp.bind(this));
        function addOp(){
            if (inputB.value == '') {
                alert('Sheet Field is Empty');
                return;
            }
            console.log(this.sheetList);
            var nextKey = +Object.keys(this.sheetList)[Object.keys(this.sheetList).length-1]+1;
            this.sheetList[nextKey] = inputB.value;
            console.log(this.sheetList);
            inputB.value = '';
            var addBlock = document.querySelector('.navbar-form');
            addBlock.classList.add('display-none');
            this.generateOptions();
            var select = document.querySelector('select[data-select="sel"]');
            select.value = +Object.keys(this.sheetList)[Object.keys(this.sheetList).length-1];

            document.querySelector('div[data-name="table"]').innerHTML = '';
            document.querySelector('div[data-name="tcol"]').innerHTML = '';
            document.querySelector('div[data-name="trow"]').innerHTML = '';
            var divIdTable = document.querySelector('div#table');
            divIdTable.style.width = "1300px";
            divIdTable.scrollTop = 0;
            divIdTable.scrollLeft = 0;
            divIdTable.style.height = "500px";
            var divTLet = document.querySelector('div[data-name="trow"]');
            var divTLet1 = document.querySelector('div[data-name="tcol-table"]');
            var divTNum = document.querySelector('div[data-name="tcol"]');
            divTLet.style.width = "2000px";
            divTLet1.style.width = "2060px";
            divTLet1.style.height = "940px";
            divTNum.style.height = "940px";

            sheet = undefined;
            sheet = new Sheet(45,25,+Object.keys(this.sheetList)[Object.keys(this.sheetList).length-1]);
            sheet.init();

        }

    }

    saveOptionsData(){
        var saveButton = document.querySelector('.glyphicon.glyphicon-floppy-disk').parentNode;
        saveButton.addEventListener('click',saveData.bind(this));

        function saveData() {
            var localSheet1 = 'sheetList';
            localStorage.setItem(localSheet1, JSON.stringify(this.sheetList));
            var url1 = 'http://rangebag.org/data/setJson.php?file=sheetlist.json';
            this.setJSONData(url1,this.sheetList);

            sheet.saveSheetData();


        }



    }

}

class Sheet {

    constructor(rowCount, cellCount,id){
        this.rowCount = rowCount;
        this.cellCount = cellCount;
        this.id = id;
        this.dataObj ={};
    }

    init(){
        this.getSheetData();
        this.generateTable();

        var table = document.querySelector('#table');
        //console.log(this.dataObj);
        table.addEventListener('scroll',this.addRowsAndCells.bind(this));


        var mainTable = document.querySelector('.main-table');
        var bindTdClick = tdClick1.bind(this);
        mainTable.addEventListener('click',bindTdClick);

        this.redError();

        function tdClick1(e){
            if(e.target.localName=='td') {
                var mainTable = document.querySelector('.main-table');
                mainTable.removeEventListener('click',bindTdClick);

                var td = e.target;
                //console.log(td.parentElement.rowIndex);
                var cellLetter = document.querySelectorAll('div[data-name="trow"] div')[td.cellIndex];
                cellLetter.classList.add("cell-selected");
                var cellNumber = document.querySelectorAll('div[data-name="tcol"] div')[td.parentElement.rowIndex];
                cellNumber.classList.add("cell-selected");

                var input = document.createElement('input');
                input.setAttribute("type", "text");
                //input.setAttribute("autofocus","true");

                var cell = td.getAttribute('data-cell');
                if (this.dataObj[cell] != undefined)input.value = this.dataObj[cell];
                td.innerHTML = '';
                td.appendChild(input);
                input.focus();

                if (input.value != undefined) {
                    var highlighting = input.value.substring(1).split(/\+|\*|\/|-/);
                    //console.log(highlighting);
                    for (var l=0;l< highlighting.length;l++){
                        var hi = "td[data-cell="+'"'+highlighting[l].toUpperCase()+'"]';
                        var hil = document.querySelector(hi);
                        var formulaSelected = 'formula-selected-' +l;
                        if(hil!=null) hil.classList.add(formulaSelected);
                    }
                }

                //var h11;
                input.addEventListener('input',  function (e) {
                    //console.log('oninput',input.value);
                    var highlighting;


                    if (input.value != undefined) {
                        highlighting = input.value.substring(1).split(/\+|\*|\/|-/);
                        //console.log(highlighting);
                        for (var l=0;l< highlighting.length;l++){
                            var hi = "td[data-cell="+'"'+highlighting[l].toUpperCase()+'"]';
                            var hi2 = document.querySelector(hi);
                            var formulaSelected = 'formula-selected-' +l;
                            if(hi2!=null) hi2.classList.add(formulaSelected);

                        }
                    }
                    //h11=highlighting;
                });

                var clCell;

                var getCellId = function(e){
                    var td = e.target;
                    //console.log('11',td);
                    clCell = td.getAttribute("data-cell");
                }
                mainTable.addEventListener('mousedown', getCellId);

                input.addEventListener('blur',  function (e) {

                    input.focus();
                    /*  e.stopPropagation();
                     e.preventDefault();*/
                    if(clCell==undefined)return;
                    input.value=input.value+clCell;

                    //console.log(clCell);
                    //console.log(input.value);
                    clCell='';

                    var event = new Event("input");
                    input.dispatchEvent(event);


                });

                input.addEventListener('keypress', (function (e) {

                    if (e.keyCode === 13) {
                        //mainTable.removeEventListener('click',xl._tdClick);
                        //console.log(this.dataObj);
                        //onEnter(cellLetter,cellNumber,cell,e,td).bind(this);
                        cellLetter.classList.remove("cell-selected");
                        cellNumber.classList.remove("cell-selected");

                        if(e.target.value!='') {
                            this.dataObj[cell] = e.target.value;
                            /*var localSheet = 'dataObj'+this.id;
                            localStorage.setItem(localSheet, JSON.stringify(this.dataObj));
                            var url1 = 'http://rangebag.org/data/setJson.php?file='+this.id+'.json';
                            this.setJSONData(url1,this.dataObj);*/
                        }

                        if(e.target.value!=undefined){
                            //console.log(e.target.value);
                            if (e.target.value.charAt(0) == "=") td.innerHTML = this.calcCell(e.target.value);
                            else td.innerHTML=e.target.value;
                        }

                        var selectedTDs = document.querySelectorAll('td[class^=formula-selected]');
                        [].forEach.call(selectedTDs, function(selectedTD) {
                            selectedTD.setAttribute('class','');
                        });

                        this.updateTDs();



                        //input.onblur = function (e) {}
                        input.value='';
                        mainTable.addEventListener('click',bindTdClick);
                    }}).bind(this));


            }

        }

    }

    getSheetData(){

        /*this.sheetList = {1:'Sher', 2:'Sheet2',3:'Sheet3',4:'ss'};
        console.log(this.sheetList);*/
        var localSheet = 'dataObj'+this.id;
        if(localStorage[localSheet]){
            this.dataObj = JSON.parse(localStorage[localSheet]);
        }
        else {
            var url1 = 'http://rangebag.org/data/getJson.php?file='+this.id+'.json';
            this.getJSONData(url1, (function (data) {
            this.dataObj = data;
        }).bind(this));
        }
        //console.log(this.dataObj);
    }

    getJSONData(url, callback){
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {

                if (httpRequest.status === 200) {
                    var data = JSON.parse(httpRequest.responseText);
                    if (callback) callback(data);
                    console.log('data',data);

                }
            }
        };
        httpRequest.open('GET', url, false);
        httpRequest.send();

    }

    setJSONData(url, data) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var sendd = 'jsonData='+encodeURIComponent(JSON.stringify(data));
        xmlhttp.send(sendd);
    }

    generateTable() {
        //console.log(this.dataObj);
        var mainTable = document.createElement('table');
        mainTable.className = 'main-table';
        var divTable = document.querySelector('div[data-name="table"]');

        var tableBody = document.createElement('tbody');
        mainTable.appendChild(tableBody);
        var tableHeader = mainTable.createTHead();
        var tableRow = tableHeader.insertRow(0);

        var divTLet = document.querySelector('div[data-name="trow"]');
        var fragmentLet = document.createDocumentFragment();
        for(var j=0; j<this.cellCount;j++) {
            var divLet = document.createElement('div');
            divLet.innerHTML = this.numToLet(j);
            fragmentLet.appendChild(divLet);
        }
        divTLet.appendChild(fragmentLet);

        var divTNum = document.querySelector('div[data-name="tcol"]');
        var fragmentNum = document.createDocumentFragment();
        for(var t=0; t<=this.rowCount;t++) {
            var divNum = document.createElement('div');
            if(t==0) divNum.innerHTML = '@';
            else divNum.innerHTML = t;
            fragmentNum.appendChild(divNum);
        }
        divTNum.appendChild(fragmentNum);


        for(var i=0;i<this.rowCount;i++){
            var tableRow1 = tableBody.insertRow(-1);
            for(var k=0; k<this.cellCount;k++){
                var tableCell1 = tableRow1.insertCell(-1);
                var cellValue = ''+this.numToLet(k)+ (i+1);
                tableCell1.setAttribute('data-cell', cellValue);
                if(this.dataObj[cellValue]!=undefined){
                    if (String(this.dataObj[cellValue]).charAt(0) == "=") tableCell1.innerHTML = this.calcCell(this.dataObj[cellValue]);
                    else tableCell1.innerHTML=this.dataObj[cellValue];
                }
            }

        }
        divTable.appendChild(mainTable);
        console.log('generateTable');
    }

    numToLet(n){
        var r = '';
        for(; n >= 0; n = Math.floor(n / 26) - 1) {
            r = String.fromCharCode(n%26 + 0x41) + r;
        }
        return r;
    }

    calcCell(cell){

        if (cell==undefined)return;
        if (cell.charAt(0) != "=")return;
        var value = cell.toUpperCase();

        //console.log(value);    console.log(cell);
        //var value = '=s1_A1-s1_B1-s1_C1-s1_D1'.substring(1);
        //value.lastIndexOf('=')
        //var value = value.substring(value.lastIndexOf('=')+1);
        var value = value.substring(1);
        if (value.length==0)return;

        //console.log(value);
        //console.log(value);
        //var indexPlus = '+',indexMinus = '-', indexDev= '/', indexMult = '*';
        var i=0;
        var newValue = '';
        dodo: do {

            var foundPlus = value.indexOf('+');
            var foundMinus = value.indexOf('-');
            var foundDev = value.indexOf('/');
            var foundMult = value.indexOf('*');
            if (value.charAt(0) == "=") value = value.substring(1);
            ifif: if(foundPlus==-1&&foundMinus==-1&&foundDev==-1&&foundMult==-1){
                //var tt ='s1_'+(value);
                var tt1 = this.dataObj[value];//localStorage[tt];
                tt1 = (tt1+'').toLocaleUpperCase();
                //console.log('IIIIIIII',tt1);
                if (tt1.charAt(0) == "=") {
                    var adRecursion =  this.calcCell(tt1);
                    newValue+=adRecursion;
                    //console.log('TTTTTTTTTT',newValue);
                    // value=value.substring(foundPlus+1);
                    break ifif;
                }

                for(var key1 in this.dataObj){

                    if(key1==value){
                        if(this.dataObj[key1]==undefined)this.dataObj[key1]=0;
                        newValue+=this.dataObj[key1];
                        break dodo;
                    }

                }


                if(value.search(/^[A-Z]{1,4}\d{1,4}$/)!=-1){
                    value=0;
                    newValue+=value;
                    break dodo;
                }
                newValue+=value;
                break;
            }
            if(foundPlus==-1&&foundMinus==-1&&foundDev==-1&&foundMult==-1)break;



            //console.log(foundPlus,foundMinus);
            if(foundPlus == -1)foundPlus=100;
            if(foundMinus == -1)foundMinus=100;
            if(foundDev == -1)foundDev=100;
            if(foundMult == -1)foundMult=100;

            //console.log('----------');
            //console.log(value);
            //console.log(newValue);
            forfor: if(foundPlus<foundMinus&&foundPlus<foundDev&&foundPlus<foundMult){
                //var tt ='s1_'+(value.substring(0,foundPlus));
                var tt1 = this.dataObj[value.substring(0,foundPlus)];//localStorage[tt];
                tt1 = (tt1+'').toLocaleUpperCase();
                //console.log('IIIIIIII',tt1);
                if (tt1.charAt(0) == "=") {
                    var adRecursion =  this.calcCell(tt1);
                    newValue+=adRecursion+'+';
                    //console.log('TTTTTTTTTT',newValue);
                    value=value.substring(foundPlus+1);
                    break forfor;
                }

                for(var key2 in this.dataObj){

                    if(this.dataObj[key2]==undefined)this.dataObj[key2]=0;
                    //var s2='s1_'+value.substring(0,foundPlus);
                    if(key2==value.substring(0,foundPlus)){
                        newValue+=this.dataObj[key2]+'+';
                    }


                }
                if(!isNaN(value.substring(0,foundPlus)))  {
                    newValue+=value.substring(0,foundPlus)+'+';
                }
                value=value.substring(foundPlus+1);
            }
            else if (foundMinus<foundPlus&&foundMinus<foundDev&&foundMinus<foundMult){
                //var tt ='s1_'+(value.substring(0,foundMinus));
                var tt1 = this.dataObj[value.substring(0,foundMinus)];//localStorage[tt];
                tt1 = (tt1+'').toLocaleUpperCase();
                if (tt1.charAt(0) == "=") {
                    var adRecursion =  this.calcCell(tt1);
                    newValue+=adRecursion+'-';
                    value=value.substring(foundMinus+1);
                    break forfor;
                }

                for(var key3 in this.dataObj){
                    if(this.dataObj[key3]==undefined)this.dataObj[key3]=0;
                    //var s3='s1_'+value.substring(0,foundMinus);
                    if(key3==value.substring(0,foundMinus)){
                        //if(key3==(value.substring(0,foundMinus))){
                        newValue+=this.dataObj[key3]+'-';
                    }
                }
                if(!isNaN(value.substring(0,foundMinus)))  {
                    newValue+=value.substring(0,foundMinus)+'-';
                }
                value=value.substring(foundMinus+1);

            }
            else if (foundMult<foundPlus&&foundMult<foundDev&&foundMult<foundMinus){
                var tt1 = this.dataObj[value.substring(0,foundMult)];
                tt1 = (tt1+'').toLocaleUpperCase();
                if (tt1.charAt(0) == "=") {
                    var adRecursion =  this.calcCell(tt1);
                    newValue+=adRecursion+'*';
                    value=value.substring(foundMult+1);
                    break forfor;
                }

                for(var key4 in this.dataObj){
                    if(this.dataObj[key4]==undefined)this.dataObj[key4]=0;
                    if(key4==value.substring(0,foundMult)){
                        newValue+=this.dataObj[key4]+'*';
                    }
                }
                if(!isNaN(value.substring(0,foundMult)))  {
                    newValue+=value.substring(0,foundMult)+'*';
                }
                value=value.substring(foundMult+1);

            }
            else if (foundDev<foundPlus&&foundDev<foundMult&&foundDev<foundMinus){
                var tt1 = this.dataObj[value.substring(0,foundDev)];
                tt1 = (tt1+'').toLocaleUpperCase();
                if (tt1.charAt(0) == "=") {
                    var adRecursion =  this.calcCell(tt1);
                    newValue+=adRecursion+'/';
                    value=value.substring(foundDev+1);
                    break forfor;
                }

                for(var key4 in this.dataObj){
                    if(this.dataObj[key4]==undefined)this.dataObj[key4]=0;
                    //var s4='s1_'+value.substring(0,foundDev);
                    if(key4==value.substring(0,foundDev)){
                        //if(key3==(value.substring(0,foundDev))){
                        newValue+=this.dataObj[key4]+'/';
                    }
                }
                if(!isNaN(value.substring(0,foundDev)))  {
                    newValue+=value.substring(0,foundDev)+'/';
                }
                value=value.substring(foundDev+1);

            }
            else{}
            i++;



        }while(i<100)


        newValue = newValue.replace(/--/gi, "+");
        try {
            //console.log('EVAL',newValue);
            //adRecursion =eval(newValue);
            return eval(newValue);
            //console.log(newValue);
            //return Math.eval(newValue);


        } catch(err){
            //console.log('!!!!!',newValue);
            return 'Error';

        }
        //return elm.value;

    }

    addRowsAndCells(){


        var trCount = document.querySelectorAll('[data-name="tcol"] div');
        var tdCount = document.querySelectorAll('[data-name="trow"] div');

        if(table.scrollHeight - table.scrollTop === table.clientHeight){

            var divTNum = document.querySelector('div[data-name="tcol"]');
            var fragmentNum = document.createDocumentFragment();
            for(var t=0; t<10;t++) {
                var divNum = document.createElement('div');
                divNum.innerHTML = trCount.length+t;
                fragmentNum.appendChild(divNum);
            }
            divTNum.appendChild(fragmentNum);

            var tableBody = document.querySelector('.main-table tbody');
            // var fragmentRows = document.createDocumentFragment();
            for(var i=0;i<10;i++){
                var tableRow1 = tableBody.insertRow(-1);
                for(var k=0; k<tdCount.length;k++){
                    var tableCell1 = tableRow1.insertCell(-1);
                    var cellValue = ''+this.numToLet(k)+ (trCount.length+i);
                    tableCell1.setAttribute('data-cell', cellValue);

                    if(this.dataObj[cellValue]!=undefined){
                        if (String(this.dataObj[cellValue]).charAt(0) == "=") tableCell1.innerHTML = this.calcCell(this.dataObj[cellValue]);
                        else tableCell1.innerHTML=this.dataObj[cellValue];
                    }
                }
            }
        }
        if(table.scrollWidth - table.scrollLeft === table.clientWidth) {

            var divTLet = document.querySelector('div[data-name="trow"]');
            var divTLet1 = document.querySelector('div[data-name="tcol-table"]');
            divTLet.style.width = table.scrollWidth+270+"px";
            divTLet1.style.width = table.scrollWidth+0+"px";


            var fragmentLet = document.createDocumentFragment()
            for(var j=0; j<4;j++) {
                var divLet = document.createElement('div');
                divLet.innerHTML = this.numToLet(tdCount.length+j);
                fragmentLet.appendChild(divLet);
            }
            divTLet.appendChild(fragmentLet);



            var theadTrs = document.querySelectorAll('.main-table tbody tr');
            for(var k=0; k<trCount.length-1;k++){
                for(var i=0;i<4;i++){
                    var tableCell3 = theadTrs[k].insertCell(-1);

                    var cellValue = ''+this.numToLet(tdCount.length+i)+ (k+1);
                    tableCell3.setAttribute('data-cell', cellValue);

                    if(this.dataObj[cellValue]!=undefined){
                        if (this.dataObj[cellValue].charAt(0) == "=") tableCell3.innerHTML = this.calcCell(this.dataObj[cellValue]);
                        else tableCell3.innerHTML = this.dataObj[cellValue];
                    }
                }
            }
        }
    }

    tdClick(e){
        if(e.target.localName=='td') {
            console.log('dd');
            var mainTable = document.querySelector('.main-table');
            mainTable.removeEventListener('click',this.tdClick.bind(this));

            var td = e.target;
            //console.log(td.parentElement.rowIndex);
            var cellLetter = document.querySelectorAll('div[data-name="trow"] div')[td.cellIndex];
            cellLetter.classList.add("cell-selected");
            var cellNumber = document.querySelectorAll('div[data-name="tcol"] div')[td.parentElement.rowIndex];
            cellNumber.classList.add("cell-selected");

            var input = document.createElement('input');
            input.setAttribute("type", "text");
            //input.setAttribute("autofocus","true");

            var cell = td.getAttribute('data-cell');
            if (this.dataObj[cell] != undefined)input.value = this.dataObj[cell];
            td.innerHTML = '';
            td.appendChild(input);
            input.focus();

            if (input.value != undefined) {
                var highlighting = input.value.substring(1).split(/\+|\*|\/|-/);
                //console.log(highlighting);
                for (var l=0;l< highlighting.length;l++){
                    var hi = "td[data-cell="+'"'+highlighting[l].toUpperCase()+'"]';
                    var hil = document.querySelector(hi);
                    var formulaSelected = 'formula-selected-' +l;
                    if(hil!=null) hil.classList.add(formulaSelected);
                }
            }

            //var h11;
            input.addEventListener('input',  function (e) {
                //console.log('oninput',input.value);
                var highlighting;


                if (input.value != undefined) {
                    highlighting = input.value.substring(1).split(/\+|\*|\/|-/);
                    //console.log(highlighting);
                    for (var l=0;l< highlighting.length;l++){
                        var hi = "td[data-cell="+'"'+highlighting[l].toUpperCase()+'"]';
                        var hi2 = document.querySelector(hi);
                        var formulaSelected = 'formula-selected-' +l;
                        if(hi2!=null) hi2.classList.add(formulaSelected);

                    }
                }
                //h11=highlighting;
            });

            var clCell;

            var getCellId = function(e){
                var td = e.target;
                //console.log('11',td);
                clCell = td.getAttribute("data-cell");
            }
            mainTable.addEventListener('mousedown', getCellId);

            input.addEventListener('blur',  function (e) {

                input.focus();
                /*  e.stopPropagation();
                 e.preventDefault();*/
                if(clCell==undefined)return;
                input.value=input.value+clCell;

                //console.log(clCell);
                //console.log(input.value);
                clCell='';

                var event = new Event("input");
                input.dispatchEvent(event);


            });

            input.addEventListener('keypress', (function (e) {

                if (e.keyCode === 13) {
                    //mainTable.removeEventListener('click',xl._tdClick);
                    //console.log(this.dataObj);
                    //onEnter(cellLetter,cellNumber,cell,e,td).bind(this);
                    cellLetter.classList.remove("cell-selected");
                    cellNumber.classList.remove("cell-selected");

                    if(e.target.value!='') {
                        this.dataObj[cell] = e.target.value;
                    }

                    if(e.target.value!=undefined){
                        //console.log(e.target.value);
                        if (e.target.value.charAt(0) == "=") td.innerHTML = this.calcCell(e.target.value);
                        else td.innerHTML=e.target.value;
                    }

                    var selectedTDs = document.querySelectorAll('td[class^=formula-selected]');
                    [].forEach.call(selectedTDs, function(selectedTD) {
                        selectedTD.setAttribute('class','');
                    });

                    this.updateTDs();
                    this.redError();



                    //input.onblur = function (e) {}
                    input.value='';
                    mainTable.addEventListener('click',this.tdClick);
                }}).bind(this));


        }

    }

    updateTDs(){

        for (var key in this.dataObj){
            if (String(this.dataObj[key]).charAt(0) == "=") {
                var tt = 'td[data-cell="'+key+'"]';
                var td =document.querySelector(tt);
                if(td!=null)td.innerHTML = this.calcCell(this.dataObj[key]);
            }
        }
        this.redError();

    }

    redError(){
        var currentRedErrors = document.querySelectorAll('td[data-cell][style]');
        [].forEach.call(currentRedErrors, function(currentRedErrors) {
            currentRedErrors.style.color = "black";
        });

        var cells = document.getElementById("table").getElementsByTagName("td");
        for (var i = 0; i < cells.length; i++) {
            if (cells[i].innerHTML == "Error") {
                cells[i].style.color = "red";
            }
        }
    }

    saveSheetData(){
        var localSheet = 'dataObj'+this.id;
        localStorage.setItem(localSheet, JSON.stringify(this.dataObj));
        var url1 = 'http://rangebag.org/data/setJson.php?file='+this.id+'.json';
        this.setJSONData(url1,this.dataObj);
    }
    


}


var selector = new Selector();
selector.init();



var sheet = new Sheet(45,25,1);
sheet.init();














