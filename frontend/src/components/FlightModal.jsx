import React, { useState, useEffect } from 'react';

export default function FlightModal({ isOpen, onClose, onSave, flight }) {
  const [formData, setFormData] = useState({
    flightNumber: '',
    carrierName: '',
    flightModel: '',
    seatCapacity: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (flight) {
      setFormData({
        flightNumber: flight.flightNumber || '',
        carrierName: flight.carrierName || '',
        flightModel: flight.flightModel || '',
        seatCapacity: flight.seatCapacity || '',
      });
    } else {
      setFormData({
        flightNumber: '',
        carrierName: '',
        flightModel: '',
        seatCapacity: '',
      });
    }
    setError('');
  }, [flight, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.flightNumber || !formData.carrierName || !formData.flightModel || !formData.seatCapacity) {
      setError('All fields are required.');
      return;
    }
    if (parseInt(formData.seatCapacity) <= 0) {
      setError('Seat capacity must be greater than zero.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-primary text-white py-3">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-airplane-fill me-2"></i>
              {flight ? 'Edit Flight' : 'Add Flight'}
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
                <label className="form-label fw-semibold text-secondary small">Flight No.</label>
                <input
                  type="text"
                  name="flightNumber"
                  className="form-control form-control-lg fs-6"
                  placeholder="e.g. DL-102 or 12345"
                  value={formData.flightNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Carrier Name</label>
                <input
                  type="text"
                  name="carrierName"
                  className="form-control form-control-lg fs-6"
                  placeholder="e.g. Delta Airlines, United Airlines"
                  value={formData.carrierName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Flight Model</label>
                <input
                  type="text"
                  name="flightModel"
                  className="form-control form-control-lg fs-6"
                  placeholder="e.g. Boeing 737, Airbus A320"
                  value={formData.flightModel}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Seat Capacity</label>
                <input
                  type="number"
                  name="seatCapacity"
                  className="form-control form-control-lg fs-6"
                  placeholder="e.g. 200"
                  min="1"
                  value={formData.seatCapacity}
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
                {flight ? 'Update Flight' : 'Create Flight'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
