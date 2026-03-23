import random

class CivicBot:
    def __init__(self):
        self.intents = {
            "greeting": ["hi", "hello", "hey", "greetings"],
            "file_complaint": ["file", "report", "complaint", "submit"],
            "track_status": ["track", "status", "check", "progress"],
            "emergency": ["emergency", "urgent", "immediate", "danger"],
            "help": ["help", "how", "setup", "use"]
        }
        self.responses = {
            "greeting": "Hello! I'm CivicSense AI. How can I assist you with your civic concerns today?",
            "file_complaint": "To report an issue, click the 'Complaint Now' button on the home page and fill out the details.",
            "track_status": "You can track your existing complaints by entering your Complaint ID in the 'Track Complaints' section.",
            "emergency": "If this is a life-threatening emergency, please call local emergency services immediately. Otherwise, report it with 'Urgent' priority.",
            "help": "I can help you navigate the platform, report issues, and monitor resolutions. Just ask me anything!",
            "default": "I'm not exactly sure how to help with that yet. Could you rephrase your question? I'm still learning!"
        }

    def get_response(self, user_text):
        user_text = user_text.lower()
        for intent, keywords in self.intents.items():
            if any(key in user_text for key in keywords):
                return self.responses[intent]
        return self.responses["default"]

bot = CivicBot()
