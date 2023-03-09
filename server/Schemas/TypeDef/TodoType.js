const graphql = require('graphql');
const { 
    GraphQLObjectType, 
    GraphQLString,
} = graphql;
const TodoType = new GraphQLObjectType({
    name: "Todo",
    fields: () => ({
      id: { type: GraphQLString },
      name: { type: GraphQLString },
    })
  })

  module.exports = TodoType;