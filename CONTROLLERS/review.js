const Listing= require("../MODELS/listing.js")
const Review= require("../MODELS/review.js")

module.exports.createReview=async (req, res) => {
    let listing= await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);  // This should print the form data
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review saved")
    req.flash("success","New Review is Added!")
    res.redirect(`/listHome/${listing._id}`);  // Ensure to send a response
  }

module.exports.destroyReview=async (req,res)=>{
    let { id , reviewId }=req.params;

    await Listing.findByIdAndUpdate( id, {$pull : { review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is Deleted!")
    res.redirect(`/listHome/${id}`)

}