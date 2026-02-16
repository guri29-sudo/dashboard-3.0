import os
import requests
from dotenv import load_dotenv

load_dotenv()

def verify_supabase():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_ANON_KEY")
    
    if not url or not key:
        print("❌ Supabase URL or Key missing in .env")
        return False
    
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}"
    }
    
    try:
        # Check if the tasks table exists
        response = requests.get(f"{url}/rest/v1/tasks?select=*", headers=headers)
        
        if response.status_code == 200:
            print("✅ Supabase connection successful! (Table 'tasks' found)")
        elif response.status_code == 404:
            print("⚠️  Supabase connected, but table 'tasks' not found (Expected. We need to run schema.sql).")
        else:
            print(f"❌ Supabase connection failed: {response.status_code} - {response.text}")
            return False
            
        print("✅ Supabase handshake verified.")
        return True
    except Exception as e:
        print(f"❌ Supabase connection failed error: {e}")
        return False

if __name__ == "__main__":
    verify_supabase()
