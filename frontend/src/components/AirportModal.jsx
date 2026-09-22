import React, { useState, useEffect } from 'react';

export default function AirportModal({ isOpen, onClose, onSave, airport }) {
  const [formData, setFormData] = useState({
    airportCode: '',
    airportName: '',
    airportLocation: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (airport) {
      setFormData({
        airportCode: airport.airportCode || '',
        airportName: airport.airportName || '',
        airportLocation: airport.airportLocation || '',
      });
    } else {
      setFormData({
        airportCode: '',
        airportName: '',
        airportLocation: '',
      });
    }
    setError('');
  }, [airport, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.airportCode || !formData.airportName || !formData.airportLocation) {
      setError('All fields are required.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-success text-white py-3">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-geo-alt-fill me-2"></i>
              {airport ? 'Edit Airport' : 'Add Airport'}
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
                <label className="form-label fw-semibold text-secondary small">Airport Code (IATA)</label>
                <input
                  type="text"
                  name="airportCode"
                  className="form-control form-control-lg fs-6 text-uppercase"
                  placeholder="e.g. JFK, LAX, DEL"
                  maxLength="5"
                  value={formData.airportCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Airport Name</label>
                <input
                  type="text"
                  name="airportName"
                  className="form-control form-control-lg fs-6"
                  placeholder="e.g. John F. Kennedy International Airport"
                  value={formData.airportName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Location</label>
                <input
                  type="text"
                  name="airportLocation"
                  className="form-control form-control-lg fs-6"
                  placeholder="e.g. New York, USA"
                  value={formData.airportLocation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="modal-footer bg-light px-4 py-3">
              <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success px-4 fw-semibold">
                {airport ? 'Update Airport' : 'Create Airport'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
