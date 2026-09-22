import React, { useState, useEffect } from 'react';
import * as passengerService from '../services/passengerService';
import PassengerModal from '../components/PassengerModal';

export default function Passengers() {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState(null);

  useEffect(() => {
    fetchPassengers();
  }, []);

  const fetchPassengers = async () => {
    try {
      setLoading(true);
      const res = await passengerService.getPassengers();
      setPassengers(res.data);
    } catch (err) {
      setError('Failed to fetch passengers.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleOpenAdd = () => {
    setEditingPassenger(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPassenger(p);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete passenger record for ${name}?`)) {
      try {
        await passengerService.deletePassenger(id);
        setPassengers(passengers.filter((p) => p.id !== id));
        showNotification(`Passenger ${name} removed.`);
      } catch (err) {
        alert('Failed to delete passenger: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleSavePassenger = async (formData) => {
    try {
      if (editingPassenger) {
        const res = await passengerService.updatePassenger(editingPassenger.id, formData);
        setPassengers(passengers.map((p) => (p.id === editingPassenger.id ? res.data : p)));
        showNotification(`Passenger ${formData.passengerName} updated.`);
      } else {
        const res = await passengerService.createPassenger(formData);
        setPassengers([res.data, ...passengers]);
        showNotification(`Passenger ${formData.passengerName} registered.`);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving passenger: ' + (err.response?.data?.message || err.message));
    }
  };

  const filtered = passengers.filter(
    (p) =>
      p.passengerName.toLowerCase().includes(search.toLowerCase()) ||
      p.pnrNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.passengerUIN.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
            <i className="bi bi-people text-info"></i> Passengers
          </h2>
          <p className="text-secondary mb-0">Manage passenger registry, PNR manifests, and baggage records.</p>
        </div>
        <button className="btn btn-info text-dark d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm" onClick={handleOpenAdd}>
          <i className="bi bi-person-plus-fill"></i> Add Passenger
        </button>
      </div>

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2 shadow-sm" role="alert">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <div>{successMsg}</div>
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill fs-5"></i>
          <div>{error}</div>
        </div>
      )}

      <div className="card fms-card border-0 mb-4 p-3">
        <div className="input-group" style={{ maxWidth: '400px' }}>
          <span className="input-group-text bg-light border-end-0">
            <i className="bi bi-search text-secondary"></i>
          </span>
          <input
            type="text"
            className="form-control bg-light border-start-0 ps-0"
            placeholder="Search by Name, PNR, or UIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card fms-card border-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-5 text-secondary">
            <div className="spinner-border text-info mb-3" role="status"></div>
            <div>Loading passenger registry...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <h5>No passengers registered yet</h5>
            <button className="btn btn-sm btn-outline-info text-dark mt-2" onClick={handleOpenAdd}>
              Register Passenger
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>PNR</th>
                  <th>Passenger Name</th>
                  <th>Age</th>
                  <th>UIN (ID / Passport)</th>
                  <th>Luggage Allowance</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className="fw-bold font-monospace bg-info-subtle text-info-emphasis px-2 py-1 rounded">
                        {p.pnrNumber}
                      </span>
                    </td>
                    <td className="fw-semibold text-dark">{p.passengerName}</td>
                    <td>{p.passengerAge} yrs</td>
                    <td className="text-secondary font-monospace small">{p.passengerUIN}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        <i className="bi bi-suitcase-2 me-1 text-primary"></i>
                        {p.luggage} kg
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="btn-group shadow-sm">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-info text-dark action-btn"
                          onClick={() => handleOpenEdit(p)}
                        >
                          <i className="bi bi-pencil-square"></i> Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger action-btn"
                          onClick={() => handleDelete(p.id, p.passengerName)}
                        >
                          <i className="bi bi-trash3"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PassengerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePassenger}
        passenger={editingPassenger}
      />
    </div>
  );
}
