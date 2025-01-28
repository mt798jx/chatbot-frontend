const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        ['/bot', '/api'],
        createProxyMiddleware({
            target: 'https://localhost:8443',
            changeOrigin: true,
        })
    );

    app.use(
        ['/bot', '/api'],
        createProxyMiddleware({
            target: 'https://192.168.1.23:8443',
            changeOrigin: true,
        })
    );

    app.use(
        ['/bot', '/api'],
        createProxyMiddleware({
            target: 'https://147.232.205.178:8443',
            changeOrigin: true,
        })
    );

    app.use(
        ['/bot', '/api'],
        createProxyMiddleware({
            target: 'https://34.107.119.159:443',
            changeOrigin: true,
        })
    );

    app.use(
        ['/bot', '/api'],
        createProxyMiddleware({
            target: 'https://api.mtvrdon.com',
            changeOrigin: true,
        })
    );
};