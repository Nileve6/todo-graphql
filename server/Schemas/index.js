
const fs = require("fs");
const graphql = require('graphql');
const { 
    GraphQLObjectType, 
    GraphQLSchema, 
    GraphQLList, 
    GraphQLString,
} = graphql;
const todoData = require('../list.json');
const TodoType = require('./TypeDef/TodoType');

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      getAllTodos: {
        type: new GraphQLList(TodoType),
        args: {},
        resolve(parent, args){
          return todoData
        }
      }
    }
  });

  const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
      createTodo: {
        type: TodoType,
        args: {
          id: { type: GraphQLString },
          name: { type: GraphQLString },
        },
        resolve(parent, args){
            console.log('CREATE')
            todoData.push({ id: args.id, name: args.name });
            const data = JSON.stringify(todoData)
            fs.writeFile('./list.json', data, err => {
                if(err) throw err;
                console.log("New data added", data);
            });
            return args;
        }
      },
      updateTodo: {
        type: TodoType,
        args: {
          id: { type: GraphQLString },
          name: { type: GraphQLString },
        },
        resolve(parent, args){
            const newTodo = { id: args.id, name: args.name };
            const newTodoData = todoData.map(item => {
                return item.id == newTodo.id ? newTodo : item
            })
            const data = JSON.stringify(newTodoData)
            fs.writeFile('./list.json', data, err => {
                if(err) throw err;
                console.log("New data added", data);
            });
            return args;
        }
      },
      deleteTodo:{
        type: TodoType,
        args: {
          id: { type: GraphQLString },
        },
        resolve(parent, args){
            const todoToDelete = { id: args.id };
            const newTodoData = todoData.filter(item => 
                item.id !== todoToDelete.id
            )
            const data = JSON.stringify(newTodoData)
            fs.writeFile('./list.json', data, err => {
                if(err) throw err;
                console.log("New data added", data);
            });
            return args;
        }
      },
    }
  });
  
  module.exports = new GraphQLSchema({query: RootQuery, mutation: Mutation});