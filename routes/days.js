var express = require("express");
var dayRouter = express.Router();
var attractionRouter = express.Router();
var models = require("../models");

// add day, delete day, add attraction delete attraction
//get, post, delete(post)


// GET /days
dayRouter.get('/', function (req, res, next) {
    // serves up all days as json
    models.Day.find().populate("hotel restaurants thingsToDo").exec().then(function (days) {
        days.sort(function(a,b){
            return a.number - b.number;
        });
        res.json(days);
    }, function (err){
        console.log(err);
        res.send(404);
    });
});
// POST /days
dayRouter.post('/', function (req, res, next) {
    // creates a new day and serves it as json
    // dayNumber, 
    models.Day.create({number: req.body.number}, function(err, day){
    	if(err) { 
    		console.log(err)
    		res.send(404) 
    	}
    	res.json(day);
    });
});
// GET /days/:id
dayRouter.get('/:id', function (req, res, next) {
    // serves a particular day as json
});
// DELETE /days/:id
dayRouter.delete('/:id', function (req, res, next) {
    // deletes a particular day
    models.Day.remove({_id: req.params.id}).exec().then(function(result){
        res.json(result);
    }, errHandle);
});
// POST /days/:id/number
dayRouter.post("/:id/number", function (req, res, next) {
    models.Day.findOneAndUpdate({_id: req.params.id}, {number: req.body.number}).exec().then(function (day){
        res.json(day);
    }, errHandle); 
});


//Attraction routing vvvv

// POST /days/:id/hotel
dayRouter.post('/:id/hotel', function (req, res, next) {
    // creates a reference to the hotel
    models.Day.findOneAndUpdate({_id: req.params.id}, {hotel: req.body.attractionId}).exec().then(function (day){
        res.json(day);
    }, errHandle); 
});
// DELETE /days/:id/hotel
dayRouter.delete('/:id/hotel', function (req, res, next) {
    // deletes the reference of the hotel
    models.Day.findOneAndUpdate({_id: req.params.id}, {hotel: null}).exec().then(function (day){
        res.json(day);
    }, errHandle);
});
// POST /days/:id/restaurants
dayRouter.post('/:id/restaurants', function (req, res, next) {
    // creates a reference to a restaurant
    models.Day.findOne({_id: req.params.id}).exec().then(function(day){
        day.restaurants.push(req.body.attractionId);
        day.save();
        res.send(day);
    }, errHandle);
});
// DELETE /days/:dayId/restaurants/:restId
dayRouter.delete('/:id/restaurant/:restId', function (req, res, next) {
    // deletes a reference to a restaurant
    models.Day.findOne({_id: req.params.id}).exec().then(function(day){
        var index = day.restaurants.indexOf(req.params.restId);
        day.restaurants.splice(index, 1);
        day.save();
        res.send(day);
    }, errHandle);
});
// POST /days/:id/thingsToDo
dayRouter.post('/:id/thingsToDo', function (req, res, next) {
    // creates a reference to a thing to do
    models.Day.findOne({_id: req.params.id}).exec().then(function(day){
        day.thingsToDo.push(req.body.attractionId);
        day.save();
        res.send(day);
    }, errHandle);
});
// DELETE /days/:dayId/thingsToDo/:thingId
dayRouter.delete('/:id/thingsToDo/:thingId', function (req, res, next) {
    // deletes a reference to a thing to do
    models.Day.findOne({_id: req.params.id}).exec().then(function(day){
        var index = day.thingsToDo.indexOf(req.params.thingId);
        day.thingsToDo.splice(index, 1);
        day.save();
        res.send(day);
    }, errHandle);
});



function errHandle (err){
    console.log(err);
    res.send(err);
}


module.exports = dayRouter;
