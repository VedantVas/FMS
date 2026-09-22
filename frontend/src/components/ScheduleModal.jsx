import React, { useState, useEffect } from 'react';

export default function ScheduleModal({ isOpen, onClose, onSave, schedule, airports = [] }) {
  const [formData, setFormData] = useState({
    sourceAirport: '',
    destinationAirport: '',
    departureTime: '',
    arrivalTime: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (schedule) {
      const formatDT = (isoStr) => (isoStr ? new Date(isoStr).toISOString().slice(0, 16) : '');
      setFormData({
        sourceAirport: schedule.sourceAirport || '',
        destinationAirport: schedule.destinationAirport || '',
        departureTime: formatDT(schedule.departureTime),
        arrivalTime: formatDT(schedule.arrivalTime),
      });
    } else {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 86400000);
      const arr = new Date(tomorrow.getTime() + 4 * 3600000);
      setFormData({
        sourceAirport: airports.length > 0 ? airports[0].airportCode : 'JFK',
        destinationAirport: airports.length > 1 ? airports[1].airportCode : 'LAX',
        departureTime: tomorrow.toISOString().slice(0, 16),
        arrivalTime: arr.toISOString().slice(0, 16),
      });
    }
    setError('');
  }, [schedule, isOpen, airports]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.sourceAirport || !formData.destinationAirport || !formData.departureTime || !formData.arrivalTime) {
      setError('All fields are required.');
      return;
    }
    if (formData.sourceAirport === formData.destinationAirport) {
      setError('Source and Destination airports must be different.');
      return;
    }
    if (new Date(formData.arrivalTime) <= new Date(formData.departureTime)) {
      setError('Arrival time must be after departure time.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-warning text-dark py-3">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-calendar-event me-2"></i>
              {schedule ? 'Edit Schedule' : 'Create Flight Schedule'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold text-secondary small">Source Airport</label>
                  <input
                    type="text"
                    name="sourceAirport"
                    className="form-control form-control-lg fs-6 text-uppercase"
                    placeholder="e.g. JFK"
                    value={formData.sourceAirport}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold text-secondary small">Destination Airport</label>
                  <input
                    type="text"
                    name="destinationAirport"
                    className="form-control form-control-lg fs-6 text-uppercase"
                    placeholder="e.g. LAX"
                    value={formData.destinationAirport}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Departure Date & Time</label>
                <input
                  type="datetime-local"
                  name="departureTime"
                  className="form-control form-control-lg fs-6"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Arrival Date & Time</label>
                <input
                  type="datetime-local"
                  name="arrivalTime"
                  className="form-control form-control-lg fs-6"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="modal-footer bg-light px-4 py-3">
              <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-warning px-4 fw-semibold text-dark">
                {schedule ? 'Update Schedule' : 'Create Schedule'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
