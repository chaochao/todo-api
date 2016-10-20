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

var User = sequelize.define('user', {
  email: Sequelize.STRING

})

Todo.belongsTo(User);
User.hasMany(Todo);
sequelize.sync({
  // force: true
}).then(function() {
  console.log("Everything is synced");
  User.findById(1).then(function(user){
    user.getTodos().then(function(todos){
      todos.forEach(function(todo){
        console.log(todo.toJSON());
      });
    });
  });

  // User.create({
  //   email: 'chao@email.com'
  // }).then(function(user) {
  //   console.log("after create user");
  //   return Todo.create({
  //     description: 'sometest'
  //   });
  // }).then(function(todo) {
  //   User.findById(1).then(function(user) {
  //     user.addTodo(todo);
  //   });
  // });
});