const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const dir = 'D:/KSPL/DPR-APP/DATA/app_pages';

async function extract() {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.png')).sort((a, b) => {
        // Sort by page number
        const numA = parseInt(a.replace('page_', '').replace('.png', ''));
        const numB = parseInt(b.replace('page_', '').replace('.png', ''));
        return numA - numB;
    });

    let fullText = '';
    for (const file of files) {
        console.log(`Processing ${file}...`);
        const { data: { text } } = await Tesseract.recognize(
            path.join(dir, file),
            'eng'
        );
        fullText += `\n\n--- ${file} ---\n\n` + text;
    }

    fs.writeFileSync('extracted_questions.txt', fullText);
    console.log('Extraction complete. Saved to extracted_questions.txt');
}

extract();
