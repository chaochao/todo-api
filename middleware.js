module.exports = function(db){
  return {
    requireAuthentication: function(req,res,next){

      var token = req.get('Auth');
      console.log("get token:"+ token);
      db.user.findbyToken(token).then(function(user){
        console.log('get user')
        req.user = user;
        next();
      },function(e){
        res.status(401).json(e)
      });
    }
  }
}