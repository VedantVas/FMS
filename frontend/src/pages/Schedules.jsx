import React, { useState, useEffect } from 'react';
import * as scheduleService from '../services/scheduleService';
import * as airportService from '../services/airportService';
import ScheduleModal from '../components/ScheduleModal';

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [airports, setAirports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schedRes, airRes] = await Promise.all([
        scheduleService.getSchedules(),
        airportService.getAirports(),
      ]);
      setSchedules(schedRes.data);
      setAirports(airRes.data);
    } catch (err) {
      setError('Failed to load schedule data.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleOpenAdd = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sched) => {
    setEditingSchedule(sched);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this timetable schedule?')) {
      try {
        await scheduleService.deleteSchedule(id);
        setSchedules(schedules.filter((s) => s.id !== id));
        showNotification('Schedule deleted successfully.');
      } catch (err) {
        alert('Failed to delete schedule: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleSaveSchedule = async (formData) => {
    try {
      if (editingSchedule) {
        const res = await scheduleService.updateSchedule(editingSchedule.id, formData);
        setSchedules(schedules.map((s) => (s.id === editingSchedule.id ? res.data : s)));
        showNotification('Schedule updated successfully.');
      } else {
        const res = await scheduleService.createSchedule(formData);
        setSchedules([res.data, ...schedules]);
        showNotification('New flight schedule route created.');
      }
      setIsModalOpen(false);
    } catch (err) {
      alert('Error saving schedule: ' + (err.response?.data?.message || err.message));
    }
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleString([], {
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
            <i className="bi bi-calendar3 text-warning"></i> Schedules & Timetable
          </h2>
          <p className="text-secondary mb-0">Define origin, destination, departure, and arrival time slots.</p>
        </div>
        <button className="btn btn-warning text-dark d-flex align-items-center gap-2 px-3 py-2 fw-semibold shadow-sm" onClick={handleOpenAdd}>
          <i className="bi bi-plus-circle-fill"></i> Add Schedule
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
            <div className="spinner-border text-warning mb-3" role="status"></div>
            <div>Loading timetable slots...</div>
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center py-5 text-secondary">
            <h5>No flight schedules configured yet</h5>
            <button className="btn btn-sm btn-outline-warning text-dark mt-2" onClick={handleOpenAdd}>
              Create First Route Schedule
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Route (Origin → Destination)</th>
                  <th>Departure Time</th>
                  <th>Arrival Time</th>
                  <th>Assigned Flights</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-primary fs-6 font-monospace">{s.sourceAirport}</span>
                        <i className="bi bi-arrow-right text-secondary"></i>
                        <span className="badge bg-success fs-6 font-monospace">{s.destinationAirport}</span>
                      </div>
                    </td>
                    <td className="text-dark fw-medium">
                      <i className="bi bi-clock me-1 text-primary"></i>
                      {formatDate(s.departureTime)}
                    </td>
                    <td className="text-dark fw-medium">
                      <i className="bi bi-clock-history me-1 text-success"></i>
                      {formatDate(s.arrivalTime)}
                    </td>
                    <td>
                      {s.scheduledFlights && s.scheduledFlights.length > 0 ? (
                        <span className="badge bg-info-subtle text-info-emphasis">
                          {s.scheduledFlights.length} flight(s) assigned
                        </span>
                      ) : (
                        <span className="badge bg-light text-muted border">None yet</span>
                      )}
                    </td>
                    <td className="text-end pe-4">
                      <div className="btn-group shadow-sm">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning text-dark action-btn"
                          onClick={() => handleOpenEdit(s)}
                        >
                          <i className="bi bi-pencil-square"></i> Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger action-btn"
                          onClick={() => handleDelete(s.id)}
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

      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSchedule}
        schedule={editingSchedule}
        airports={airports}
      />
    </div>
  );
}
