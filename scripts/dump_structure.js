const fs = require('fs');
const path = require('path');

const jsonPath = path.join('D:', 'KSPL', 'DPR-APP', 'DATA', 'app_pages', 'Daily Project Report.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

function getType(obj) {
    if (Array.isArray(obj)) return 'Array[' + obj.length + ']';
    if (obj === null) return 'null';
    return typeof obj;
}

function dumpStructure(obj, depth = 0, maxDepth = 4) {
    if (depth > maxDepth) return '...';
    if (typeof obj !== 'object' || obj === null) return obj;
    
    if (Array.isArray(obj)) {
        if (obj.length === 0) return '[]';
        // Just dump the first element's structure to save space
        return '[ ' + dumpStructure(obj[0], depth + 1, maxDepth) + ', ... ]';
    }
    
    let result = '{\n';
    const indent = '  '.repeat(depth + 1);
    for (const key in obj) {
        result += indent + key + ' (' + getType(obj[key]) + '): ' + dumpStructure(obj[key], depth + 1, maxDepth) + '\n';
    }
    result += '  '.repeat(depth) + '}';
    return result;
}

fs.writeFileSync('parsed_fillout.md', dumpStructure(data, 0, 4));
console.log('Structure dumped to parsed_fillout.md');
