import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# 1. DEFINE THE COLUMNS
# The dataset doesn't have headers, so we must add them manually.
# These are standard networking features (Duration of connection, Protocol used, etc.)
columns = [
    "duration", "protocol_type", "service", "flag", "src_bytes", "dst_bytes",
    "land", "wrong_fragment", "urgent", "hot", "num_failed_logins",
    "logged_in", "num_compromised", "root_shell", "su_attempted", "num_root",
    "num_file_creations", "num_shells", "num_access_files", "num_outbound_cmds",
    "is_host_login", "is_guest_login", "count", "srv_count", "serror_rate",
    "srv_serror_rate", "rerror_rate", "srv_rerror_rate", "same_srv_rate",
    "diff_srv_rate", "srv_diff_host_rate", "dst_host_count", "dst_host_srv_count",
    "dst_host_same_srv_rate", "dst_host_diff_srv_rate", "dst_host_same_src_port_rate",
    "dst_host_srv_diff_host_rate", "dst_host_serror_rate", "dst_host_srv_serror_rate",
    "dst_host_rerror_rate", "dst_host_srv_rerror_rate", "label", "difficulty"
]

print("⏳ Step 1: Loading the Dataset...")
# Read the CSV file
df = pd.read_csv("train_data.csv", header=None, names=columns)

print(f"   - Loaded {len(df)} rows of network traffic data.")

# 2. DATA PREPROCESSING (CLEANING)
print("🧹 Step 2: Cleaning the Data...")

# We only want to train on a few simple features for this project to keep it fast.
# In a real PHD project, you would use all 40 columns.
selected_features = [
    'duration',     # How long the connection lasted
    'src_bytes',    # Data sent from source
    'dst_bytes',    # Data sent from destination
    'logged_in',    # 1 if successfully logged in, 0 if not
    'count',        # Number of connections to the same host
    'srv_count'     # Number of connections to the same service
]

X = df[selected_features] # The "Questions" (Input data)
y = df['label']           # The "Answers" (Is it an attack?)

# Convert the answers to simple Numbers:
# If label is 'normal', it's 0 (Safe). Everything else is 1 (Attack).
y = y.apply(lambda x: 0 if x == 'normal' else 1)

print("   - Data preparation complete.")

# 3. TRAIN THE MODEL
print("🧠 Step 3: Training the Artificial Intelligence...")
# We use Random Forest because it is very good at classification tasks.
model = RandomForestClassifier(n_estimators=50, random_state=42)
model.fit(X, y)

print("   - Training complete!")

# 4. SAVE THE BRAIN
print("💾 Step 4: Saving the model to file...")
joblib.dump(model, "cyber_model.pkl")

print("\n✅ SUCCESS! 'cyber_model.pkl' has been created.")
print("You can now move to Week 2.")