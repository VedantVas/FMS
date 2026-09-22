import React, { useState, useEffect } from 'react';

export default function BookingModal({
  isOpen,
  onClose,
  onSave,
  passengers = [],
  scheduledFlights = [],
}) {
  const [formData, setFormData] = useState({
    passengerId: '',
    scheduledFlightId: '',
    ticketCost: 350.0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        passengerId: passengers.length > 0 ? passengers[0].id : '',
        scheduledFlightId: scheduledFlights.length > 0 ? scheduledFlights[0].id : '',
        ticketCost: 350.0,
      });
      setError('');
    }
  }, [isOpen, passengers, scheduledFlights]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.passengerId || !formData.scheduledFlightId) {
      setError('Please select both a passenger and a scheduled flight.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-dark text-white py-3">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-ticket-perforated-fill text-warning me-2"></i>
              New Flight Booking
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Select Passenger</label>
                <select
                  name="passengerId"
                  className="form-select form-select-lg fs-6"
                  value={formData.passengerId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Choose Passenger --</option>
                  {passengers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.passengerName} (PNR: {p.pnrNumber}, Age: {p.passengerAge})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Select Scheduled Flight</label>
                <select
                  name="scheduledFlightId"
                  className="form-select form-select-lg fs-6"
                  value={formData.scheduledFlightId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Choose Scheduled Flight --</option>
                  {scheduledFlights.map((sf) => (
                    <option key={sf.id} value={sf.id}>
                      {sf.flight?.carrierName} ({sf.flight?.flightNumber}) | {sf.schedule?.sourceAirport} →{' '}
                      {sf.schedule?.destinationAirport} | Seats Left: {sf.availableSeats}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Ticket Cost ($)</label>
                <input
                  type="number"
                  name="ticketCost"
                  step="0.01"
                  className="form-control form-control-lg fs-6"
                  placeholder="350.00"
                  value={formData.ticketCost}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="modal-footer bg-light px-4 py-3">
              <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-4 fw-semibold">
                Confirm & Issue Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
