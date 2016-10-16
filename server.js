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
    res.status(400).send();
    return
  }
  console.log('description: '+ body.description);
  var body = _.pick(body,'description', 'completed');
  body.id = todoNextId++;
  todos.push(body);
  res.json(body);
});

//PUT
app.put('/todos/:id',function (req,res) {
  var body = req.body;
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  if (matchedTodo) {
    res.json(matchedTodo)
  } else{
    res.status(404).send();
  }

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
