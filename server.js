var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require('underscore');
var PORT = process.env.PORT || 3000

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());
app.get('/', function (req,res) {
  res.send('Todo API Root');
});
// GET ALL
app.get('/todos', function (req,res) {
  res.json(todos);
});
// GET
app.get('/todos/:id', function (req,res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  if (matchedTodo) {
    res.json(matchedTodo)
  } else{
    res.status(404).send();  
  }
});

// POST
app.post('/todos', function (req, res) {
  var body = req.body;
  
  if (!_.isBoolean(body.completed) || 
      !_.isString(body.description) ||
      body.description.trim().length === 0) {
    return res.status(400).send();

  }
  console.log('description: '+ body.description);
  var body = _.pick(body,'description', 'completed');
  body.id = todoNextId++;
  todos.push(body);
  res.json(body);
});

//PUT
app.put('/todos/:id', function (req,res) {

  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  if (!matchedTodo) {
    return res.status(400).send(`no item with id: ${todoId}`);
  }
  var body = _.pick(req.body,'description', 'completed');
  var validAttributes = {};
  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if(body.hasOwnProperty('completed')) {
    return res.status(400).json({"error":"completed attributes wrong"})
  }
  if (body.hasOwnProperty('description') &&
      _.isString(body.description) &&
      body.description.trim().length > 0) {
    validAttributes.description = body.description;
  } else if(body.hasOwnProperty('description')) {
    return res.status(400).json({"error":"description attributes wrong"})
  }
  // pass by reference
   _.extend(matchedTodo,validAttributes);

  return res.json(matchedTodo)

});

//DELETE
app.delete('/todos/:id', function (req,res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});

  if (matchedTodo) {
    todos = _.without(todos,matchedTodo);
    res.json(matchedTodo);
  } else{
    res.status(404).json({"error": `delete item id: ${todoId} fail`});
  }
});



app.listen(PORT, function () {
  console.log("start express at: " + PORT);
})
