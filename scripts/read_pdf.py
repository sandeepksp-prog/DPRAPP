import pdfplumber
import sys

PDF_PATH = r"d:\KSPL\DPR-APP\DATA\APP.pdf"

try:
    with pdfplumber.open(PDF_PATH) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() + "\n"
        print(text)
except Exception as e:
    print(f"Error reading PDF: {e}")
