var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  //use sqlite databse
  'dialect': 'sqlite',
  'storage': __dirname + '/basic-sqlite-databse.sqlite'
});

var Todo = sequelize.define('todo', {
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [1, 250]
    }
  },
  completed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }

})

sequelize.sync().then(function() {
  console.log("Everything is synced");

  Todo.create({
      description: 'test1',
      completed: false

    }).then(function(todo) {
      return Todo.create({
        description: 'test2'
      });
    }).then(function() {
      return Todo.findAll({
        where: {
          description: {
            $like: '%2%'
          }
        }
      });
    }).then(function(todos) {
      if (todos) {
        todos.forEach(function(todo, index) {
          console.log(index);
          console.log(todo.toJSON());
        });
      } else {
        console.log("nothing found");
      }

    })
    .catch(function(e) {
      console.log(e);
    })
})