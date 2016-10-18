var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require('underscore');
var db = require('./db.js');
var PORT = process.env.PORT || 3000

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());
app.get('/', function(req, res) {
  res.send('Todo API Root');
});
// GET ALL
app.get('/todos', function(req, res) {
  var query = req.query;
  var where = {};

  if (query.hasOwnProperty('completed')) {
    switch (query.completed) {
      case 'true':
        where.completed = true;
        break;
      case 'false':
        where.completed = false;
        break;
    }
  }
  if (query.hasOwnProperty('description') && query.description.trim().length > 0) {
    where.description = {
      $like: '%' + query.description + '%'
    };
  }

  db.todo.findAll({
    where: where
  }).then(function(todos) {
    res.json(todos);
  }, function(e) {
    res.status(500).json({
      "error": "can not get data from db."
    });
  });
});
// GET find by id
app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo;

  db.todo.findById(todoId).then(function(matchedTodo) {
    if (matchedTodo) {
      res.json(matchedTodo)
    } else {
      res.status(404).json({
        "error": `can not find item with id ${todoId}`
      });
    }
  }, function(e) {
    res.status(500).json({
      "error": "findById function call goes wrong"
    });
  });
});

// POST
app.post('/todos', function(req, res) {
  var body = req.body;
  var body = _.pick(body, 'description', 'completed');
  //save to todo db
  db.todo.create(body).then(function(todo) {
    res.json(todo.toJSON())
  }, function(e) {
    res.status(400).json(e);
  });
});

//PUT
app.put('/todos/:id', function(req, res) {

  var todoId = parseInt(req.params.id, 10);
  var body = _.pick(req.body, 'description', 'completed');
  var attributes = {};
  if (body.hasOwnProperty('completed')) {
    attributes.completed = body.completed;
  }
  if (body.hasOwnProperty('description')) {
    attributes.description = body.description;
  }
  db.todo.findById(todoId).then(function(todo) {
    if (todo) {
      todo.update(attributes).then(function(todo) {
        res.json(todo.toJSON());
      }, function(e) {
        res.status(400).json({
          error: 'can not updated',
          e: e.message
        });
      });
    } else {
      res.status(404).json({
        error: 'no such item'
      });
    }
  }, function(e) {
    res.status(404).json(e);
  });
});

//DELETE
app.delete('/todos/:id', function(req, res) {

  var todoId = parseInt(req.params.id, 10);
  db.todo.destroy({
    where: {
      id: todoId
    }
  }).then(function(rowsDeleted) {
    console.log(rowsDeleted);
    if (rowsDeleted === 0) {
      res.status(404).json({
        error: 'NO todo with such id'
      })
    } else {
      res.status(204).send();
    }
  }, function(e) {});
});
//=======================
//user POST 
app.post('/users', function(req, res) {
  var body = req.body;
  var body = _.pick(body, 'email', 'password');

  db.user.create(body).then(function(user) {
    res.json(user.toJSON())
  }, function(e) {
    res.status(400).json(e);
  });

});



db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("start express at: " + PORT);
  });
});