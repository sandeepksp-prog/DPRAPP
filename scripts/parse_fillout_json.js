const fs = require('fs');
const path = require('path');

const jsonPath = path.join('D:', 'KSPL', 'DPR-APP', 'DATA', 'app_pages', 'Daily Project Report.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Assuming the JSON is a typical form builder schema (pages -> elements/questions)
// We will extract pages and elements
let output = '# Fillout Form Structure Extraction\n\n';

const template = data.template || {};
const steps = template.steps || {};

if (Object.keys(steps).length > 0) {
    Object.values(steps).forEach((step, index) => {
        output += `## Page ${index + 1}: ${step.name || step.id || 'Unnamed Step'} (Type: ${step.type})\n`;
        
        // Branching logic
        if (step.nextStep && step.nextStep.branches && step.nextStep.branches.length > 0) {
            output += `  - Next Page Branches:\n`;
            step.nextStep.branches.forEach(b => {
                output += `    - Condition: ${JSON.stringify(b.condition)} -> Goes to: ${b.nextStepId}\n`;
            });
            output += `    - Default: ${step.nextStep.defaultNextStep}\n`;
        }

        const widgetsObj = step.template && step.template.widgets ? step.template.widgets : {};
        const widgets = Object.values(widgetsObj);
        
        if (widgets.length > 0) {
            widgets.forEach(w => {
                let text = w.id;
                let options = [];
                let visibility = null;
                
                if (w.template) {
                    if (w.template.label && w.template.label.logic) {
                        text = w.template.label.logic.value.replace(/<[^>]*>?/gm, '');
                    }
                    if (w.template.options && Array.isArray(w.template.options)) {
                        options = w.template.options.map(o => {
                            let optLabel = o.id;
                            if (o.label && o.label.logic) optLabel = o.label.logic.value.replace(/<[^>]*>?/gm, '');
                            return optLabel;
                        });
                    }
                    if (w.template.condition && w.template.condition.logic) {
                        if (Object.keys(w.template.condition.logic).length > 0 && w.template.condition.logic.and && w.template.condition.logic.and.length > 0) {
                            visibility = JSON.stringify(w.template.condition.logic.and);
                        }
                    }
                }
                
                if (w.content && w.content.blocks) {
                    text = w.content.blocks.map(b => b.text).join(' ');
                }

                if (w.type !== 'Button' && w.type !== 'FillAgainButton' && w.type !== 'ThankYou') {
                    output += `### ${text}\n`;
                    output += `- **Type:** ${w.type}\n`;
                    if (options.length > 0) {
                        output += `- **Options:**\n`;
                        options.forEach(opt => {
                            output += `  - ${opt}\n`;
                        });
                    }
                    if (visibility) {
                        output += `- **Visibility Logic:** ${visibility}\n`;
                    }
                    output += '\n';
                }
            });
        }
        output += '\n';
    });
} else {
    output += 'Template Keys: ' + Object.keys(template).join(', ') + '\n';
}

fs.writeFileSync('parsed_fillout.md', output);
console.log('Successfully parsed JSON into parsed_fillout.md');
