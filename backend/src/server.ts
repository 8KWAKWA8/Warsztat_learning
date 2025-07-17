import http from 'http';
import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { appRouter } from './trpc/router.js';

const handler = createHTTPHandler({
  router: appRouter,
  createContext: () => ({}),
});

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  handler(req, res);
});

server.listen(3001, () => {
  console.log('tRPC server listening on http://localhost:3001');
});