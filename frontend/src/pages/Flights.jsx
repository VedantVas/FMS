import React, { useState, useEffect } from 'react';
import * as flightService from '../services/flightService';
import FlightModal from '../components/FlightModal';

export default function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const res = await flightService.getFlights();
      setFlights(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch flights from backend server.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleOpenAdd = () => {
    setEditingFlight(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (flight) => {
    setEditingFlight(flight);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, flightNumber) => {
    if (window.confirm(`Are you sure you want to delete Flight ${flightNumber}?`)) {
      try {
        await flightService.deleteFlight(id);
        setFlights(flights.filter((f) => f.id !== id));
        showNotification(`Flight ${flightNumber} deleted successfully.`);
      } catch (err) {
        alert('Failed to delete flight: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleSaveFlight = async (formData) => {
    try {
      if (editingFlight) {
        const res = await flightService.updateFlight(editingFlight.id, formData);
        setFlights(flights.map((f) => (f.id === editingFlight.id ? res.data : f)));
        showNotification(`Flight ${formData.flightNumber} updated successfully!`);
      } else {
        const res = await flightService.createFlight(formData);
        setFlights([res.data, ...flights]);
        showNotification(`Flight ${formData.flightNumber} created successfully!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving flight: ' + (err.response?.data?.message || err.message));
    }
  };

  const getCarrierBadgeClass = (carrier) => {
    const c = carrier.toLowerCase();
    if (c.includes('delta')) return 'carrier-delta';
    if (c.includes('united')) return 'carrier-united';
    if (c.includes('american')) return 'carrier-american';
    return 'carrier-other';
  };

  const filteredFlights = flights.filter(
    (f) =>
      f.carrierName.toLowerCase().includes(search.toLowerCase()) ||
      f.flightNumber.toLowerCase().includes(search.toLowerCase()) ||
      f.flightModel.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
            <i className="bi bi-airplane text-primary"></i> Flights
          </h2>
          <p className="text-secondary mb-0">Manage fleet carriers, aircraft models, and seating capacities.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm" onClick={handleOpenAdd}>
          <i className="bi bi-plus-circle-fill"></i> Add Flight
        </button>
      </div>

      {/* Notifications */}
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

      {/* Search and Filter */}
      <div className="card fms-card border-0 mb-4 p-3">
        <div className="row g-2 align-items-center">
          <div className="col-md-6 col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-secondary"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0 ps-0"
                placeholder="Search by Carrier, Flight No., or Model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="btn btn-outline-secondary border-start-0 bg-light" onClick={() => setSearch('')}>
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col text-md-end text-secondary small">
            Total registered flights: <strong>{flights.length}</strong>
          </div>
        </div>
      </div>

      {/* Flights Table */}
      <div className="card fms-card border-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-5 text-secondary">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <div>Loading flight fleet data...</div>
          </div>
        ) : filteredFlights.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <i className="bi bi-slash-circle fs-1 mb-2 d-block text-muted"></i>
            <h5>No flights found</h5>
            <p className="small mb-3">Try adjusting your search query or add a new flight above.</p>
            <button className="btn btn-sm btn-outline-primary" onClick={handleOpenAdd}>
              <i className="bi bi-plus-lg"></i> Add First Flight
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Flight No.</th>
                  <th>Carrier Name</th>
                  <th>Flight Model</th>
                  <th>Seat Capacity</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFlights.map((flight) => (
                  <tr key={flight.id}>
                    <td>
                      <span className="fw-bold font-monospace text-primary bg-light px-2 py-1 rounded border">
                        {flight.flightNumber}
                      </span>
                    </td>
                    <td>
                      <span className={`carrier-pill ${getCarrierBadgeClass(flight.carrierName)}`}>
                        <i className="bi bi-airplane-fill"></i>
                        {flight.carrierName}
                      </span>
                    </td>
                    <td className="fw-medium text-dark">{flight.flightModel}</td>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary-emphasis px-2 py-1 rounded-pill">
                        <i className="bi bi-person-fill me-1"></i>
                        {flight.seatCapacity} seats
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="btn-group shadow-sm" role="group">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary action-btn"
                          onClick={() => handleOpenEdit(flight)}
                          title="Edit Flight"
                        >
                          <i className="bi bi-pencil-square"></i> Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger action-btn"
                          onClick={() => handleDelete(flight.id, flight.flightNumber)}
                          title="Delete Flight"
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

      {/* Add / Edit Flight Modal */}
      <FlightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFlight}
        flight={editingFlight}
      />
    </div>
  );
}
