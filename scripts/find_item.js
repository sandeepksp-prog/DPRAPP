const xlsx = require('xlsx');
const workbook = xlsx.readFile('d:\\KSPL\\DPR-APP\\BILLING DATA\\KSPL PMS-DATA.xlsx');
const sheet = workbook.Sheets['BOQ'];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

for (let i = 11; i < data.length; i++) {
    const row = data[i];
    const description = String(row[5] || '');
    if (description.includes('275 Kl')) {
        console.log('Found:', row[4], description);
    }
}
