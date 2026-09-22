import React, { useState, useEffect } from 'react';

export default function PassengerModal({ isOpen, onClose, onSave, passenger }) {
  const [formData, setFormData] = useState({
    pnrNumber: '',
    passengerName: '',
    passengerAge: '',
    passengerUIN: '',
    luggage: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (passenger) {
      setFormData({
        pnrNumber: passenger.pnrNumber || '',
        passengerName: passenger.passengerName || '',
        passengerAge: passenger.passengerAge || '',
        passengerUIN: passenger.passengerUIN || '',
        luggage: passenger.luggage !== undefined ? passenger.luggage : '',
      });
    } else {
      setFormData({
        pnrNumber: '',
        passengerName: '',
        passengerAge: '',
        passengerUIN: '',
        luggage: '15.0',
      });
    }
    setError('');
  }, [passenger, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.passengerName || !formData.passengerAge || !formData.passengerUIN) {
      setError('Passenger name, age, and UIN are required.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-info text-dark py-3">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-person-fill me-2"></i>
              {passenger ? 'Edit Passenger' : 'Add Passenger'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && <div className="alert alert-danger py-2 small">{error}</div>}

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">PNR Number (Optional, auto-generated if blank)</label>
                <input
                  type="text"
                  name="pnrNumber"
                  className="form-control form-control-lg fs-6"
                  placeholder="e.g. PNR78912"
                  value={formData.pnrNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Passenger Full Name</label>
                <input
                  type="text"
                  name="passengerName"
                  className="form-control form-control-lg fs-6"
                  placeholder="e.g. Jane Doe"
                  value={formData.passengerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label fw-semibold text-secondary small">Age</label>
                  <input
                    type="number"
                    name="passengerAge"
                    className="form-control form-control-lg fs-6"
                    placeholder="e.g. 30"
                    min="1"
                    max="120"
                    value={formData.passengerAge}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold text-secondary small">Luggage (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="luggage"
                    className="form-control form-control-lg fs-6"
                    placeholder="e.g. 20.0"
                    value={formData.luggage}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary small">Passenger UIN (Passport / National ID)</label>
                <input
                  type="text"
                  name="passengerUIN"
                  className="form-control form-control-lg fs-6"
                  placeholder="e.g. US12345678"
                  value={formData.passengerUIN}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="modal-footer bg-light px-4 py-3">
              <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-info text-dark px-4 fw-semibold">
                {passenger ? 'Update Passenger' : 'Add Passenger'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
