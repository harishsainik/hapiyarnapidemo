const hapi = require('hapi');

const server = hapi.server({
    port: 4000,
    host: 'localhost'
});

(async() => {
    server.route({
        method: 'GET',
        path: '/',
        handler: () => '<h1>Modern Api with Yarn and GraphQL</h1>'
    })

    await server.start();
    console.log('Hapi listening on: '+server.info.port);
})();