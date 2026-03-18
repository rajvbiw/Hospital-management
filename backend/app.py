from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)
CORS(app)

# MongoDB Connection
mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/hospital_db")
client = MongoClient(mongo_uri)
db = client.hospital_db

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

# Patient Registration
@app.route('/api/patients', methods=['POST'])
def register_patient():
    data = request.json
    if not data or 'name' not in data:
        return jsonify({"error": "Name is required"}), 400
    
    patient_id = db.patients.insert_one(data).inserted_id
    return jsonify({"message": "Patient registered", "id": str(patient_id)}), 201

@app.route('/api/patients', methods=['GET'])
def list_patients():
    patients = list(db.patients.find({}, {"_id": 1, "name": 1, "age": 1, "gender": 1, "condition": 1}))
    for p in patients:
        p['_id'] = str(p['_id'])
    return jsonify(patients), 200

# Doctor Management
@app.route('/api/doctors', methods=['POST'])
def add_doctor():
    data = request.json
    if not data or 'name' not in data:
        return jsonify({"error": "Name is required"}), 400
    
    doctor_id = db.doctors.insert_one(data).inserted_id
    return jsonify({"message": "Doctor added", "id": str(doctor_id)}), 201

@app.route('/api/doctors', methods=['GET'])
def list_doctors():
    doctors = list(db.doctors.find({}, {"_id": 1, "name": 1, "specialty": 1, "experience": 1}))
    for d in doctors:
        d['_id'] = str(d['_id'])
    return jsonify(doctors), 200

# Appointment Booking
@app.route('/api/appointments', methods=['POST'])
def book_appointment():
    data = request.json
    required = ['patient_id', 'doctor_id', 'date', 'time']
    if not all(k in data for k in required):
        return jsonify({"error": f"Missing fields: {', '.join(required)}"}), 400
    
    appointment_id = db.appointments.insert_one(data).inserted_id
    return jsonify({"message": "Appointment booked", "id": str(appointment_id)}), 201

@app.route('/api/appointments', methods=['GET'])
def list_appointments():
    appointments = list(db.appointments.find())
    for a in appointments:
        a['_id'] = str(a['_id'])
    return jsonify(appointments), 200

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
