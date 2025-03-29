import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
import joblib

# Load data
data = pd.read_json('../backend/traffic_data.json', lines=True)

# Feature engineering
data['timestamp'] = pd.to_datetime(data['timestamp'])
data['timeOfDay'] = data['timestamp'].dt.hour  # Rename 'hour' to match JSON

# Encode categorical variables
weather_encoder = LabelEncoder()
concerts_encoder = LabelEncoder()
strikes_encoder = LabelEncoder()
events_encoder = LabelEncoder()
start_encoder = LabelEncoder()
end_encoder = LabelEncoder()

data['weather'] = weather_encoder.fit_transform(data['weather'])
data['concerts'] = concerts_encoder.fit_transform(data['concerts'])
data['strikes'] = strikes_encoder.fit_transform(data['strikes'])
data['otherEvents'] = events_encoder.fit_transform(data['otherEvents'])
data['start'] = start_encoder.fit_transform(data['route'].apply(lambda x: x['start']))
data['end'] = end_encoder.fit_transform(data['route'].apply(lambda x: x['end']))

# Prepare features and target
features = ['timeOfDay', 'dayOfWeek', 'weather', 'accidents', 'concerts', 'strikes', 'otherEvents', 'start', 'end']
X = data[features].values
y = data['delay'].shift(-1).values

X = X[:-1]
y = y[:-1]

scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)
joblib.dump(scaler, 'scaler.pkl')

sequence_length = 4
X_seq, y_seq = [], []
for i in range(len(X_scaled) - sequence_length):
    X_seq.append(X_scaled[i:i + sequence_length])
    y_seq.append(y[i + sequence_length])
X_seq = np.array(X_seq)
y_seq = np.array(y_seq)

train_size = int(len(X_seq) * 0.8)
X_train, X_test = X_seq[:train_size], X_seq[train_size:]
y_train, y_test = y_seq[:train_size], y_seq[train_size:]

model = Sequential([
    LSTM(50, activation='relu', input_shape=(sequence_length, len(features)), return_sequences=True),
    LSTM(50, activation='relu'),
    Dense(1)
])
model.compile(optimizer='adam', loss='mse')
model.fit(X_train, y_train, epochs=50, batch_size=32, validation_data=(X_test, y_test))

model.save('lstm_model.h5')

# Save encoders
joblib.dump({
    'weather': weather_encoder, 'concerts': concerts_encoder, 'strikes': strikes_encoder,
    'events': events_encoder, 'start': start_encoder, 'end': end_encoder
}, 'encoders.pkl')

print("LSTM model trained and saved.")