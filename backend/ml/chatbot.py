import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import random

class CivicBot:
    def __init__(self):
        # "more data to train"
        self.training_data = [
            # Greetings
            ("hello", "greeting"), ("hi there", "greeting"), ("hey", "greeting"), 
            ("good morning", "greeting"), ("good afternoon", "greeting"), ("yo", "greeting"),
            
            # File complaints
            ("i want to file a complaint", "file_complaint"), ("how to report an issue", "file_complaint"),
            ("submit a grievance", "file_complaint"), ("where can i complain", "file_complaint"),
            ("report a pothole", "file_complaint"), ("garbage on the street", "file_complaint"),
            ("broken street light", "file_complaint"), ("water leak issue", "file_complaint"),
            
            # Tracking
            ("track my complaint", "track_status"), ("what is the status of my issue", "track_status"),
            ("check progress", "track_status"), ("has my problem been resolved", "track_status"),
            ("where is my complaint", "track_status"),
            
            # Emergency
            ("this is an emergency", "emergency"), ("urgent help needed", "emergency"),
            ("immediate danger", "emergency"), ("someone is hurt", "emergency"),
            ("accident please help", "emergency"),
            
            # AI & Platform Info
            ("how does this platform work", "how_it_works"), ("what is civicsense", "how_it_works"),
            ("what do you do", "how_it_works"), ("who are you", "identity"),
            ("are you an ai", "identity"), ("are you a bot", "identity"),
            ("how does the ai work", "how_it_works"),
            
            # Features
            ("what are the features", "features"), ("ai analysis", "features"),
            ("timebound resolution", "features")
        ]
        
        self.responses = {
            "greeting": [
                "Hello! I am the CivicSense AI Assistant. How can I help you today?",
                "Hi there! Ready to assist you with your civic concerns. What do you need?",
                "Greetings! I'm a machine learning powered bot here to ensure your voice is heard. How can I help?"
            ],
            "file_complaint": [
                "To report an issue, simply click the 'Complaint Now' button on the home page or dashboard. Our AI models will instantly categorize and assign your issue to the correct department!"
            ],
            "track_status": [
                "Transparency is our priority! You can track any existing complaint by navigating to the 'Track Complaints' section and entering your unique Complaint ID."
            ],
            "emergency": [
                "🚨 **EMERGENCY:** If this is a life-threatening situation, please call your local emergency hotline immediately! For urgent civic issues, submit a complaint and mark it 'Urgent'."
            ],
            "how_it_works": [
                "CivicSense is an advanced AI-powered Grievance System. You submit an issue, and our NLP models map the contextual data to assign it to the responsible authority with a strict resolution deadline."
            ],
            "identity": [
                "I am the CivicSense AI Assistant! I am trained using NLP (Natural Language Processing) to accurately understand your queries and guide you through our platform."
            ],
            "features": [
                "We pride ourselves on 4 core features: Advanced AI Analysis, Strict Time-Bound Resolution, Transparent Status Tracking, and 24/7 AI Assistance (that's me!)."
            ],
            "default": "I'm still analyzing data on that topic. Could you rephrase your question, or ask me about filing complaints, tracking, or how our AI works?"
        }
        
        # Train the TF-IDF Vectorizer
        self.corpus = [text for text, intent in self.training_data]
        self.intents = [intent for text, intent in self.training_data]
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.vectorizer.fit_transform(self.corpus)

    def get_response(self, user_text):
        if not user_text.strip():
            return self.responses["default"]
            
        # Vectorize user input
        user_vec = self.vectorizer.transform([user_text])
        
        # Calculate cosine similarities
        similarities = cosine_similarity(user_vec, self.tfidf_matrix).flatten()
        
        # Best intent match
        best_match_idx = np.argmax(similarities)
        best_score = similarities[best_match_idx]
        
        CONFIDENCE_THRESHOLD = 0.25
        
        if best_score >= CONFIDENCE_THRESHOLD:
            predicted_intent = self.intents[best_match_idx]
            response = self.responses.get(predicted_intent, self.responses["default"])
            if isinstance(response, list):
                return random.choice(response)
            return response
            
        return self.responses["default"]

bot = CivicBot()
