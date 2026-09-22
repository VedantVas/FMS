import React, { useState, useEffect } from 'react';
import * as airportService from '../services/airportService';
import AirportModal from '../components/AirportModal';

export default function Airports() {
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAirport, setEditingAirport] = useState(null);

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      setLoading(true);
      const res = await airportService.getAirports();
      setAirports(res.data);
    } catch (err) {
      setError('Failed to fetch airport records');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleOpenAdd = () => {
    setEditingAirport(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (airport) => {
    setEditingAirport(airport);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`Delete Airport [${code}]?`)) {
      try {
        await airportService.deleteAirport(id);
        setAirports(airports.filter((a) => a.id !== id));
        showNotification(`Airport ${code} deleted.`);
      } catch (err) {
        alert('Failed to delete airport: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleSaveAirport = async (formData) => {
    try {
      if (editingAirport) {
        const res = await airportService.updateAirport(editingAirport.id, formData);
        setAirports(airports.map((a) => (a.id === editingAirport.id ? res.data : a)));
        showNotification(`Airport ${formData.airportCode} updated successfully.`);
      } else {
        const res = await airportService.createAirport(formData);
        setAirports([...airports, res.data]);
        showNotification(`Airport ${formData.airportCode} created successfully.`);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving airport: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredAirports = airports.filter(
    (a) =>
      a.airportCode.toLowerCase().includes(search.toLowerCase()) ||
      a.airportName.toLowerCase().includes(search.toLowerCase()) ||
      a.airportLocation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
            <i className="bi bi-geo-alt text-success"></i> Airports
          </h2>
          <p className="text-secondary mb-0">Manage global hub airports, IATA codes, and station locations.</p>
        </div>
        <button className="btn btn-success d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm" onClick={handleOpenAdd}>
          <i className="bi bi-plus-circle-fill"></i> Add Airport
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
            placeholder="Search code, name, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card fms-card border-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-5 text-secondary">
            <div className="spinner-border text-success mb-3" role="status"></div>
            <div>Loading airport hubs...</div>
          </div>
        ) : filteredAirports.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <h5>No airports found</h5>
            <button className="btn btn-sm btn-outline-success mt-2" onClick={handleOpenAdd}>
              Add Airport
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>IATA Code</th>
                  <th>Airport Name</th>
                  <th>Location</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAirports.map((airport) => (
                  <tr key={airport.id}>
                    <td>
                      <span className="badge bg-dark-subtle text-dark fs-6 px-2 py-1 font-monospace">
                        {airport.airportCode}
                      </span>
                    </td>
                    <td className="fw-semibold text-dark">{airport.airportName}</td>
                    <td className="text-secondary">
                      <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                      {airport.airportLocation}
                    </td>
                    <td className="text-end pe-4">
                      <div className="btn-group shadow-sm">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success action-btn"
                          onClick={() => handleOpenEdit(airport)}
                        >
                          <i className="bi bi-pencil-square"></i> Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger action-btn"
                          onClick={() => handleDelete(airport.id, airport.airportCode)}
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

      <AirportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAirport}
        airport={editingAirport}
      />
    </div>
  );
}
