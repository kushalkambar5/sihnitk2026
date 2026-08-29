import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { initSockets } from './sockets/index.js';

const server = http.createServer(app);

// Attach Socket.IO
initSockets(server);

const PORT = parseInt(env.PORT, 10) || 5000;

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 DocPrint Backend REST + Socket.IO API Server`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSockets active on ws://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
