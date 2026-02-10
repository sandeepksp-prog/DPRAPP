const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables (simple check since dotenv usage varies)
const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!API_KEY) {
    console.error("Error: GEMINI_API_KEY or GOOGLE_API_KEY environment variable is not set.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const IMAGE_PATH = path.join(__dirname, '../public/maps/mumiya_khera_base.png');
const OUTPUT_PATH = path.join(__dirname, '../public/maps/vision_data.json');

async function scanImage() {
    try {
        if (!fs.existsSync(IMAGE_PATH)) {
            console.error(`Error: Image not found at ${IMAGE_PATH}`);
            // Fallback for demo purposes if image is missing
            const fallbackData = {
                segments: [
                    { start: [100, 100], end: [500, 100], type: 'MAIN' },
                    { start: [500, 100], end: [500, 500], type: 'DISTRIBUTION' }
                ]
            };
            fs.writeFileSync(OUTPUT_PATH, JSON.stringify(fallbackData, null, 2));
            console.log("Created fallback data due to missing image.");
            return;
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const imageBuffer = fs.readFileSync(IMAGE_PATH);
        const imageBase64 = imageBuffer.toString('base64');

        const prompt = `Analyze this technical drawing. Identify all pipeline segments. Return a JSON object with a 'segments' array. Each object must have:
- \`start\`: [x, y] coordinates (approximate pixel values based on 1000x1000 grid).
- \`end\`: [x, y] coordinates.
- \`type\`: 'MAIN' (if line appears thick/bold) or 'DISTRIBUTION' (if line appears thin).
Output ONLY raw JSON. No markdown.`;

        console.log("Sending request to Gemini Vision API...");

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageBase64,
                    mimeType: "image/png"
                }
            }
        ]);

        const response = await result.response;
        let text = response.text();

        // Clean up markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(text);

        // Basic validation
        if (!data.segments || !Array.isArray(data.segments)) {
            throw new Error("Invalid response format: 'segments' array missing.");
        }

        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(data, null, 2));
        console.log(`Success! Extracted ${data.segments.length} segments to ${OUTPUT_PATH}`);

    } catch (error) {
        console.error("Vision Scan Failed:", error);
        // Ensure we always have a valid JSON file even on error
        if (!fs.existsSync(OUTPUT_PATH)) {
            fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ segments: [], error: error.message }, null, 2));
            console.log("Created empty JSON file after error.");
        }
    }
}

scanImage();
