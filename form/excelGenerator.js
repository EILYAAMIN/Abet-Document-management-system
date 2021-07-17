const xlsx = require('xlsx-populate');
const path = require('path');
const { maxRowData } = require('./excelGeneratorCriteria');

// 26 Letters of English Alphabet
const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

// Recieve column index as digit and return the corresponding letter
const numToSt = (x) => {
    if (0 <= x && x < 26) return alphabet[x];
    if (26 <= x && x < 52) return (`A${alphabet[x - 26]}`);
    if (52 <= x && x < 78) return (`B${alphabet[x - 52]}`);
    if (78 <= x && x < 104) return (`C${alphabet[x - 78]}`);
    return x;
};

// Recieve column index as digit and return the corresponding alphabet
const stToNum = (x) => {
    if (x.length === 1) return alphabet.indexOf(`${x}`);
    if (x.length === 2 && x.charAt(0) === "A") return (26 + alphabet.indexOf(`${x.charAt(1)}`));
    if (x.length === 2 && x.charAt(0) === "B") return (52 + alphabet.indexOf(`${x.charAt(1)}`));
    if (x.length === 2 && x.charAt(0) === "C") return (78 + alphabet.indexOf(`${x.charAt(1)}`));
};

// Recieve letter and length to get the next letter with distance of length
const nextSt = (char, len) => {
    char = stToNum(char);
    char = char + len;
    return numToSt(char);
};

