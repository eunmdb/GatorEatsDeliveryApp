var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  res.render('sfsu-user-pages/checkOut',{
    title: 'checkOut',
    array: [0,2,3,4]
  });
});
module.exports = router;
