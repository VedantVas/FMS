# Flight Management System (FMS)

A full-stack enterprise Flight Management System built with **React**, **Node.js/Express.js**, and **Prisma ORM** following a strict decoupled layered architecture:

```
React (Axios) ──► Express Routes ──► Controllers ──► Services ──► Prisma ORM ──► Database (MySQL/SQLite)
```

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 18, Vite | Component-driven Single Page Application |
| **Styling** | Bootstrap 5, Bootstrap Icons, Custom CSS | Modern aviation dashboard theme |
| **HTTP Client** | Axios | RESTful API consumer services |
| **Backend Runtime**| Node.js (ES Modules) | Scalable async server runtime |
| **Framework** | Express.js | REST API routing and middleware |
| **Architecture** | Layered Enterprise Pattern | Routes → Controllers → Services → ORM |
| **ORM** | Prisma ORM | Type-safe database queries & migrations |
| **Database** | MySQL / SQLite | Relational database storage |

---

## 📂 Project Structure

```
project/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Prisma data models (SQLite dev / MySQL ready)
│   │   ├── schema.mysql.prisma  # Drop-in schema for MySQL
│   │   └── seed.js              # Initial seed script (Delta, United, American Airlines)
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js        # PrismaClient singleton instance
│   │   ├── controllers/         # Request handling & HTTP response logic
│   │   │   ├── flightController.js
│   │   │   ├── airportController.js
│   │   │   ├── passengerController.js
│   │   │   ├── scheduleController.js
│   │   │   ├── scheduledFlightController.js
│   │   │   └── bookingController.js
│   │   ├── services/            # Pure business logic & Prisma data access
│   │   │   ├── flightService.js
│   │   │   ├── airportService.js
│   │   │   ├── passengerService.js
│   │   │   ├── scheduleService.js
│   │   │   ├── scheduledFlightService.js
│   │   │   └── bookingService.js
│   │   ├── routes/              # Express REST API routes
│   │   │   ├── flightRoutes.js
│   │   │   ├── airportRoutes.js
│   │   │   ├── passengerRoutes.js
│   │   │   ├── scheduleRoutes.js
│   │   │   ├── scheduledFlightRoutes.js
│   │   │   └── bookingRoutes.js
│   │   ├── middleware/
│   │   │   └── errorMiddleware.js
│   │   ├── app.js               # Express application initialization & middleware
│   │   └── server.js            # Server entry point (port 5000)
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI modals & navigation
│   │   │   ├── Navbar.jsx
│   │   │   ├── FlightModal.jsx
│   │   │   ├── AirportModal.jsx
│   │   │   ├── PassengerModal.jsx
│   │   │   ├── ScheduleModal.jsx
│   │   │   └── BookingModal.jsx
│   │   ├── pages/               # Main application views
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Flights.jsx      # Primary Flight CRUD interface
│   │   │   ├── Airports.jsx     # Airport hub management
│   │   │   ├── Passengers.jsx   # Passenger registry & baggage
│   │   │   ├── Schedules.jsx    # Flight timetable & route scheduler
│   │   │   ├── ScheduledFlights.jsx # Aircraft to schedule assignment
│   │   │   └── Bookings.jsx     # Ticket reservations & cancellation
│   │   ├── services/            # Axios API client modules
│   │   │   ├── flightService.js
│   │   │   ├── airportService.js
│   │   │   ├── passengerService.js
│   │   │   ├── scheduleService.js
│   │   │   ├── scheduledFlightService.js
│   │   │   └── bookingService.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Running the Application

### 1. Start the Backend Server

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
npm start
```
The backend server runs on `http://localhost:5000`.

### 2. Start the React Frontend

```bash
cd frontend
npm install
npm run dev
```
The Vite development server runs on `http://localhost:5173`.

---

## 📡 REST API Reference

### Flights (`/api/flights`)
- `GET /api/flights` - Retrieve all flights
- `GET /api/flights/:id` - Retrieve flight by ID
- `POST /api/flights` - Create a new flight (`flightNumber`, `carrierName`, `flightModel`, `seatCapacity`)
- `PUT /api/flights/:id` - Update an existing flight
- `DELETE /api/flights/:id` - Delete a flight

### Airports (`/api/airports`)
- `GET /api/airports` - List all airport hubs
- `POST /api/airports` - Register a new airport hub (`airportCode`, `airportName`, `airportLocation`)
- `PUT /api/airports/:id` - Update airport details
- `DELETE /api/airports/:id` - Delete an airport

### Passengers (`/api/passengers`)
- `GET /api/passengers` - List all registered passengers
- `POST /api/passengers` - Register passenger (`pnrNumber`, `passengerName`, `passengerAge`, `passengerUIN`, `luggage`)
- `PUT /api/passengers/:id` - Update passenger
- `DELETE /api/passengers/:id` - Delete passenger

### Schedules (`/api/schedules`)
- `GET /api/schedules` - List all timetable routes
- `POST /api/schedules` - Create a timetable schedule (`sourceAirport`, `destinationAirport`, `departureTime`, `arrivalTime`)

### Scheduled Flights (`/api/scheduled-flights`)
- `GET /api/scheduled-flights` - List active scheduled flights
- `POST /api/scheduled-flights` - Assign an aircraft to a schedule (`flightId`, `scheduleId`, `availableSeats`)

### Bookings (`/api/bookings`)
- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create reservation & decrement available seats (`passengerId`, `scheduledFlightId`, `ticketCost`)
- `DELETE /api/bookings/:id` - Cancel booking & release seat back to inventory
