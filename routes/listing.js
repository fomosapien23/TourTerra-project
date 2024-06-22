const express =require ("express");
const router=express.Router();
const wrapAsync=require('../util/wrapAsync.js')
const ExpressError=require('../util/ExpressError.js')
const Listing=require("../MODELS/listing.js")
const {isLoggedIn , isOwner, validateListing}=require("../middleware.js")

const listingController= require("../CONTROLLERS/listing.js")


//home page render
router.get("/",wrapAsync (listingController.index))



//new route

router.get("/new",isLoggedIn,listingController.renderNewForm)

//create route

router.post("/",validateListing, wrapAsync(listingController.createListing))

//edit route

router.get("/:id/edit", isLoggedIn, isOwner , wrapAsync( listingController.renderEditForm))

//update route

router.put("/:id", isLoggedIn, isOwner , validateListing, wrapAsync (listingController.updateListing))

//delete route

router.delete("/:id", isLoggedIn, isOwner ,wrapAsync( listingController.destroyListing))

//show route
router.get("/:id", wrapAsync(listingController.showListings))

module.exports=router;
