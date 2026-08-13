import { createApp } from './app.js';

const DEFAULT_PORT = Number(process.env.PORT) || 5000;
const app = createApp();

function startServer(port: number) {
  const server = app.listen(port, () => {
    console.log(`🚀 Food Order Management Backend listening on http://localhost:${port}`);
    console.log(`📡 REST Endpoints: http://localhost:${port}/api/menu, http://localhost:${port}/api/orders`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is occupied. Attempting port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(DEFAULT_PORT);

export default app;
