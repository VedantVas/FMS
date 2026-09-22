import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Flights from './pages/Flights';
import Airports from './pages/Airports';
import Passengers from './pages/Passengers';
import Schedules from './pages/Schedules';
import ScheduledFlights from './pages/ScheduledFlights';
import Bookings from './pages/Bookings';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column bg-light">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/airports" element={<Airports />} />
            <Route path="/passengers" element={<Passengers />} />
            <Route path="/schedules" element={<Schedules />} />
            <Route path="/scheduled-flights" element={<ScheduledFlights />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="bg-white border-top py-3 text-center text-muted small mt-5">
          <div className="container">
            <span>Flight Management System (FMS) • React • Node.js • Express • Prisma</span>
          </div>
        </footer>
      </div>
    </Router>
  );
}
