import os
import requests
from dotenv import load_dotenv

load_dotenv()

class AIAssistant:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        self.model = "gemini-2.5-flash"
        self.url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"

    def analyze_tasks(self, tasks_data, timetable_data=None):
        """
        Analyzes tasks with awareness of research requirements and user schedule.
        """
        prompt = f"""
        You are 'G-Assistant', a world-class personal researcher and productivity coach for user 'Goat'.
        
        CONTEXT:
        - Current Status: Analyzing daily plans and microprojects.
        - User Schedule: {timetable_data if timetable_data else 'Flexible'}
        
        TASKS TO PROCESS:
        {tasks_data}

        YOUR MISSION:
        1. RESEARCH: If any task looks like a 'microproject' or complex goal, automatically research the 'Required Materials' and 'Step-by-Step' guide.
        2. SCHEDULING: Suggest exact time slots based on the User's Schedule.
        3. MOTIVATION: Give a high-energy 'Goat' status update.

        OUTPUT FORMAT:
        Return a JSON object:
        {{
            "quick_win": "short string",
            "research": {{
                "topic": "string",
                "materials": ["list"],
                "steps": ["list"]
            }},
            "schedule_suggestion": [
                {{"task": "string", "slot": "HH:MM - HH:MM"}}
            ],
            "motivation": "string"
        }}
        """
        
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "response_mime_type": "application/json"
            }
        }
        
        try:
            response = requests.post(self.url, json=payload)
            if response.status_code == 200:
                result = response.json()
                return result['candidates'][0]['content']['parts'][0]['text']
            else:
                return f"Error: {response.status_code} - {response.text}"
        except Exception as e:
            return f"Exception: {e}"

if __name__ == "__main__":
    # Test logic
    assistant = AIAssistant()
    test_tasks = [
        {"title": "Build Dashboard UI", "priority": "high", "description": "Create a dark themed dashboard with animations"},
        {"title": "Buy milk", "priority": "low", "description": "Need groceries"}
    ]
    print(assistant.analyze_tasks(test_tasks))
