const hapi = require('hapi');
const mongoose = require('mongoose');
const Paintings = require('./models/Paintings');
const {graphqlHapi, graphiqlHapi} = require('apollo-server-hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const schema = require('./graphql/schema');
const Package = require('./package');

const server = hapi.server({
    port: 4000,
    host: 'localhost'
});

mongoose.connect('mongodb://harish:Fire!123@ds123844.mlab.com:23844/graphqldb', { useNewUrlParser: true });

mongoose.connection.once('open', ()=> console.log('Mongoose connected.'));

(async() => {
    
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            Options: {
                info: {
                    title: Package.name, 
                    version: Package.version
                }
            }
        }
    ])

	await server.register({
		plugin: graphiqlHapi,
		options: {
			path: '/graphiql',
			graphiqlOptions: {
				endpointURL: '/graphql'
			},
			route: {
				cors: true
			}
		}
	});

    await server.register({
        plugin: graphqlHapi, 
        options: {
            path: '/graphql',
            graphqlOptions: {
                schema
            }
        },
        route: {
            cors: true
        }
    });

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: () => '<h1>Modern Api with Yarn and GraphQL</h1>'
        },
        {
            method: 'GET',
            path: '/api/v1/paintings',
            config: {
                description: 'Get all paintings', 
                tags: ['api', 'getAll']
            },
            handler: () => Paintings.find()
        },
        {
            method: 'POST', 
            path: '/api/v1/paintings',
            handler: (req) => {
                const {name, url, technique } = req.payload;
                const painting = new Paintings({
                    name,
                    url,
                    technique
                });
                return painting.save();
            }
        }
    ]);

    await server.start();
    console.log('Hapi listening on: '+server.info.port);
})();