const xlsx = require('xlsx-populate');
const path = require('path');

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

const excelAfterSession = async (data, evaluators, chair, fileName) => {
    try {

        var i = 'A';

        var workbook = xlsx.fromBlankAsync();

        for (let o = 0; o <= 100; o++) {
            let width = 15;
            (await workbook)
                .sheet(0)
                .column(`${i}`)
                .width(width)
                .hidden(false);

            i = nextSt(i, 1);

            if (o === 100)
                i = 'A';
        }

        (await workbook)
            .sheet(0)
            .range(`A1:B1`)
            .merged(true)
            .value(`DATE: ${new Date().getDate()} / ${new Date().getMonth()} / ${new Date().getFullYear()}`)
            .style({
                verticalAlignment: "center",
                bold: true
            });

        (await workbook)
            .sheet(0)
            .range(`A3:B3`)
            .merged(true)
            .value(`Session Chair: ${chair} `)
            .style({
                verticalAlignment: "center",
                bold: true
            });

        (await workbook)
            .sheet(0)
            .range(`A5:B5`)
            .merged(true)
            .value(`Signature:  `)
            .style({
                verticalAlignment: "center",
                bold: true
            });

        (await workbook)
            .sheet(0)
            .cell(`A7`)
            .value("Std Number")
            .style({
                fontSize: 10,
                verticalAlignment: "center",
                    horizontalAlignment: "center",
                borderStyle: "thin",
                bold: true,
                horizontalAlignment: "center"
            });

        (await workbook)
            .sheet(0)
            .cell(`B7`)
            .value("Std Name Surname")
            .style({
                fontSize: 10,
                verticalAlignment: "center",
                    horizontalAlignment: "center",
                borderStyle: "thin",
                bold: true,
                horizontalAlignment: "center"
            });

        i = "C";
        for (let x = 0; x < evaluators.length; x++) {
            (await workbook)
                .sheet(0)
                .range(`${i}7:${i = nextSt(i, 1)}7`)
                .value("Examiner Name Surname: \n" + evaluators[x])
                .style({
                    fontSize: 10,
                    borderStyle: "thin",
                    verticalAlignment: "center",
                    horizontalAlignment: "center",
                    bold: true,
                    underline: true,
                    shrinkToFit: true,
                    wrapText: true
                });
        }

        (await workbook)
            .sheet(0)
            .cell(`${i}7`)
            .value("Average")
            .style({
                fontSize: 10,
                verticalAlignment: "end",
                borderStyle: "thin",
                bold: true,
                underline: false,
                horizontalAlignment: "center"
            });


        (await workbook)
            .sheet(0)
            .cell(`${i = nextSt(i, 1)}7`)
            .value("Grade")
            .style({
                fontSize: 10,
                verticalAlignment: "end",
                borderStyle: "thin",
                bold: true,
                horizontalAlignment: "center"
            });

        i = 'A';
        let j = 8;
        for (let x = 0; x < data.length; x++) {
            (await workbook)
                .sheet(0)
                .range(`${i}${j}:${i = nextSt(i, data[x].length - 1)}${j}`)
                .value([data[x]])
                .style({
                    fontSize: 10,
                    borderStyle: "thin",
                    verticalAlignment: "center",
                    horizontalAlignment: "center",
                    shrinkToFit: true,
                    wrapText: true
                });
            i = 'A';
            j++;
        }



        const file = (await workbook).toFileAsync(`${path.join(process.cwd(), 'files', 'afterSessionFiles')}/${fileName}.xlsx`);

        return (file);

    } catch (err) {
        console.error(err.message);
        return err;
    }
};


module.exports = excelAfterSession;

