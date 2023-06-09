//code to query the database for restaurants based on user input
//Author(s): Emily and Eunice
var db = require("../../conf/database");
const searchModule = {};



// based on server side search by nicholas stepanov
// https://medium.com/@nicholasstepanov/search-your-server-side-mysql-database-from-node-js-website-400cd68049fa
// Modification by: Emily and Eunice
// Modifications include changing if statements to cover descriptions and
// adding more inforation to be used from the db query such as restaurant
// name, longitude, and latitude
searchModule.executeSearch = function(req, res, next){

    var searchTerm = req.query.search;
    var category = req.query.category;

    let query = "SELECT * FROM team7.restaurant WHERE approved = 1;";


    // show all restaurants
    if(category =='all' && searchTerm ==''){
        console.log('situation 0');
        categoryQuery = "SELECT * FROM team7.restaurant WHERE approved = 1;";
    }
    // returns all restaurants that have the searchTerm either category/name/description
    else if(category == 'all' && searchTerm !=""){
        console.log("1");
        query = "SELECT * FROM team7.restaurant WHERE approved = 1 AND restaurant_name LIKE '%" + searchTerm + "%'\
        OR  category ='"+  category+"' OR description LIKE'%" + searchTerm + "%' OR category = '" + searchTerm +"';";
        categoryQuery = "SELECT * FROM team7.restaurant WHERE approved = 1;";
    }
    //returns restaurants in the chosen category and have the searchTerm in either name/description
    else if(category != '' && searchTerm !=''){
        query = "SELECT * FROM team7.restaurant WHERE category ='"+  category+"' AND (restaurant_name LIKE '%" + searchTerm + "%'\
        OR description LIKE'%" + searchTerm + "%') AND approved = 1;";
        console.log("situation 2");
        categoryQuery = "SELECT * FROM team7.restaurant WHERE category = '"+ category+"' AND approved = 1;";
    }
    // returns all restaurants in the chosen category
    else if(category != '' && searchTerm == '' ){
        query = "SELECT * FROM team7.restaurant WHERE category ='" + category + "' AND approved = 1;";
        categoryQuery = "SELECT * FROM team7.restaurant WHERE category ='" + category + "' AND approved = 1;";
        console.log("situation 3");
    }



    // queries db for results matching user searchTerm
    db.query(query, (err, results)=>{
        if(err){
            req.searchResult = results;
            req.searchTerm = searchTerm;
            req.category = "";
            next();
        }
        // console.log(searchTerm);
        // console.log(category);
        // console.log(results);
        req.searchResult = results;
        req.searchTerm = searchTerm;
        req.category = category;
        // Because we could not access the results inner elementsin restaurants.hbs
        //we had to access them here and pass them to resataurant.hbs here
        req.latitude = [];
        req.longitude = [];
        req.restaurant_name = [];
        for(x in results){
            // console.log([results[x].latitude]);
            req.latitude.push(results[x].latitude);
            req.longitude.push(results[x].longitude);
            // names.push('"'+results[x].restaurant_name+'"');
            req.restaurant_name.push(results[x].restaurant_name);
        }
        

        // console.log(req.latitude);
        // console.log(req.longitude);
        // console.log(req.name)
        // console.log(results[0].latitude);
        next();
    })

}

searchModule.categoryLength = function(req, res, next){
    var category = req.query.category;
    var searchTerm = req.query.search;
    let categoryQuery = "SELECT * FROM team7.restaurant WHERE approved = 1;";

        // show all restaurants
        if(category =='all' && searchTerm ==''){
            console.log('cat 0');
        }
        // returns all restaurants that have the searchTerm either category/name/description
        else if(category == 'all' && searchTerm !=""){
            console.log("cat 1");
        }
        //returns restaurants in the chosen category and have the searchTerm in either name/description
        else if(category != '' && searchTerm !=''){
            console.log("cat 2");
            categoryQuery = "SELECT * FROM team7.restaurant WHERE category = '"+ category+"' AND approved = 1;";
        }
        // returns all restaurants in the chosen category
        else if(category != '' && searchTerm == '' ){
            categoryQuery = "SELECT * FROM team7.restaurant WHERE category ='" + category + "' AND approved = 1;";
            console.log("cat 3");
        }

           // queries db for results matching user searchTerm
    db.query(categoryQuery, (err, cResults)=>{
        if(err){
            req.categoryResults = cResults;
            next();
        }
        console.log(cResults);
        req.categoryResults = cResults;

        next();
    })
}


module.exports = searchModule;