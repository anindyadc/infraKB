import app from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';

const start = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to database');
    
    app.listen(env.PORT, () => {
      console.log(`Server listening on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
