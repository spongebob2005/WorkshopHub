import { createServer } from "net";
import { app, connectDb } from "./app.js";

const PORT = Number(process.env.PORT || 4000);

const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(startPort, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      // Port is in use, try next
      findAvailablePort(startPort + 1).then(resolve).catch(reject);
    });
  });
};

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process
});

app.listen(PORT, async () => {
  try {
    await connectDb();
    console.log(`MongoDB API server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Failed to connect to database:', error);
    console.log('Server will continue running without database connection');
  }
}).on('error', async (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is in use, finding available port...`);
    const availablePort = await findAvailablePort(PORT + 1);
    console.log(`Using port ${availablePort}`);
    app.listen(availablePort, async () => {
      try {
        await connectDb();
        console.log(`MongoDB API server is running on http://localhost:${availablePort}`);
      } catch (error) {
        console.error('Failed to connect to database:', error);
        console.log('Server will continue running without database connection');
      }
    });
  } else {
    console.error('Server error:', err);
  }
});
