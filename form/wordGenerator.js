const express = require('express');
const router = express.Router();
const officegen = require('officegen');
const fs = require('fs');
const path = require('path');
const { criteria, course } = require(`./wordGeneratorCriteria`);
const { Console } = require('console');
var _ = require('lodash');

const word = async (filePath, code, information, ReportTableGrades, CoopGrades, QualityGrades, PresentGrades, originality) => {
    try {
        const { infoLabels, ReportTableLabels, ReportTableWeights, CoopLabels, CoopWeights, PresentLabels, 
            PresentWeights, QualityLabels, QualityWeights } = criteria[code];


        code = code.substring(0, 7);
        const choice = course[code];

        if ((ReportTableWeights.reduce((a, b) => a + b) + CoopWeights.reduce((a, b) => a + b) + PresentWeights.reduce((a, b) => a + b) + QualityWeights.reduce((a, b) => a + b)) !== 100) {
            throw new Error('Total weights should be equal to 400');
        }

        // if (
        //     information.length !== infoLabels.length ||
        //     ReportTableGrades.length !== ReportTableWeights.length ||
        //     CoopGrades.length !== CoopLabels.length ||
        //     QualityGrades.length !== QualityLabels.length ||
        //     PresentGrades.length !== PresentLabels.length ||
        //     originality === null
        // ) {
        //     throw new Error('Missing Credentials');
        // }


        let docx = officegen('docx');

        var ReportTotal = CoopTotal = QualityTotal = PresentationTotal = 0;

        var twoColumnStyle = {
            tableColWidth: 7000,
            sz: '20',
            tableColor: "ada",
            tableAlign: "left",
            tableFontFamily: "Calibri",
            fixedLayout: true,
            borders: true,
            borderSize: 3,
            columns: []
        };

        var fourColumnStyle = {
            tableColWidth: 1000,
            sz: '20',
            tableColor: "ada",
            tableSize: 24,
            tableAlign: "left",
            tableFontFamily: "Calibri",
            fixedLayout: true,
            borders: true,
            borderSize: 3,
            columns: []
        };

        var finalTableStyle = {
            tableColWidth: 1000,
            sz: '28',
            tableColor: "ada",
            tableAlign: "left",
            tableFontFamily: "Calibri",
            fixedLayout: true,
            borders: true,
            borderSize: 3,
            columns: []
        };

        const header = [
            { val: '', opts: { cellColWidth: 6000 } }, { val: 'Score', opts: { b: true, align: "center", vAlign: "center" } }, { val: 'Weight', opts: { b: true, align: "center", vAlign: "center" } }, { val: 'Score X Weight', opts: { b: true } }
        ];

        const totalReportTable = [
            { val: `${choice.text1}`, opts: { b: true, cellColWidth: 6000 } }, { opts: { shd: { fill: "7F7F7F" } } }, { opts: { shd: { fill: "7F7F7F" } } }, { val: "", opts: { align: "center", vAlign: "center", b: true, sz: '24', shd: { fill: "#ED793B" } } }
        ];
        const totalCoop = [
            { val: `${choice.text1}`, opts: { b: true, cellColWidth: 6000 } }, { opts: { shd: { fill: "7F7F7F" } } }, { opts: { shd: { fill: "7F7F7F" } } }, { val: "", opts: { align: "center", vAlign: "center", b: true, sz: '24', shd: { fill: "#ED793B" } } }
        ];
        const totalQuality = [
            { val: `${choice.text1}`, opts: { b: true, cellColWidth: 6000 } }, { opts: { shd: { fill: "7F7F7F" } } }, { opts: { shd: { fill: "7F7F7F" } } }, { val: "", opts: { align: "center", vAlign: "center", b: true, sz: '24', shd: { fill: "#ED793B" } } }
        ];
        const totalPresent = [
            { val: `${choice.text1}`, opts: { b: true, cellColWidth: 6000 } }, { opts: { shd: { fill: "7F7F7F" } } }, { opts: { shd: { fill: "7F7F7F" } } }, { val: "", opts: { align: "center", vAlign: "center", b: true, sz: '24', shd: { fill: "#ED793B" } } }
        ];

        let Text1 = docx.createP();

        Text1.addText(`${choice.text2}`,
            { bold: true, font_size: 14 }
        );

        // Information Table
        let informationTable = infoLabels.map(i => {
            row = [
                { val: `${i}`, opts: { b: true, cellColWidth: 2000 } }, { val: `${information[0]}` }
            ];
            information.push(information.shift());
            return row;
        });

        docx.createTable(informationTable, twoColumnStyle);

        let Text2 = docx.createP();

        Text2.addLineBreak();
        Text2.addLineBreak();

        Text2.addText(`${choice.text3}`,
            {
                bold: true,
                font_size: 12
            }
        );

        Text2.addLineBreak();
        Text2.addLineBreak();

        Text2.addText(`${choice.text4}`,
            { bold: true, font_size: 16 }
        );

        // Report Table

        let ReportTable = ReportTableLabels.map(i => {
            row = [
                { val: `${i}`, opts: { b: true, cellColWidth: 6000 } }, { val: `${ReportTableGrades[0]}`, opts: { align: "center", vAlign: "center", sz: '24' } }, { val: `${ReportTableWeights[0]}`, opts: { align: "center", vAlign: "center", b: true, sz: '24' } }, { val: `${(ReportTableGrades[0] * ReportTableWeights[0])}`, opts: { align: "center", vAlign: "center", sz: '24' } }
            ];
            ReportTotal += ReportTableGrades[0] * ReportTableWeights[0];
            ReportTableWeights.push(ReportTableWeights.shift());
            ReportTableGrades.push(ReportTableGrades.shift());
            return row;
        });

        totalReportTable[3].val = ReportTotal;

        ReportTable = [[...header], ...ReportTable, [...totalReportTable]];

        docx.createTable(ReportTable, fourColumnStyle);

        let Text3 = docx.createP();

        Text3.addLineBreak();
        Text3.addLineBreak();
        Text3.addLineBreak();

        Text3.addText(`${choice.text5}`,
            { bold: true, font_size: 16 }
        );

        // Cooperation Table

        let Coop = CoopLabels.map(i => {
            row = [
                { val: `${i}`, opts: { b: true, cellColWidth: 6000 } }, { val: `${CoopGrades[0]}`, opts: { align: "center", vAlign: "center", sz: '24' } }, { val: `${CoopWeights[0]}`, opts: { align: "center", vAlign: "center", b: true, sz: '24' } }, { val: `${(CoopGrades[0] * CoopWeights[0])}`, opts: { align: "center", vAlign: "center", sz: '24' } }
            ];
            CoopTotal += CoopWeights[0] * CoopGrades[0];
            CoopWeights.push(CoopWeights.shift());
            CoopGrades.push(CoopGrades.shift());
            return row;
        });

        totalCoop[3].val = CoopTotal;

        Coop = [[...header], ...Coop, [...totalCoop]];

        docx.createTable(Coop, fourColumnStyle);

        let Text4 = docx.createP();

        Text4.addLineBreak();
        Text4.addLineBreak();
        Text4.addLineBreak();

        Text4.addText(`${choice.text6}`,
            { bold: true, font_size: 16 }
        );

        // Quality Table

        let Quality = QualityLabels.map(i => {
            row = [
                { val: `${i}`, opts: { b: true, cellColWidth: 6000 } }, { val: `${QualityGrades[0]}`, opts: { align: "center", vAlign: "center", sz: '24' } }, { val: `${QualityWeights[0]}`, opts: { align: "center", vAlign: "center", b: true, sz: '24' } }, { val: `${(QualityGrades[0] * QualityWeights[0])}`, opts: { align: "center", vAlign: "center", sz: '24' } }
            ];
            QualityTotal += QualityWeights[0] * QualityGrades[0];
            QualityWeights.push(QualityWeights.shift());
            QualityGrades.push(QualityGrades.shift());
            return row;
        });

        totalQuality[3].val = QualityTotal;

        Quality = [[...header], ...Quality, [...totalQuality]];

        docx.createTable(Quality, fourColumnStyle);

        docx.putPageBreak();

        let Text5 = docx.createP();

        Text5.addText(`${choice.text7}`,
            {
                bold: true,
                font_size: 16
            }
        );

        // Presentation Table

        let Present = PresentLabels.map(i => {
            row = [
                { val: `${i}`, opts: { b: true, cellColWidth: 6000 } }, { val: `${PresentGrades[0]}`, opts: { align: "center", vAlign: "center", sz: '24' } }, { val: `${PresentWeights[0]}`, opts: { align: "center", vAlign: "center", b: true, sz: '24' } }, { val: `${(PresentGrades[0] * PresentWeights[0])}`, opts: { align: "center", vAlign: "center", sz: '24' } }
            ];
            PresentationTotal += PresentWeights[0] * PresentGrades[0];
            PresentWeights.push(PresentWeights.shift());
            PresentGrades.push(PresentGrades.shift());
            return row;
        });

        totalPresent[3].val = PresentationTotal;

        Present = [[...header], ...Present, [...totalPresent]];

        docx.createTable(Present, fourColumnStyle);

        let Text6 = docx.createP();

        Text6.addLineBreak();
        Text6.addLineBreak();
        Text6.addLineBreak();
        Text6.addLineBreak();

        // Summary Table
        let SummaryLabels = choice.SummaryLabels;
        const G = ReportTotal + CoopTotal + QualityTotal + PresentationTotal;
        const T = G / 4;
        const O = originality / 100;
        var finalGrade = T * O;
        finalGrade = parseInt('' + (finalGrade * 100)) / 100;

        const FinalTable = [ReportTotal, CoopTotal, QualityTotal, PresentationTotal, G, T, originality, finalGrade];

        let Summary = SummaryLabels.map(i => {
            if (i === `${choice.text9}`) {
                row = [
                    { val: `${i}`, opts: { b: true, cellColWidth: 6000 } }, { val: `${FinalTable[0]} %` }
                ];
                FinalTable.push(FinalTable.shift());
                return row;
            }
            if (i === `${choice.text10}`) {
                row = [
                    { val: `${i}`, opts: { b: true, cellColWidth: 6000 } }, { val: `${FinalTable[0]}`, opts: { b: true, shd: { fill: '#ED793B' } } }
                ];
                FinalTable.push(FinalTable.shift());
                return row;
            }
            row = [
                { val: `${i}`, opts: { b: true, cellColWidth: 6000 } }, { val: `${FinalTable[0]}` }
            ];
            FinalTable.push(FinalTable.shift());
            return row;
        });

        Summary = [[{ val: `${choice.text11}`, opts: { b: true } }, ''], ...Summary]

        docx.createTable(Summary, finalTableStyle);

        let Text7 = docx.createP();

        Text7.addLineBreak();
        Text7.addLineBreak();

        Text7.addText(`${choice.text8}`,
            {
                bold: false,
                font_size: 10
            }
        );
        const dir = path.join(process.cwd(), 'files', 'Evaluations');
        let out = fs.createWriteStream(`${dir}/${filePath}`);

        await docx.generate(out);

        const object = {
            ReportTotal,
            CoopTotal,
            QualityTotal,
            PresentationTotal
        };

        return (object);

    } catch (err) {
        console.error(err.message);
        return null;
    }
};

module.exports = word;
