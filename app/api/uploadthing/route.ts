import { createRouteHandler } from 'uploadthing/next';
import { fileRouter } from './core';

export const { GET, POST } = createRouteHandler({
  router: fileRouter,
  config: {
    logLevel: 'Debug',
    callbackUrl: 'http://localhost:3000' + '/api/uploadthing',
    isDev: true,
  },
});
