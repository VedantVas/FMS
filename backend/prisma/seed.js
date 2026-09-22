import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Flight Management System database...');

  // 1. Seed Flights
  const flights = [
    {
      flightNumber: 'DL-102',
      carrierName: 'Delta Airlines',
      flightModel: 'Boeing 737',
      seatCapacity: 200,
    },
    {
      flightNumber: 'UA-405',
      carrierName: 'United Airlines',
      flightModel: 'Airbus A320',
      seatCapacity: 180,
    },
    {
      flightNumber: 'AA-809',
      carrierName: 'American Airlines',
      flightModel: 'Boeing 787',
      seatCapacity: 250,
    },
    {
      flightNumber: 'BA-215',
      carrierName: 'British Airways',
      flightModel: 'Airbus A350',
      seatCapacity: 300,
    }
  ];

  for (const f of flights) {
    await prisma.flight.upsert({
      where: { flightNumber: f.flightNumber },
      update: {},
      create: f,
    });
  }

  // 2. Seed Airports
  const airports = [
    { airportCode: 'JFK', airportName: 'John F. Kennedy International Airport', airportLocation: 'New York, USA' },
    { airportCode: 'LAX', airportName: 'Los Angeles International Airport', airportLocation: 'Los Angeles, USA' },
    { airportCode: 'ORD', airportName: "O'Hare International Airport", airportLocation: 'Chicago, USA' },
    { airportCode: 'LHR', airportName: 'Heathrow Airport', airportLocation: 'London, UK' },
  ];

  for (const a of airports) {
    await prisma.airport.upsert({
      where: { airportCode: a.airportCode },
      update: {},
      create: a,
    });
  }

  // 3. Seed Passengers
  const passengers = [
    { pnrNumber: 'PNR89101', passengerName: 'John Doe', passengerAge: 34, passengerUIN: 'US987654321', luggage: 20.0 },
    { pnrNumber: 'PNR89102', passengerName: 'Sarah Jenkins', passengerAge: 29, passengerUIN: 'US123456789', luggage: 15.5 },
    { pnrNumber: 'PNR89103', passengerName: 'Robert Smith', passengerAge: 45, passengerUIN: 'UK456789123', luggage: 25.0 },
  ];

  for (const p of passengers) {
    await prisma.passenger.upsert({
      where: { pnrNumber: p.pnrNumber },
      update: {},
      create: p,
    });
  }

  // 4. Seed Schedules
  const schedule1 = await prisma.schedule.create({
    data: {
      sourceAirport: 'JFK',
      destinationAirport: 'LAX',
      departureTime: new Date(Date.now() + 86400000), // tomorrow
      arrivalTime: new Date(Date.now() + 86400000 + 6 * 3600000),
    }
  });

  const schedule2 = await prisma.schedule.create({
    data: {
      sourceAirport: 'ORD',
      destinationAirport: 'LHR',
      departureTime: new Date(Date.now() + 2 * 86400000),
      arrivalTime: new Date(Date.now() + 2 * 86400000 + 8 * 3600000),
    }
  });

  // 5. Seed Scheduled Flights
  const deltaFlight = await prisma.flight.findUnique({ where: { flightNumber: 'DL-102' } });
  if (deltaFlight) {
    const scheduledFlight = await prisma.scheduledFlight.create({
      data: {
        flightId: deltaFlight.id,
        scheduleId: schedule1.id,
        availableSeats: deltaFlight.seatCapacity - 1,
      }
    });

    const firstPassenger = await prisma.passenger.findUnique({ where: { pnrNumber: 'PNR89101' } });
    if (firstPassenger) {
      await prisma.booking.create({
        data: {
          passengerId: firstPassenger.id,
          scheduledFlightId: scheduledFlight.id,
          ticketCost: 350.0,
        }
      });
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
