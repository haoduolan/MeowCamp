var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ====================
// COMMENTS ROUTES
// ====================

router.get("/new", middleware.isLoggedIn, function(req, res){
    //console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){
       if(err) {
           console.log(err);
       } 
       else {
        //   console.log(campground);
           res.render("comments/new", {campground: campground});
       }
    });
     
});

router.post("/", middleware.isLoggedIn, function(req, res){
    console.log("received a post");
    // console.log(req.params);
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       }
       else {
           Comment.create(req.body.comment, function(err, comment){
              if(err){
                  req.flash("error", "Something went wrong");
                  console.log(err);
              } 
              else {
                  //add username an id to comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.time = createDate();
                  //save comment
                  comment.save();
                  campground.comments.push(comment);
                  campground.save();
                  req.flash("success", "Successfully added comment");
                  res.redirect('/campgrounds/' + campground._id);
              }
           });
       }
   }) ;
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
          console.log(req.params.id);
          console.log(foundComment);
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
   });
});

//comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } 
      else {
          
        updatedComment.time = createDate();
        res.redirect("/campgrounds/" + req.params.id );
      }
   });
});

//comment destory route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err) {
           res.redirect("back");
       } 
       else {
           req.flash("success", "Comment deleted");
           res.redirect("/campgrounds/" + req.params.id)
       }
    });
});

module.exports = router;

function createDate() {
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    return (month + 1) + "/" + day + "/" + year;
}