const excel = async (data, code) => {

    try {
        const MAX = maxRowData[code].max;
        const fields = maxRowData[code].fields;
        var i = 'A';

        // Combining all sections into an array for each student
        let average = [];
        for (c in data) {
            let e;
            e = data[c].Evaluator.map(x => {
                return ([
                    ...x.report,
                    ...x.cooperation,
                    ...x.quality,
                    ...x.present,
                    ...x.summary
                ]);
            });
            average = [...average, [...e]];
        };

        // get the average of each column for each student and put them into an array
        let averages = [];
        for (key in average) {
            let target = [];
            var len = average[key].length;
            let d, c;
            for (c = 0; c <= average[key][0].length; c++) {
                d = average[key].map(x => {
                    return x[c];
                });
                if (d[0] === undefined)
                    continue;
                d = d.map(function (x) {
                    return parseInt(x);
                });
                d = d.reduce((a, b) => a + b, 0);
                d /= len;
                target.push(d);
            }
            averages.push(target);
        }


        // create a blan Excel file
        var workbook = xlsx.fromBlankAsync();

        // Setting the width of first 100 columns to 10
        for (let o = 0; o <= 100; o++) {
            let width = 5;
            if (o === 0 || o === 1)
                width = 10;
            (await workbook)
                .sheet(0)
                .column(`${i}`)
                .width(width)
                .hidden(false);

            i = nextSt(i, 1);

            if (o === 100)
                i = 'B';
        }

        // color chioces for excel 
        const color = ["D9D9D9", "FFCCCC", "D9D9D9", "DAEEF3", "FDE9D9"];

        for (prop in fields) {

            // filling the first 2 columns by student Id and name
            if (prop === "student") {
                (await workbook)
                    .sheet(0)
                    .range(`A1:B1`)
                    .value([fields[prop].rows])
                    .style("fill", "92D050")
                    .style({
                        angleTextClockwise: true,
                        verticalAlignment: "center",
                        bold: true,
                        horizontalAlignment: "center"
                    });

                // Merging first two rows until of A and B
                (await workbook)
                    .sheet(0)
                    .range("A1:A2")
                    .merged(true)
                    .style({ fontSize: 9, borderStyle: "thin" });

                (await workbook)
                    .sheet(0)
                    .range("B1:B2")
                    .merged(true)
                    .style({ fontSize: 9, borderStyle: "thin" });
                continue;
            };

            // Setting the Header of Sections on the first row
            (await workbook)
                .sheet(0)
                .range(`${nextSt(i, 1)}1:${i = nextSt(i, fields[prop].rows.length)}1`)
                .merged(true)
                .value(fields[prop].name)
                .style("fill", `${color[0]}`)
                .style({ fontSize: 9, borderStyle: "thin", bold: true, horizontalAlignment: "center" });
            color.push(color.shift());
            if (prop === "summary")
                i = "B";
        };

        for (prop in fields) {

            if (prop === "student") {
                continue;
            };
            // Setting the Sections columns on the second row
            (await workbook)
                .sheet(0)
                .range(`${nextSt(i, 1)}2:${i = nextSt(i, fields[prop].rows.length)}2`)
                .value([fields[prop].rows])
                .style("fill", `${color[0]}`)
                .style({
                    fontSize: 10,
                    verticalAlignment: "center",
                    borderStyle: "thin",
                    bold: true,
                    rotateTextUp: true,
                    horizontalAlignment: "center"
                });
            color.push(color.shift());

            if (prop === "summary") i = "B";
        };

        // Setting the Row of Maximums 
        let j = 3;
        let maxRow = ["", "MAX", "", ...MAX];
        (await workbook)
            .sheet(0)
            .range(`A${j}:${nextSt("D", MAX.length - 1)}${j}`)
            .value([maxRow])
            .style("fontColor", "FF0000")
            .style("fill", "D6DCE4")
            .style({ fontSize: 10, borderStyle: "thin", bold: true, horizontalAlignment: "center" });
        j++;

        // Adding a Blank Row below Maximums
        (await workbook)
            .sheet(0)
            .range(`A${j}:${nextSt("D", MAX.length - 1)}${j}`)
            .style("fontColor", "FF0000")
            .style("fill", "D6DCE4")
            .style({ fontSize: 10, borderStyle: "thin", bold: true, horizontalAlignment: "center" });

        j++;

        for (prop in data) {

            // Entering the student ID
            (await workbook)
                .sheet(0)
                .cell(`A${j}`)
                .value([[data[prop].id]])
                .style("fill", "A9D08E")
                .style({
                    borderStyle: "thin",
                    bold: true,
                    horizontalAlignment: "center"
                });

            // Entering the student Name
            (await workbook)
                .sheet(0)
                .cell(`B${j}`)
                .value([[data[prop].name]])
                .style("fill", "A9D08E")
                .style({
                    borderStyle: "thin",
                    bold: true,
                    horizontalAlignment: "center"
                });

            for (var x in data[prop].Evaluator) {
                // Entering the evaluator Name
                (await workbook)
                    .sheet(0)
                    .range(`${nextSt(i, 1)}${j}:${i = nextSt(i, data[prop].Evaluator[x].name.length)}${j}`)
                    .value([data[prop].Evaluator[x].name])
                    .style("fill", "D9D9D9")
                    .style({ fontSize: 10, borderStyle: "thin", bold: true, horizontalAlignment: "center" });

                // Entering the evaluator grade for report section
                (await workbook)
                    .sheet(0)
                    .range(`${nextSt(i, 1)}${j}:${i = nextSt(i, data[prop].Evaluator[x].report.length)}${j}`)
                    .value([data[prop].Evaluator[x].report])
                    .style("fill", "D9D9D9")
                    .style({ fontSize: 10, borderStyle: "thin", bold: true, horizontalAlignment: "center" });

                // Entering the evaluator grade for cooperation section
                (await workbook)
                    .sheet(0)
                    .range(`${nextSt(i, 1)}${j}:${i = nextSt(i, data[prop].Evaluator[x].cooperation.length)}${j}`)
                    .value([data[prop].Evaluator[x].cooperation])
                    .style("fill", "FFCCCC")
                    .style({ fontSize: 10, borderStyle: "thin", bold: true, horizontalAlignment: "center" });

                // Entering the evaluator grade for quality section
                (await workbook)
                    .sheet(0)
                    .range(`${nextSt(i, 1)}${j}:${i = nextSt(i, data[prop].Evaluator[x].quality.length)}${j}`)
                    .value([data[prop].Evaluator[x].quality])
                    .style("fill", "D9D9D9")
                    .style({ fontSize: 10, borderStyle: "thin", bold: true, horizontalAlignment: "center" });

                // Entering the evaluator grade for present section
                (await workbook)
                    .sheet(0)
                    .range(`${nextSt(i, 1)}${j}:${i = nextSt(i, data[prop].Evaluator[x].present.length)}${j}`)
                    .value([data[prop].Evaluator[x].present])
                    .style("fill", "DAEEF3")
                    .style({ fontSize: 10, borderStyle: "thin", bold: true, horizontalAlignment: "center" });

                // Entering the evaluator grade for summary section
                (await workbook)
                    .sheet(0)
                    .range(`${nextSt(i, 1)}${j}:${i = nextSt(i, data[prop].Evaluator[x].summary.length)}${j}`)
                    .value([data[prop].Evaluator[x].summary])
                    .style("fill", "FDE9D9")
                    .style({ fontSize: 10, borderStyle: "thin", bold: true, horizontalAlignment: "center" });


                // filling empty space below name and Id
                if (x !== '0') {
                    (await workbook)
                        .sheet(0)
                        .range(`A${j}:B${j}`)
                        .style("fill", "D0CECE");
                }
                j++;
                i = "B";
            }
            // Inserting the Student Averages
            (await workbook)
                .sheet(0)
                .range(`D${j}:${nextSt("C", averages[0].length)}${j}`)
                .value([averages[prop]])
                .style("fontColor", "00B050")
                .style("fill", "D6DCE4")
                .style({ fontSize: 10, borderStyle: "thin", bold: true, horizontalAlignment: "center" });
            j++;

            // filling the empty space before avergaes
            (await workbook)
                .sheet(0)
                .range(`A${j - 1}:AS${j - 1}`)
                .style("fill", "D0CECE");

            // Adding a blank row below averages
            (await workbook)
                .sheet(0)
                .range(`A${j}:AS${j}`)
                .style("fill", "D0CECE");
            j++;
        };

        // Finding the Totals and setting their background color to Yellow
        var r = (await workbook).sheet(0).find("Total");
        if (r.length === 0)
            r = (await workbook).sheet(0).find("Toplam");
        for (let o = 0; o <= 3; o++) {
            (await workbook)
                .sheet(0)
                .cell(`${numToSt(r[o]._columnNumber - 1)}2`) // // To paint the cell of totals
                // .column(`${numToSt(r[o]._columnNumber - 1)}`) // To paint the column of totals 
                .style("fill", `FFFF00`);
        };

        // Finding the Final grade (T ´ O) and setting the background color to Yellow
        r = (await workbook).sheet(0).find("Final grade (T ´ O)");
        if (r.length === 0)
            r = (await workbook).sheet(0).find("Son puan (T x Ö)");
        (await workbook)
            .sheet(0)
            .cell(`${numToSt(r[0]._columnNumber - 1)}2`) // // To paint the cell of totals
            // .column(`${numToSt(r[o]._columnNumber - 1)}`) // To paint the column of totals 
            .style("fill", `FFFF00`);

        // counting the number of successful students for each column
        let NumOfSuccess = [];
        for (let c = 0; c <= averages[0].length; c++) {
            var count = 0;
            for (key in averages) {
                if (averages[key][c] >= MAX[c] / 2)
                    count++;
            }
            NumOfSuccess.push(count);
        };
        NumOfSuccess.pop();

        // Adding the Success Row into Excel
        let SuccessRow = ["", "# Successful", "", ...NumOfSuccess];
        (await workbook)
            .sheet(0)
            .range(`A${j}:${nextSt("C", NumOfSuccess.length)}${j}`)
            .value([SuccessRow])
            .style("fontColor", "FF0000")
            .style("fill", "FFFF00")
            .style({ fontSize: 10, borderStyle: "thin", bold: true, horizontalAlignment: "center" });
        j++;

        // Finding the number of students and averages of course in each column
        const NumOfStudents = data.length;
        let CourseAverage = [];
        for (let c = 0; c <= averages[0].length; c++) {
            var count = 0;
            for (key in averages) {
                count += averages[key][c];
            }
            CourseAverage.push(count / NumOfStudents);
        };
        CourseAverage.pop();

        // Adding the avergaes of course in each column
        let AverageRow = ["", "Average", "", ...CourseAverage];
        (await workbook)
            .sheet(0)
            .range(`A${j}:${nextSt("C", CourseAverage.length)}${j}`)
            .value([AverageRow])
            .style("fontColor", "FF0000")
            .style("fill", "FFFF00")
            .style({ fontSize: 10, borderStyle: "thin", bold: true, horizontalAlignment: "center" });
        j++;

        // Finding out of 4 scores by dividing the averages by MAX and multiplying by 4
        let q = 0;
        let OutOfFour = CourseAverage.map(x => {
            return ((x / MAX[q++]) * 4);
        });


        // Inserting the OutOfFour ROW
        let OutOfFourRow = ["", "Out of 4", "", ...OutOfFour];
        (await workbook)
            .sheet(0)
            .range(`A${j}:${nextSt("C", OutOfFour.length)}${j}`)
            .value([OutOfFourRow])
            .style("fontColor", "FF0000")
            .style("fill", "FFFF00")
            .style({ fontSize: 10, borderStyle: "thin", bold: true, horizontalAlignment: "center" });
        j++;



        // Writing the number of students in excel file
        (await workbook)
            .sheet(0)
            .range(`B${j}:C${j}`)
            .value([["# Students", NumOfStudents]])
            .style("fontColor", "FF0000")
            .style("fill", "FFFF00")
            .style({ fontSize: 10, borderStyle: "thin", bold: true, horizontalAlignment: "center" });
        j++;

        const file = (await workbook).toFileAsync(`${path.join(process.cwd(), 'files', 'excelFiles')}/${code}.xlsx`);

        return (file);

    } catch (err) {
        console.error(err.message);
        return err;
    }
};


module.exports = excel;

