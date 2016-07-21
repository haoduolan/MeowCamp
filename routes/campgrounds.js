var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res){
    // res.render("campgrounds", {campgrounds: campgrounds}); 
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
     var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author:author}
    // campgrounds.push(newCampground);
    // create new campground and save it to database
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else {
           res.redirect("/campgrounds"); 
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new.ejs"); 
});

//SHOW -- shows more info about campground.
router.get("/:id", function(req, res){
    //campground.findById(req.params.id, function(err, findCampground){
    Campground.findById(req.params.id).populate("comments").exec(function(err, findCampground){
       if(err){
           console.log(err);
       } 
       else {
        //   console.log(findCampground);
        // if (findCampground) {
            res.render("campgrounds/show", {campground: findCampground});
        // }
        // else {
            //console.log("No campground!");
            //alert("error found!");
        //}
       }
    });
});

//Edit Campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, findCampground){
           res.render("campgrounds/edit", {campground: findCampground});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
      if(err) {
          res.redirect("/campgrounds");
      } 
      else {
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
    //redirect somewhere(show page)
});

//Destory Campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});



module.exports = router;