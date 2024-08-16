import argparse
from urllib.request import urlopen
from bs4 import BeautifulSoup
import re
import openai
import os
import json
from dotenv import load_dotenv
import requests
import logging

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

openai.api_key = os.getenv("OPENAI_API_KEY")

def fetch_and_clean_text(url):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        html = response.text
        soup = BeautifulSoup(html, features="html.parser")

        for script in soup(["script", "style"]):
            script.extract()

        text = soup.get_text()

        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        raw_text = '\n'.join(chunk for chunk in chunks if chunk)

        client = openai.OpenAI()

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a text cleaning assistant."},
                {"role": "user", "content": f"Clean the following text by removing duplicate lines and unnecessary whitespace, and generate a JSON with two fields: 'title', 'cleaned_text'. Respond only with the JSON, no additional text:\n\n{raw_text[:4000]}"}
            ]
        )

        cleaned_data = json.loads(response.choices[0].message.content)
        return cleaned_data
    
    except Exception as e:
        return {"error": f"Error processing the webpage: {str(e)}"}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Fetch and clean text from a URL.')
    parser.add_argument('url', type=str, help='The URL to fetch text from')
    args = parser.parse_args()

    result = fetch_and_clean_text(args.url)
    print(json.dumps(result))