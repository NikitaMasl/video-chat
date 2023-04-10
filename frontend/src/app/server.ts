import next from 'next';
import express from 'express';
import compression from 'compression';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { join } from 'path';
import { parse } from 'url';
import cookieParser from 'cookie-parser';

const devApiUrl = process.env.DEV_API_URL || 'http://localhost:8000';
const devSocketUrl = process.env.DEV_SOCKET_CALL_URL || 'http://localhost:8001';
const devChatSocketUrl = process.env.DEV_CHAT_SOCKET_CALL_URL || 'http://localhost:8002';
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const env = process.env.NODE_ENV;
const dev = env !== 'production';

const devProxy: Record<string, Options> = {
    '/api': {
        target: `${devApiUrl}/api/`,
        pathRewrite: { '^/api': '/' },
        changeOrigin: true,
    },
    '/socket.io/call': {
        target: `${devSocketUrl}/socket.io`,
        pathRewrite: { '^/call': '/' },
        changeOrigin: true,
        ws: true,
    },
    '/socket.io/chat': {
        target: `${devChatSocketUrl}/socket.io`,
        pathRewrite: { '^/chat': '/' },
        changeOrigin: true,
        ws: true,
    },
};

const app = next({
    dev,
});

const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        const server = express();

        server.use(cookieParser());

        if (!dev) {
            server.use(compression());
        }

        // Set up the proxy.
        if (dev && devProxy) {
            Object.keys(devProxy).map((context) => {
                server.use(createProxyMiddleware(context, devProxy[context]));
            });
        }

        // Default catch-all handler to allow Next.js to handle all other routes
        server.all('*', (req, res) => {
            const parsedUrl = parse(req.url, true);

            const { pathname } = parsedUrl;

            if (pathname === '/service-worker.js' || pathname?.startsWith('/workbox-')) {
                const filePath = join(__dirname, '.next', pathname);
                app.serveStatic(req, res, filePath);
            } else {
                handle(req, res, parsedUrl);
            }
        });

        server.listen(port, () => {
            console.log(`Frontend is ready on port ${port} [${env}]`);
        });
    })
    .catch((err) => {
        console.log('An error occurred, unable to start the server');
        console.log('Error; server.ts;', err);
    });
