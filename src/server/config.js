module.exports = {
    protocol: 'http',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 8080,
    cloakPort: process.env.CLOAK_PORT || 8090
};