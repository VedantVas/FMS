import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as flightService from '../services/flightService';
import * as airportService from '../services/airportService';
import * as passengerService from '../services/passengerService';
import * as bookingService from '../services/bookingService';

export default function Dashboard() {
  const [counts, setCounts] = useState({
    flights: 0,
    airports: 0,
    passengers: 0,
    bookings: 0,
  });
  const [recentFlights, setRecentFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [fRes, aRes, pRes, bRes] = await Promise.all([
          flightService.getFlights(),
          airportService.getAirports(),
          passengerService.getPassengers(),
          bookingService.getBookings(),
        ]);
        setCounts({
          flights: fRes.data.length,
          airports: aRes.data.length,
          passengers: pRes.data.length,
          bookings: bRes.data.length,
        });
        setRecentFlights(fRes.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="container py-4">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-light text-primary px-3 py-2 rounded-pill fw-bold text-uppercase mb-3">
              <i className="bi bi-shield-check me-1"></i> FMS Enterprise Platform
            </span>
            <h1 className="fw-extrabold display-5 mb-2">Flight Management System</h1>
            <p className="lead opacity-90 mb-4" style={{ maxWidth: '650px' }}>
              Full-stack airline operations hub built with React, Node.js/Express REST API, and Prisma ORM.
              Manage your carrier fleet, airport routes, schedules, passenger manifests, and reservations cleanly.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/flights" className="btn btn-light text-primary fw-semibold px-4 py-2 shadow-sm">
                <i className="bi bi-airplane-fill me-2"></i> Manage Flights
              </Link>
              <Link to="/bookings" className="btn btn-outline-light fw-semibold px-4 py-2">
                <i className="bi bi-ticket-perforated me-2"></i> New Booking
              </Link>
            </div>
          </div>
          <div className="col-lg-4 text-center d-none d-lg-block">
            <i className="bi bi-globe-americas display-1 opacity-75"></i>
          </div>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="stat-card shadow-sm">
            <div className="stat-icon flights">
              <i className="bi bi-airplane"></i>
            </div>
            <div>
              <div className="text-secondary small fw-semibold">FLEET FLIGHTS</div>
              <h3 className="fw-bold mb-0 text-dark">{loading ? '...' : counts.flights}</h3>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="stat-card shadow-sm">
            <div className="stat-icon airports">
              <i className="bi bi-geo-alt"></i>
            </div>
            <div>
              <div className="text-secondary small fw-semibold">AIRPORT HUBS</div>
              <h3 className="fw-bold mb-0 text-dark">{loading ? '...' : counts.airports}</h3>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="stat-card shadow-sm">
            <div className="stat-icon passengers">
              <i className="bi bi-people"></i>
            </div>
            <div>
              <div className="text-secondary small fw-semibold">PASSENGERS</div>
              <h3 className="fw-bold mb-0 text-dark">{loading ? '...' : counts.passengers}</h3>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="stat-card shadow-sm">
            <div className="stat-icon bookings">
              <i className="bi bi-ticket-perforated"></i>
            </div>
            <div>
              <div className="text-secondary small fw-semibold">ACTIVE BOOKINGS</div>
              <h3 className="fw-bold mb-0 text-dark">{loading ? '...' : counts.bookings}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Sections */}
      <div className="row g-4">
        {/* Recent Flights Table */}
        <div className="col-lg-7">
          <div className="card fms-card border-0 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-dark">
                <i className="bi bi-airplane-engines me-2 text-primary"></i> Active Fleet Overview
              </h5>
              <Link to="/flights" className="btn btn-sm btn-link text-decoration-none">
                View all flights <i className="bi bi-chevron-right"></i>
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Flight No.</th>
                    <th>Carrier</th>
                    <th>Model</th>
                    <th>Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {recentFlights.map((flight) => (
                    <tr key={flight.id}>
                      <td className="fw-bold font-monospace text-primary">{flight.flightNumber}</td>
                      <td>{flight.carrierName}</td>
                      <td>{flight.flightModel}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {flight.seatCapacity} seats
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Architecture Info Card */}
        <div className="col-lg-5">
          <div className="card fms-card border-0 p-4 h-100 bg-white">
            <h5 className="fw-bold mb-3 text-dark">
              <i className="bi bi-layers-fill text-info me-2"></i> Clean Architecture Stack
            </h5>
            <p className="text-secondary small mb-3">
              Strictly decoupled, enterprise multi-tier architecture in active operation:
            </p>

            <ul className="list-group list-group-flush small">
              <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                <span><i className="bi bi-browser-chrome text-primary me-2"></i><strong>Frontend</strong></span>
                <span className="badge bg-primary-subtle text-primary-emphasis">React 18 + Vite + Bootstrap</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                <span><i className="bi bi-arrow-left-right text-success me-2"></i><strong>API Layer</strong></span>
                <span className="badge bg-success-subtle text-success-emphasis">Axios HTTP Client</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                <span><i className="bi bi-hdd-network text-warning me-2"></i><strong>Backend</strong></span>
                <span className="badge bg-warning-subtle text-warning-emphasis">Node.js + Express.js</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                <span><i className="bi bi-diagram-3 text-info me-2"></i><strong>Pattern</strong></span>
                <span className="badge bg-info-subtle text-info-emphasis">Routes → Controllers → Services</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                <span><i className="bi bi-database text-danger me-2"></i><strong>ORM & Database</strong></span>
                <span className="badge bg-danger-subtle text-danger-emphasis">Prisma ORM (MySQL / SQLite)</span>
              </li>
            </ul>

            <div className="mt-4 pt-2 border-top text-center">
              <span className="text-success small fw-semibold">
                <i className="bi bi-check2-circle me-1"></i> REST API endpoints live on port 5000
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
