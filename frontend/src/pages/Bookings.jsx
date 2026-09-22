import React, { useState, useEffect } from 'react';
import * as bookingService from '../services/bookingService';
import * as passengerService from '../services/passengerService';
import * as scheduledFlightService from '../services/scheduledFlightService';
import BookingModal from '../components/BookingModal';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [scheduledFlights, setScheduledFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bRes, pRes, sfRes] = await Promise.all([
        bookingService.getBookings(),
        passengerService.getPassengers(),
        scheduledFlightService.getScheduledFlights(),
      ]);
      setBookings(bRes.data);
      setPassengers(pRes.data);
      setScheduledFlights(sfRes.data);
    } catch (err) {
      setError('Failed to fetch bookings data.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleOpenAdd = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async (id, pName) => {
    if (window.confirm(`Cancel ticket reservation for ${pName}?`)) {
      try {
        await bookingService.deleteBooking(id);
        setBookings(bookings.filter((b) => b.id !== id));
        showNotification(`Booking cancelled and seat released.`);
      } catch (err) {
        alert('Failed to cancel booking: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleSaveBooking = async (formData) => {
    try {
      const res = await bookingService.createBooking(formData);
      setBookings([res.data, ...bookings]);
      showNotification('Flight ticket reserved and confirmed successfully!');
      setIsModalOpen(false);
      // Refresh scheduled flights to get updated seat counts
      const sfRes = await scheduledFlightService.getScheduledFlights();
      setScheduledFlights(sfRes.data);
    } catch (err) {
      alert('Booking error: ' + (err.response?.data?.message || err.message));
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
            <i className="bi bi-ticket-perforated text-danger"></i> Flight Reservations & Bookings
          </h2>
          <p className="text-secondary mb-0">Issue flight tickets, view passenger manifests, and manage seat reservations.</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm" onClick={handleOpenAdd}>
          <i className="bi bi-plus-circle-fill"></i> New Booking
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
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <div>Loading bookings...</div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <h5>No bookings issued yet</h5>
            <button className="btn btn-sm btn-outline-primary mt-2" onClick={handleOpenAdd}>
              Book First Flight Ticket
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Passenger</th>
                  <th>PNR</th>
                  <th>Flight / Carrier</th>
                  <th>Route</th>
                  <th>Departure Time</th>
                  <th>Fare</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span className="fw-bold font-monospace bg-light border px-2 py-1 rounded">
                        #BK-{b.id.toString().padStart(4, '0')}
                      </span>
                    </td>
                    <td className="fw-semibold text-dark">{b.passenger?.passengerName}</td>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary-emphasis font-monospace">
                        {b.passenger?.pnrNumber}
                      </span>
                    </td>
                    <td>
                      <div className="fw-medium text-primary">
                        {b.scheduledFlight?.flight?.carrierName}
                      </div>
                      <small className="text-muted">{b.scheduledFlight?.flight?.flightNumber}</small>
                    </td>
                    <td>
                      <span className="badge bg-primary me-1">{b.scheduledFlight?.schedule?.sourceAirport}</span>
                      <i className="bi bi-arrow-right text-muted small"></i>
                      <span className="badge bg-success ms-1">{b.scheduledFlight?.schedule?.destinationAirport}</span>
                    </td>
                    <td className="small text-secondary">{formatDate(b.scheduledFlight?.schedule?.departureTime)}</td>
                    <td>
                      <span className="fw-bold text-success">${b.ticketCost.toFixed(2)}</span>
                    </td>
                    <td className="text-end pe-4">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger action-btn"
                        onClick={() => handleDelete(b.id, b.passenger?.passengerName)}
                        title="Cancel Booking"
                      >
                        <i className="bi bi-x-circle"></i> Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBooking}
        passengers={passengers}
        scheduledFlights={scheduledFlights}
      />
    </div>
  );
}
