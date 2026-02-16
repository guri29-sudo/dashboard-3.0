import os
import requests
from dotenv import load_dotenv
from tools.ai_assistant import AIAssistant

load_dotenv()

class NavigationLayer:
    def __init__(self):
        self.supabase_url = os.environ.get("SUPABASE_URL")
        self.supabase_key = os.environ.get("SUPABASE_ANON_KEY")
        self.headers = {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json"
        }
        self.ai = AIAssistant()

    def run_productivity_cycle(self, user_id):
        """
        Main reasoning loop: Fetch tasks -> Analyze with AI -> Post suggestions.
        """
        print(f"🔄 Starting productivity cycle for user {user_id}...")
        
        # 1. Fetch pending tasks
        res = requests.get(
            f"{self.supabase_url}/rest/v1/tasks?user_id=eq.{user_id}&status=eq.pending",
            headers=self.headers
        )
        
        if res.status_code != 200:
            print(f"❌ Failed to fetch tasks: {res.text}")
            return
        
        tasks = res.json()
        if not tasks:
            print("📭 No pending tasks found.")
            return

        # 2. Analyze with AI
        print("🧠 Analyzing tasks with AI...")
        analysis_json = self.ai.analyze_tasks(tasks)
        
        # 3. Create Notification item
        print("🔔 Posting AI suggestion to notifications...")
        notif_payload = {
            "user_id": user_id,
            "title": "AI Productivity Insight",
            "message": analysis_json,
            "type": "ai_suggestion"
        }
        
        res_notif = requests.post(
            f"{self.supabase_url}/rest/v1/notifications",
            headers=self.headers,
            json=notif_payload
        )
        
        if res_notif.status_code in [201, 200]:
            print("✅ Cycle complete. Notification posted.")
        else:
            print(f"❌ Failed to post notification: {res_notif.text}")

if __name__ == "__main__":
    # Example usage (would be triggered by cron or webhook)
    nav = NavigationLayer()
    # Note: user_id would come from context in production
    # nav.run_productivity_cycle("some-uuid")
    print("Navigation Layer initialized. Ready for triggers.")
