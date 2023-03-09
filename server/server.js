
require("dotenv").config()

const express = require("express");
const app = express(); 
const cors = require("cors");
const fs = require("fs");
const path = require('path');
const { graphqlHTTP } = require('express-graphql')
const jwt = require("jsonwebtoken");
const schema = require('./Schemas')

app.use(cors());
app.use(express.json());

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}))

const pathName =  path.join(__dirname, '/list.json');
const todos = JSON.parse(fs.readFileSync(pathName, "utf-8"));
console.log(__dirname)


app.post("/login", function(req, res) {
  console.log('LOGIN');
  const username = req.body.username;
  const user = { name: username}
  console.log(user)
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({accessToken: accessToken})
});

function authenticateToken(req, res, next){
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]
  // felette lévő sor [1]: Bearer TOKEN
  if(!token){
    console.log('NULL')
    return res.status(401).json({status: '401', data: null})
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err){
      console.log('ERR',  err)
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  })
}

app.listen(5000, () => {
  console.log("server is running on port 5000");
});