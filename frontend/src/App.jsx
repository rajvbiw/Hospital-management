import { useState, useEffect } from 'react'
import './index.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Icons
const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
)

const StethoscopeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path><circle cx="20" cy="10" r="2"></circle></svg>
)

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
)

function App() {
  const [activeTab, setActiveTab] = useState('patients')
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: '', condition: '' })
  const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '', experience: '' })
  const [newAppt, setNewAppt] = useState({ patient_id: '', doctor_id: '', date: '', time: '' })

  const fetchData = async () => {
    try {
      const [pRes, dRes, aRes] = await Promise.all([
        fetch(`${API_BASE}/patients`),
        fetch(`${API_BASE}/doctors`),
        fetch(`${API_BASE}/appointments`)
      ])
      setPatients(await pRes.json())
      setDoctors(await dRes.json())
      setAppointments(await aRes.json())
    } catch (err) {
      console.error("Failed to fetch data. Ensure backend is running.", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handlePatientSubmit = async (e) => {
    e.preventDefault()
    await fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPatient)
    })
    setNewPatient({ name: '', age: '', gender: '', condition: '' })
    fetchData()
  }

  const handleDoctorSubmit = async (e) => {
    e.preventDefault()
    await fetch(`${API_BASE}/doctors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDoctor)
    })
    setNewDoctor({ name: '', specialty: '', experience: '' })
    fetchData()
  }

  const handleApptSubmit = async (e) => {
    e.preventDefault()
    await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAppt)
    })
    setNewAppt({ patient_id: '', doctor_id: '', date: '', time: '' })
    fetchData()
  }

  return (
    <div className="container">
      <header>
        <h1>
          <StethoscopeIcon />
          MedSync
        </h1>
        <span className="badge">● Live System</span>
      </header>

      {/* Tab Navigation */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            <UsersIcon /> Patients
          </button>
          <button 
            className={`tab ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            <StethoscopeIcon /> Doctors
          </button>
          <button 
            className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <CalendarIcon /> Appointments
          </button>
        </div>
      </div>

      <div className="tab-content">
        {/* Patients Section */}
        {activeTab === 'patients' && (
          <div className="card">
            <h2><UsersIcon /> Patient Register</h2>
            <form onSubmit={handlePatientSubmit}>
              <div className="input-group">
                <input placeholder="Full Name" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} required />
              </div>
              <div className="grid-2">
                <div className="input-group">
                  <input placeholder="Age" type="number" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} required />
                </div>
                <div className="input-group">
                  <select value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})} required>
                    <option value="" disabled>Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <input placeholder="Diagnosis / Condition" value={newPatient.condition} onChange={e => setNewPatient({...newPatient, condition: e.target.value})} required />
              </div>
              <button type="submit" className="submit-btn">Onboard Patient</button>
            </form>
            <div className="list">
              {patients.map(p => (
                <div key={p._id} className="list-item">
                  <span>{p.name} ({p.age})</span>
                  <span>{p.condition}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctors Section */}
        {activeTab === 'doctors' && (
          <div className="card">
            <h2><StethoscopeIcon /> Staff Directory</h2>
            <form onSubmit={handleDoctorSubmit}>
              <div className="input-group">
                <input placeholder="Doctor Name" value={newDoctor.name} onChange={e => setNewDoctor({...newDoctor, name: e.target.value})} required />
              </div>
              <div className="grid-2">
                <div className="input-group">
                  <input placeholder="Specialization (e.g. Cardiology)" value={newDoctor.specialty} onChange={e => setNewDoctor({...newDoctor, specialty: e.target.value})} required />
                </div>
                <div className="input-group">
                  <input placeholder="Years of Experience" type="number" value={newDoctor.experience} onChange={e => setNewDoctor({...newDoctor, experience: e.target.value})} required />
                </div>
              </div>
              <button type="submit" className="submit-btn">Add Doctor</button>
            </form>
            <div className="list">
              {doctors.map(d => (
                <div key={d._id} className="list-item">
                  <span>Dr. {d.name}</span>
                  <span>{d.specialty}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Section */}
        {activeTab === 'appointments' && (
          <div className="card">
            <h2><CalendarIcon /> Appointments</h2>
            <form onSubmit={handleApptSubmit}>
              <div className="grid-2">
                <div className="input-group">
                  <select value={newAppt.patient_id} onChange={e => setNewAppt({...newAppt, patient_id: e.target.value})} required>
                    <option value="" disabled>Select Patient</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <select value={newAppt.doctor_id} onChange={e => setNewAppt({...newAppt, doctor_id: e.target.value})} required>
                    <option value="" disabled>Select Doctor</option>
                    {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid-2">
                <div className="input-group">
                  <input type="date" value={newAppt.date} onChange={e => setNewAppt({...newAppt, date: e.target.value})} required />
                </div>
                <div className="input-group">
                  <input type="time" value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})} required />
                </div>
              </div>
              <button type="submit" className="submit-btn">Schedule Appointment</button>
            </form>
            <div className="list">
              {appointments.map(a => {
                const p = patients.find(pat => pat._id === a.patient_id)
                const d = doctors.find(doc => doc._id === a.doctor_id)
                return (
                  <div key={a._id} className="list-item">
                    <span>{p?.name || 'Unknown'} with Dr. {d?.name || 'Unknown'}</span>
                    <span>{a.date} @ {a.time}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
