const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/bot/',
        createProxyMiddleware({
            target: 'https://localhost:8443',
            changeOrigin: true,
        })
    );

    app.use(
        '/bot/',
        createProxyMiddleware({
            target: 'https://192.168.1.23:8443',
            changeOrigin: true,
        })
    );
};