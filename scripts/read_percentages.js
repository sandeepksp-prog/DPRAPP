const xlsx = require('xlsx');
const workbook = xlsx.readFile('d:\\KSPL\\DPR-APP\\BILLING DATA\\PRECENTAGE BREAKUP.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const type6 = [];
const type7 = [];

data.forEach(r => {
    const type = String(r[0] || '').trim();
    if (type === 'Type 6') {
        type6.push({ percentage: r[1], description: r[2] });
    } else if (type === 'Type 7') {
        type7.push({ percentage: r[1], description: r[2] });
    }
});

console.log('Type 6:', type6);
console.log('Type 7:', type7);
