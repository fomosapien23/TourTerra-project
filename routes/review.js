const express =require ("express");
const router=express.Router({mergeParams: true});
const wrapAsync=require('../util/wrapAsync.js')
const ExpressError=require('../util/ExpressError.js')
const Listing=require("../MODELS/listing.js")
const Review=require("../MODELS/review.js")
const { validateReview, isLoggedIn , isReviewAuthor } = require("../middleware.js")
const reviewController =require("../CONTROLLERS/review.js")

//review 

//review post route
router.post('/',isLoggedIn, validateReview , wrapAsync(reviewController.createReview));

  
  // delete review route

  router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync( reviewController.destroyReview));

  module.exports=router;