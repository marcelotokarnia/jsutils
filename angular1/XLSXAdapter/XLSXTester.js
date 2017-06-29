angular.module('xlsx_tester', ['xlsx_adapter']);
angular.module('xlsx_tester').service('XLSXTester', function(XLSXAdapter){
    var m = this;
    angular.extend(m, {
        testLineValues: testLineValues,
        testSheetNames: testSheetNames
    });
    function testLineValues(sheet, row, values){
        expect(sheet instanceof XLSXAdapter.classes.WorkSheet).equal(true);
        for(var i=0; i<values.length; i++){
            var code = XLSX.utils.encode_cell({c:i,r:row});
            if (values[i]){
                expect(sheet[code].v).equal(values[i]);
            }
        }
    }
    function testSheetNames(workbook, sheetNames){
        expect(workbook instanceof XLSXAdapter.classes.WorkBook).equal(true);
        expect(workbook.SheetNames.length).equal(sheetNames.length);
        for(var i=0; i<sheetNames.length; i++){
            expect(workbook.SheetNames[i]).equal(sheetNames[i]);
            expect(workbook.Sheets[sheetNames[i]] instanceof XLSXAdapter.classes.WorkSheet);
        }
    }
});
