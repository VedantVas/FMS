import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3 shadow-sm mb-4" style={{ backgroundColor: '#0f172a' }}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <i className="bi bi-airplane-engines-fill text-info fs-4"></i>
          <span className="fw-bold tracking-tight">FlightMS</span>
          <span className="brand-badge ms-1">Enterprise FMS</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#fmsNavbar"
          aria-controls="fmsNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="fmsNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'active' : ''}`} to="/">
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'active' : ''}`} to="/flights">
                <i className="bi bi-airplane me-1"></i> Flights
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'active' : ''}`} to="/airports">
                <i className="bi bi-geo-alt me-1"></i> Airports
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'active' : ''}`} to="/passengers">
                <i className="bi bi-people me-1"></i> Passengers
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'active' : ''}`} to="/schedules">
                <i className="bi bi-calendar3 me-1"></i> Schedules
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'active' : ''}`} to="/scheduled-flights">
                <i className="bi bi-clock-history me-1"></i> Scheduled Flights
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'active' : ''}`} to="/bookings">
                <i className="bi bi-ticket-perforated me-1"></i> Bookings
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center text-white-50 small gap-3">
            <span className="d-none d-md-inline">
              <i className="bi bi-check-circle-fill text-success me-1"></i>
              API: <strong className="text-white">Node / Prisma</strong>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
