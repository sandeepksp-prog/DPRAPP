import os
import base64
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv('.env.local')

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

IMAGE_PATH = "C:/Users/gamin/.gemini/antigravity/brain/tempmediaStorage/media__1770894390712.jpg"

def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

base64_image = encode_image(IMAGE_PATH)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Analyze this UI design image deeply. Extract the following in JSON format: \n1. 'colors': list of hex codes for Main Background, Card Background, Primary Text, Secondary Text, Accent Color, and any 'Pastel' colors used for charts/highlights. \n2. 'design_tokens': description of Border Radius (px), Shadow Style (soft/hard), and Border Style.\n3. 'vibe': 3 keywords describing the aesthetic."},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}",
                    },
                },
            ],
        }
    ],
    model="llama-3.2-11b-vision-preview", 
    response_format={"type": "json_object"},
)

print(chat_completion.choices[0].message.content)
