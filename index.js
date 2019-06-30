const hapi = require('hapi');
const mongoose = require('mongoose');
const Paintings = require('./models/Paintings');

const server = hapi.server({
    port: 4000,
    host: 'localhost'
});

mongoose.connect('mongodb://harish:Fire!123@ds123844.mlab.com:23844/graphqldb', { useNewUrlParser: true });

mongoose.connection.once('open', ()=> console.log('Mongoose connected.'));

(async() => {
    server.route([
        {
            method: 'GET',
            path: '/',
            handler: () => '<h1>Modern Api with Yarn and GraphQL</h1>'
        },
        {
            method: 'GET',
            path: '/api/v1/paintings',
            handler: () => Paintings.find()
        },
        {
            method: 'POST', 
            path: '/api/v1/paintings',
            handler: (req,res) => {
                const {name, url, techniques } = req.payload;
                const painting = new Paintings({
                    name,
                    url,
                    techniques
                });
                return painting.save();
            }
        }
    ]);

    await server.start();
    console.log('Hapi listening on: '+server.info.port);
})();