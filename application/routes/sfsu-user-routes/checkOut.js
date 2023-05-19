/*
  Author: Eunice
  This file is used to retrieve the items inside of the user's cart
  and allow them to place an order
*/
var express = require('express');
var router = express.Router();
var db = require("../../conf/database");
var cartResults = [];
/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  //Rendering the cart in the orders page
  if(res.locals.logged){

    let currentOwner = res.locals.userId;
    
    var displayCart = "SELECT menu.menuID, menu.name, menu.images, menu.price, cart.quantity, cart.cartItemTotal FROM cart JOIN menu ON cart.cartItem = menu.menuID WHERE cart.userCart = ?";
    db.query(displayCart, [currentOwner], function(err, result, fields){
      if(err) throw err;
      cartResults = result;
      console.log(cartResults);
      res.render('sfsu-user-pages/checkOut', {usersCart : cartResults});
    });
  }else{
    res.render('login/sfsuLogin', { message: "You must be logged in to view your cart.", error: true});
  }
  });

//Tutorial used: https://www.webslesson.info/2022/07/nodejs-autocomplete-search-with-mysql-database.html 
router.get('/getBuildings', function(req, res, next){
  var search_query = req.query.search_query;
  var sql = "SELECT name FROM dropoffPoints WHERE name LIKE ? LIMIT 3;";
  db.query(sql, ['%' + search_query + '%'], (err, result)=>{
    // console.log(result);
    res.json(result);
  }) 
});

router.post('/submitOrder', function(req,res,next){
  let ticketItems = req.body.ticket;
  console.log(ticketItems);
  console.log("submitted order");
  res.redirect('/orderCompleted');
});

//Delete ticket from the cart table
router.post('/deleteItem', function(req, res, next){
  let currentOwner = res.locals.userId;
  let ticketMenuID = req.body.ticket[0].delete;
  // console.log(req.body.ticket);
  let displayRestaurant;
  // console.log(ticketMenuID);
  

  var deleteItemFromCart = "DELETE FROM cart WHERE cartItem = ? AND userCart = ?;";
  db.query(deleteItemFromCart, [ticketMenuID, currentOwner], (err, result)=>{
    if(err) throw err;
  });
  
  //Getting the restaurant to be displayed again
  var getRestaurant = "SELECT restaurant FROM menu WHERE menu.menuID = ?";
  var showNewCart = "SELECT menu.menuID, menu.name, menu.images, menu.price, cart.quantity, cart.cartItemTotal FROM cart JOIN menu ON cart.cartItem = menu.menuID WHERE cart.userCart = ? AND cart.restaurantIDMenu = ?;";

  db.query(getRestaurant, [ticketMenuID], (err, result)=>{
    if(err) throw err;
    console.log(result[0].restaurant);
    displayRestaurant = result[0].restaurant;

    db.query(showNewCart, [currentOwner, displayRestaurant], (err, result)=>{
      if(err) throw err;
      console.log(result);
      cartResults = result;
      res.render('sfsu-user-pages/checkOut', {usersCart : cartResults});

    })
  })
    
})
module.exports = router;
