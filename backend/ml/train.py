import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import joblib
import os

# MASSIVELY EXPANDED DATASET FOR HACKATHON PRECISION
data = [
    # WATER
    ("water leakage from main pipe", "water", "high"),
    ("no water supply in sector 4", "water", "urgent"),
    ("muddy water coming from tap", "water", "high"),
    ("low water pressure since morning", "water", "medium"),
    ("water tank overflow in building", "water", "low"),
    ("broken water pipe on main road", "water", "high"),
    ("pipeline burst causing flooding", "water", "urgent"),
    ("drinking water smells bad", "water", "medium"),
    ("tap water is yellow", "water", "high"),
    ("scarcity of water for 2 days", "water", "high"),
    ("water pump not working", "water", "medium"),
    ("leakage in washroom pipe", "water", "low"),
    ("sewage water mixing with drinking water", "water", "urgent"),
    ("water department needed for repair", "water", "medium"),
    ("valve leak in water line", "water", "medium"),
    ("illegal water connection", "water", "medium"),
    ("water shortage in summer", "water", "high"),
    ("clogged water meter", "water", "low"),
    ("water line broken", "water", "high"),
    ("borewell repair", "water", "medium"),
    
    # ROAD
    ("pothole on bridge", "road", "high"),
    ("broken road near school", "road", "medium"),
    ("cracked pavement on sidewalk", "road", "medium"),
    ("road repair needed immediately", "road", "high"),
    ("open manhole is dangerous", "road", "urgent"),
    ("traffic light broken at junction", "road", "high"),
    ("divider broken by truck", "road", "medium"),
    ("highway subsidence after rain", "road", "urgent"),
    ("street road pothole deep", "road", "high"),
    ("road construction debris left on street", "road", "low"),
    ("speed breaker needed on street", "road", "low"),
    ("fallen tree blocking road", "road", "high"),
    ("slippery road due to oil spill", "road", "urgent"),
    ("unmarked road hump", "road", "medium"),
    ("street signs missing", "road", "low"),
    ("asphalt melting", "road", "low"),
    ("loose gravel on road", "road", "medium"),
    
    # ELECTRICAL
    ("electricity cut in block A", "electrical", "high"),
    ("total power failure in colony", "electrical", "urgent"),
    ("no electricity for 5 hours", "electrical", "high"),
    ("street light not working for week", "electrical", "medium"),
    ("electric current spark on pole", "electrical", "urgent"),
    ("transformer blasted with loud noise", "electrical", "urgent"),
    ("hanging wires touching trees", "electrical", "urgent"),
    ("short circuit in meter box", "electrical", "high"),
    ("power supply gone throughout street", "electrical", "high"),
    ("electric pole leaning over", "electrical", "high"),
    ("light off on street at night", "electrical", "medium"),
    ("voltage fluctuations high", "electrical", "high"),
    ("burning smell from electric board", "electrical", "urgent"),
    ("underground cable fault", "electrical", "high"),
    ("exposed wires on ground", "electrical", "urgent"),
    ("fuse blown", "electrical", "medium"),
    ("power outage", "electrical", "high"),
    
    # SANITATION
    ("garbage pile near market", "sanitation", "medium"),
    ("trash everywhere in park", "sanitation", "low"),
    ("foul smell from open drain", "sanitation", "medium"),
    ("dead animal on road", "sanitation", "high"),
    ("overflowing bin not cleared", "sanitation", "low"),
    ("dirty public toilets", "sanitation", "medium"),
    ("sewage leak in residential area", "sanitation", "high"),
    ("drain blocked with plastic", "sanitation", "high"),
    ("garbage collector not coming", "sanitation", "low"),
    ("illegal waste dumping site", "sanitation", "medium"),
    ("mosquito breeding in stagnant water", "sanitation", "high"),
    ("industrial waste being dumped", "sanitation", "high"),
    ("public dustbin broken", "sanitation", "low"),
    ("septic tank overflow", "sanitation", "urgent"),
    ("gutter cleaning needed", "sanitation", "medium"),
    ("stagnant water in drain", "sanitation", "high"),
    ("bad smell from gutter", "sanitation", "medium"),
    
    # OTHER
    ("loud noise from nightclub", "other", "medium"),
    ("stray dogs biting people", "other", "high"),
    ("illegal parking on pavement", "other", "low"),
    ("noise pollution from factory", "other", "medium"),
    ("street vendors blocking way", "other", "low"),
    ("pigeon menace in balcony", "other", "low"),
    ("illegal construction near park", "other", "medium"),
    ("air pollution from burning plastic", "other", "high"),
    ("wall collapse risk", "other", "high"),
]

df = pd.DataFrame(data, columns=["text", "category", "priority"])

def train_models():
    print(f"Retraining with {len(df)} precision examples...")
    
    # We use a very low alpha for MultinomialNB to ensure dominant keywords win
    cat_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1, 2), stop_words='english')), 
        ('clf', MultinomialNB(alpha=0.01)), 
    ])
    cat_pipeline.fit(df['text'].str.lower(), df['category'])
    
    pri_pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1, 2))),
        ('clf', MultinomialNB(alpha=0.1)),
    ])
    pri_pipeline.fit(df['text'].str.lower(), df['priority'])
    
    if not os.path.exists('models'):
        os.makedirs('models')
    
    joblib.dump(cat_pipeline, 'models/category_model.pkl')
    joblib.dump(pri_pipeline, 'models/priority_model.pkl')
    print("AI Models successfully rebuilt and saved.")

if __name__ == "__main__":
    train_models()
