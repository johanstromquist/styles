#!/usr/bin/env python3
"""
PDF to Markdown Converter for 'subject' Folder

Requirements:
    pip install pdfplumber markdownify
"""
import os
import pdfplumber
from markdownify import markdownify as md

SUBJECT_DIR = os.path.join(os.path.dirname(__file__), 'subject')

for filename in os.listdir(SUBJECT_DIR):
    if filename.lower().endswith('.pdf'):
        pdf_path = os.path.join(SUBJECT_DIR, filename)
        md_path = os.path.splitext(pdf_path)[0] + '.md'
        if os.path.exists(md_path):
            print(f"[SKIP] Markdown already exists for {filename}")
            continue
        try:
            print(f"[INFO] Converting {filename} to Markdown...")
            with pdfplumber.open(pdf_path) as pdf:
                text = ''
                for page in pdf.pages:
                    text += page.extract_text() or ''
                    text += '\n\n'
            # Optionally, you could use markdownify if you want to convert HTML to MD
            # Here, we just save the plain text as Markdown
            with open(md_path, 'w', encoding='utf-8') as f:
                f.write(md(text))
            print(f"[DONE] Saved: {os.path.basename(md_path)}")
        except Exception as e:
            print(f"[ERROR] Failed to convert {filename}: {e}") 