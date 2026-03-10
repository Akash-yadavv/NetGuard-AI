# Backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

# 1. INITIALIZE THE APP
app = FastAPI()

# 2. ENABLE COMMUNICATION
# This allows your React website (on port 3000) to talk to this Python script (on port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all connections (simple for students)
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. LOAD THE BRAIN
# We load the model you just trained in Week 1
print("⏳ Loading AI Model...")
model = joblib.load('cyber_model.pkl')
print("✅ AI Model Loaded and Ready!")

# 4. DEFINE THE INPUT FORMAT
# We expect the frontend to send these 6 numbers
class NetworkTraffic(BaseModel):
    duration: int
    src_bytes: int
    dst_bytes: int
    logged_in: int
    count: int
    srv_count: int

# 5. CREATE THE ENDPOINT
@app.post("/predict")
def predict_threat(traffic: NetworkTraffic):
    # Convert the incoming data into a format the model understands (DataFrame)
    data = pd.DataFrame([[
        traffic.duration, 
        traffic.src_bytes, 
        traffic.dst_bytes, 
        traffic.logged_in, 
        traffic.count, 
        traffic.srv_count
    ]], columns=['duration', 'src_bytes', 'dst_bytes', 'logged_in', 'count', 'srv_count'])

    # Ask the AI to predict (0 = Normal, 1 = Attack)
    prediction = model.predict(data)[0]
    confidence = model.predict_proba(data).max()

    # Create a readable response
    if prediction == 1:
        result = "Attack"
        threat_type = "DoS/Probe" # In a real system, we'd be more specific
    else:
        result = "Normal"
        threat_type = "None"

    return {
        "status": result,
        "threat_type": threat_type,
        "confidence": round(float(confidence) * 100, 2)
    }

# 6. RUN MESSAGE
print("🚀 Server is starting...")