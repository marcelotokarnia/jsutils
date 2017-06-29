angular.module('xlsx_adapter', []);

angular.module('xlsx_adapter').factory('XLSXAdapter', function(){

    function WorkBook(names){
        if (Array.isArray(names)){
            this.SheetNames = names.map(function(name){
                return String(name);
            })
        } else {
            this.SheetNames = [];
        }
        this.Sheets = {};
    }

    angular.extend(WorkBook.prototype, {
        createWorkSheet: createWorkSheet,
        download: download,
        getWorksheetNameByIndex: getWorksheetNameByIndex,
    });

    function WorkSheet(){
        this['!ref'] = XLSX.utils.encode_range({s: {c: 0, r:0}, e: {c:1000, r:1000}});;
        this['!merges'] = [];
    }

    angular.extend(WorkSheet.prototype, {
        setRange: setRange,
        mergeCells: mergeCells,
        setColumnsWidths: setColumnsWidths,
        setData: setData,
    });

    function Cell(value, type, style){
        var cell = this;
        cell.v = value;
        if (!type){
            type = 'string';
        }
        cell.t = m.prefixedTypes[type] || type;
        if (typeof style === 'string') {
            cell.s = m.prefixedStyles[style] || {};
        } else if (Array.isArray(style)){
            cell.s = angular.merge.apply(undefined, [{}].concat(style.map(function(s){return m.prefixedStyles[s] || {};})));
        } else if (typeof style === 'object'){
            cell.s = style;
        }
    }

    angular.extend(Cell.prototype, {

    });

    var m = {
        prefixedStyles: {
            // font
            bold: {font: {bold: true}},
            italic: {font: {italic: true}},
            //numfmt
            real: {numFmt: '_-"R$" * #.#0_-;-"R$" * #.#0_-;_-"R$" * "-"??_-;_-@_-'},
            hectar: {numFmt: '#.00 [$ha]'},
            //alignment
            'horizontal-center': {alignment: {horizontal: 'center'}},
            'horizontal-right': {alignment: {horizontal: 'right'}},
            'vertical-center': {alignment: {horizontal: 'center'}},
            center: {alignment: {horizontal: 'center', vertical: 'center'}},
            //fill
            solid: {fill: {patternType: 'solid'}},
            'dark-green': {fill: {fgColor: { rgb: "FF228B22" }}},
            'dark-blue': {fill: {fgColor: { rgb: "FF000080" }}},
        },
        prefixedTypes: {
            string: 's',
            number: 'n'
        },
        classes: {
            WorkBook: WorkBook,
            WorkSheet: WorkSheet,
            Cell: Cell
        }
    };

    angular.extend(m, {
        createCell: createCell,
        createWorkbook: createWorkbook,
    });

    function createWorkbook(sheetnames){
        return new WorkBook(sheetnames);
    }

    function createWorkSheet(name){
        worksheet = new WorkSheet();
        this.Sheets[String(name)] = worksheet;
        if (this.SheetNames.indexOf(String(name)) === -1){
            this.SheetNames.push(String(name));
        }
        return worksheet;
    }

    function getWorksheetNameByIndex(i){
        return this.SheetNames[i];
    }

    function createCell(value, type, style){
        return new Cell(value, type, style);
    }

    function setRange(lastRow, lastColumn){
        this['!ref'] = XLSX.utils.encode_range({s: {c: 0, r:0}, e: {c:lastColumn, r:lastRow}});
    }

    function setData(data, row, column){
        this[XLSX.utils.encode_cell({c:column,r:row})] = data;
    }

    function setColumnsWidths(widths){
        this['!cols'] = widths.map(function(w){return {wch: w};});
    }

    function download(filename){
        var workbookOut = XLSX.write(this, {bookType:'xlsx', bookSST:false, type: 'binary', showGridLines: true});

        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        saveAs(new Blob([s2ab(workbookOut)]), filename+".xlsx")
    }

    function mergeCells(start, end){
        this['!merges'].push({s: {r: start[0], c: start[1]}, e:{r:end[0], c: end[1]}});
    }

    return m;
});
