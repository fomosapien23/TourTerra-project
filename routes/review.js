const express =require ("express");
const router=express.Router({mergeParams: true});
const wrapAsync=require('../util/wrapAsync.js')
const ExpressError=require('../util/ExpressError.js')
const {  reviewSchema }=require('../schema.js')
const Listing=require("../MODELS/listing.js")
const Review=require("../MODELS/review.js")



const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=>el.message);
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//review 

//review post route
router.post('/', validateReview , wrapAsync(async (req, res) => {
    let listing= await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    console.log(newReview);  // This should print the form data
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved")
    res.redirect(`/listHome/${listing._id}`);  // Ensure to send a response
  }));

  
  // delete review route

  router.delete("/:reviewId", wrapAsync( async (req,res)=>{
        let { id , reviewId }=req.params;

        await Listing.findByIdAndUpdate( id, {$pull : { review: reviewId}});
        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/listHome/${id}`)

  }));

  module.exports=router;