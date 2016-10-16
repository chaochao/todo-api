var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000

var todos =[
  {
    id: 1,
    description: 'todolist 1',
    completed: false
  },
  {
    id: 2,
    description: 'todolist 2',
    completed: false
  }
]

app.get('/', function (req,res) {
  res.send('Todo API Root');
});

app.get('/todos', function (req,res) {
  res.json(todos);
});

app.get('/todos/:id', function (req,res) {
  var id = parseInt(req.params.id, 10);
  var matchedTodo;
  todos.forEach(function (todo) {
    if (todo.id === id) {
      matchedTodo = todo;
    }
  })
  if (matchedTodo) {
    res.json(matchedTodo)
  } else{
    res.status(404).send();  
  }
});


app.listen(PORT, function () {
  console.log("start express at: " + PORT);
})
