import { createRouteHandler } from 'uploadthing/next';
import { fileRouter } from './core';
// import { api } from '@/lib/api';

export const { GET, POST } = createRouteHandler({
  router: fileRouter,
  config: {
    logLevel: 'Debug',
    callbackUrl: 'https://zenith-six-rho.vercel.app/api/uploadthing',
    isDev: process.env.NODE_ENV === 'development',
  },
});
