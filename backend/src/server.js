import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✈️  FMS Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 REST API available at http://localhost:${PORT}/api/flights`);
});
