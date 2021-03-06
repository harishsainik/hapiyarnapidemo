const { GraphQLObjectType, GraphQLString, GraphQLSchema } = require('graphql');

const PaintingType = require('./PaintingType');

const Painting = require('../models/Paintings');

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        painting: {
            type: PaintingType,
            args: {id: {type: GraphQLString}}, 
            resolve(parent, args){
                return Painting.findById(args.id);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});