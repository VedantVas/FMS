import React, { useState, useEffect } from 'react';
import * as scheduledFlightService from '../services/scheduledFlightService';
import * as flightService from '../services/flightService';
import * as scheduleService from '../services/scheduleService';

export default function ScheduledFlights() {
  const [scheduledFlights, setScheduledFlights] = useState([]);
  const [flights, setFlights] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    flightId: '',
    scheduleId: '',
    availableSeats: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sfRes, fRes, sRes] = await Promise.all([
        scheduledFlightService.getScheduledFlights(),
        flightService.getFlights(),
        scheduleService.getSchedules(),
      ]);
      setScheduledFlights(sfRes.data);
      setFlights(fRes.data);
      setSchedules(sRes.data);
    } catch (err) {
      setError('Failed to load scheduled flights data.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleOpenAdd = () => {
    setFormData({
      flightId: flights.length > 0 ? flights[0].id : '',
      scheduleId: schedules.length > 0 ? schedules[0].id : '',
      availableSeats: flights.length > 0 ? flights[0].seatCapacity : '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this scheduled flight assignment?')) {
      try {
        await scheduledFlightService.deleteScheduledFlight(id);
        setScheduledFlights(scheduledFlights.filter((sf) => sf.id !== id));
        showNotification('Scheduled flight removed.');
      } catch (err) {
        alert('Failed to delete scheduled flight: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await scheduledFlightService.createScheduledFlight(formData);
      setScheduledFlights([res.data, ...scheduledFlights]);
      showNotification('Flight scheduled successfully!');
      setIsModalOpen(false);
    } catch (err) {
      alert('Error scheduling flight: ' + (err.response?.data?.message || err.message));
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
            <i className="bi bi-clock-history text-secondary"></i> Scheduled Flights
          </h2>
          <p className="text-secondary mb-0">Assign physical aircraft to schedule routes and track seat availability.</p>
        </div>
        <button className="btn btn-dark d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm" onClick={handleOpenAdd}>
          <i className="bi bi-calendar-plus-fill text-warning"></i> Assign Flight to Schedule
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

      <div className="card fms-card border-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-5 text-secondary">
            <div className="spinner-border text-dark mb-3" role="status"></div>
            <div>Loading scheduled flights...</div>
          </div>
        ) : scheduledFlights.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <h5>No scheduled flights active</h5>
            <button className="btn btn-sm btn-outline-dark mt-2" onClick={handleOpenAdd}>
              Schedule an Aircraft
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Flight</th>
                  <th>Aircraft Model</th>
                  <th>Route</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Available Seats</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {scheduledFlights.map((sf) => (
                  <tr key={sf.id}>
                    <td>
                      <span className="fw-bold font-monospace bg-light border px-2 py-1 rounded text-primary">
                        {sf.flight?.flightNumber}
                      </span>
                      <div className="small text-muted">{sf.flight?.carrierName}</div>
                    </td>
                    <td className="fw-medium">{sf.flight?.flightModel}</td>
                    <td>
                      <span className="badge bg-primary me-1">{sf.schedule?.sourceAirport}</span>
                      <i className="bi bi-arrow-right text-muted small"></i>
                      <span className="badge bg-success ms-1">{sf.schedule?.destinationAirport}</span>
                    </td>
                    <td className="small text-secondary">{formatDate(sf.schedule?.departureTime)}</td>
                    <td className="small text-secondary">{formatDate(sf.schedule?.arrivalTime)}</td>
                    <td>
                      <span className={`badge ${sf.availableSeats > 20 ? 'bg-success-subtle text-success-emphasis' : 'bg-danger-subtle text-danger-emphasis'} px-2 py-1 rounded-pill`}>
                        {sf.availableSeats} / {sf.flight?.seatCapacity} left
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger action-btn"
                        onClick={() => handleDelete(sf.id)}
                      >
                        <i className="bi bi-trash3"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white py-3">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-calendar-check me-2 text-warning"></i>
                  Schedule an Aircraft
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary small">Select Flight / Aircraft</label>
                    <select
                      className="form-select"
                      value={formData.flightId}
                      onChange={(e) => {
                        const selFlight = flights.find((f) => f.id === parseInt(e.target.value));
                        setFormData({
                          ...formData,
                          flightId: e.target.value,
                          availableSeats: selFlight ? selFlight.seatCapacity : '',
                        });
                      }}
                      required
                    >
                      <option value="">-- Select Flight --</option>
                      {flights.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.carrierName} ({f.flightNumber}) - {f.flightModel} (Capacity: {f.seatCapacity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary small">Select Timetable Schedule Route</label>
                    <select
                      className="form-select"
                      value={formData.scheduleId}
                      onChange={(e) => setFormData({ ...formData, scheduleId: e.target.value })}
                      required
                    >
                      <option value="">-- Select Schedule Route --</option>
                      {schedules.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.sourceAirport} → {s.destinationAirport} ({formatDate(s.departureTime)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary small">Initial Available Seats</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.availableSeats}
                      onChange={(e) => setFormData({ ...formData, availableSeats: e.target.value })}
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary fw-semibold px-4">
                    Confirm Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
