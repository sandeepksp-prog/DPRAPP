import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.SPL_AI_KEY });

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Extract MIME type and base64 data
    const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType
              }
            },
            {
              text: `Analyze this person's face and classify their appearance into strict categories to generate a flat-vector avatar.

Respond ONLY with a valid JSON object matching this schema:
{
  "skinTone": "light" | "medium" | "dark",
  "hairStyle": "short" | "long" | "bald" | "pixie" | "curly" | "braids" | "turban",
  "hairColor": "black" | "brown" | "blonde" | "grey",
  "hasBeard": boolean,
  "hasGlasses": boolean,
  "gender": "male" | "female"
}

Do not include any markdown formatting like \`\`\`json. Return raw JSON only.`
            }
          ]
        }
      ],
      config: {
        temperature: 0.1,
      }
    });

    let resultText = response.text || "{}";
    // Clean up in case model wrapped it in markdown
    resultText = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsed = JSON.parse(resultText);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Vision API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
