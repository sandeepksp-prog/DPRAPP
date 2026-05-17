const xlsx = require('xlsx');
const workbook = xlsx.readFile('d:\\KSPL\\DPR-APP\\BILLING DATA\\KSPL PMS-DATA.xlsx');
const sheet = workbook.Sheets['BOQ'];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

const schemeIds = [];
const numSchemes = 49;

for (let i = 0; i < numSchemes; i++) {
    const colIdx = 7 + (i * 3);
    const scheme_id = data[4]?.[colIdx];
    if (scheme_id) {
        schemeIds.push(String(scheme_id).trim());
    }
}

console.log('Scheme IDs in file:', schemeIds);

const type6_schemes = ['20070355', '20086120', '20086089', '20070351', '20086097', '20086150', '20086107', '20018647', '20018940', '20033428'];

const missing = type6_schemes.filter(id => !schemeIds.includes(id));
console.log('Missing Type 6 schemes:', missing);
