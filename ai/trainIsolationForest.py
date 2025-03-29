import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

data = pd.read_json('../backend/traffic_data.json', lines=True)

features = ['delay', 'timeOfDay', 'dayOfWeek']  # Match JSON field names
X = data[features].values

model = IsolationForest(contamination=0.1, random_state=42)
model.fit(X)

joblib.dump(model, 'isolation_forest.pkl')
print("Isolation Forest model trained and saved.")