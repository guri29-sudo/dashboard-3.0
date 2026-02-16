import os
import requests
from dotenv import load_dotenv

load_dotenv()

def verify_gemini():
    api_key = os.environ.get("GEMINI_API_KEY")
    
    if not api_key:
        print("❌ Gemini API Key missing in .env")
        return False
    
    # Use gemini-2.5-flash found in model list
    model = "gemini-2.5-flash" 
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    headers = {'Content-Type': 'application/json'}
    payload = {
        "contents": [{
            "parts": [{"text": "Ping"}]
        }]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            result = response.json()
            text = result['candidates'][0]['content']['parts'][0]['text']
            print(f"✅ Gemini connection successful! Response: {text.strip()}")
            return True
        else:
            print(f"❌ Gemini connection failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Gemini connection failed error: {e}")
        return False

if __name__ == "__main__":
    verify_gemini()
