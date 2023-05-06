var express = require('express');
var router = express.Router();
var db = require("../../conf/database");
var bcrypt = require('bcryptjs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  res.render('login/restaurantLogin', {title: 'Restaurant Login'});
});
router.post('/restaurantlogin',(req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  var sql = "SELECT restaurantID,firstname,lastname,password,email FROM restaurantAccount where email = ?;";
  let userid;
  let firstname;
  let lastname;
  db.query(sql,[email], function(err,result, fields){
    if(err) throw err;

    if(result.length == 1 && bcrypt.compareSync(password, result[0].password)){
        userid = result[0].restaurantID;
        firstname = result[0].firstname;
        lastname = result[0].lastname;
        //login user
        req.session.userid = userid;  
        req.session.email = email;   
        req.session.firstName = firstname;
        req.session.lastName = lastname;
        res.locals.logged = true;
        res.locals.restaurantOwner = true;
        req.session.restaurantOwner = "restaurant Owner logged in";
        // console.log("user id: %s",  req.session.userid);
        res.render('index', {email : req.session.email});
      }else{
        res.render('login/restaurantLogin', { message: "Invalid login", error:true });
      }
  });
});

router.post('/logout', (req,res,next)=>{
  if(req.session.email){
    console.log("Logging out: %s", req.session.email);
    req.session.destroy();
    res.redirect('/');
  }
});
module.exports = router;
