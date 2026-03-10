# 🛡️ NetGuard AI: Real-Time Threat Detection

NetGuard AI is a Machine Learning-based cybersecurity system designed to monitor network traffic and detect potential security breaches in real-time. By leveraging anomaly detection algorithms, the system effectively isolates threats that deviate from standard network behavior patterns.

## 🚀 Project Overview
Traditional signature-based detection systems often miss zero-day attacks. NetGuard AI tackles this by using the **Isolation Forest** algorithm to establish a baseline of normal network activity and flag unusual packets or traffic spikes as potential threats.

### 📁 Core Files
* `train_model.py`: The machine learning pipeline. It loads the dataset, trains the anomaly detection model, and exports it as a `.pkl` file.
* `main.py`: The core application script. It loads the pre-trained model to monitor and classify incoming network data in real-time.
<img width="1868" height="826" alt="Screenshot 2026-03-10 140210" src="https://github.com/user-attachments/assets/d6827cb3-ff16-443e-a2c7-3f7f826de329" />

.
<img width="1892" height="855" alt="Screenshot 2026-03-10 140230" src="https://github.com/user-attachments/assets/0c6539ba-f60e-4b34-ad37-1c0162bda9cc" />
.
<img width="1884" height="375" alt="Screenshot 2026-03-10 140406" src="https://github.com/user-attachments/assets/b4318ae2-23e3-41d6-a0b7-8c1082e6cc64" />


## 🛠️ Tech Stack
* **Language:** Python 3.x
* **Machine Learning:** Scikit-Learn (Isolation Forest)
* **Data Manipulation:** Pandas, NumPy
* **Model Serialization:** Joblib / Pickle

## ⚙️ Local Setup & Installation

### 1. Clone the Repository
```Bash
git clone [https://github.com/Akash-yadavv/NetGuard-AI.git](https://github.com/Akash-yadavv/NetGuard-AI.git)
cd NetGuard-AI
```
2. Install Dependencies
Ensure you have Python installed, then install the required libraries:

```Bash
pip install -r requirements.txt
```

##📊 How to Run the Project
Note: For security and storage optimization, the raw dataset (train_data.csv) and the compiled model (cyber_model.pkl) are not hosted in this repository.

Step 1: Add Your Dataset
Place your network traffic dataset in the root directory and name it train_data.csv.

Step 2: Train the Model
Run the training script to generate the machine learning model. This will read the CSV and output a cyber_model.pkl file.

```Bash
python train_model.py
```

Step 3: Run the Detection System
Once the .pkl file is generated, launch the main application to start detecting anomalies.

```Bash
python main.py
```

###👨‍💻 Author
Akash Yadav

GitHub: @Akash-yadavv
