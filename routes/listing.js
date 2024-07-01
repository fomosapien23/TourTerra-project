const express =require ("express");
const router=express.Router();
const wrapAsync=require('../util/wrapAsync.js')
const ExpressError=require('../util/ExpressError.js')
const Listing=require("../MODELS/listing.js")
const {isLoggedIn , isOwner, validateListing}=require("../middleware.js")

const listingController= require("../CONTROLLERS/listing.js")

const multer  = require('multer')
const {storage}= require("../cloudConfig.js")
const upload = multer({ storage })

// Log the request method and URL
router.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

//home page render
router.get("/",wrapAsync (listingController.index))



//new route

router.get("/new",isLoggedIn,listingController.renderNewForm)


// category route 

router.get('/category/:categoryId', wrapAsync(listingController.showCategory))

//search route 

router.get('/searchList', wrapAsync(listingController.searchListings))

//create route

router.post("/",isLoggedIn, upload.single('listing[image]') , validateListing, wrapAsync(listingController.createListing))
// router.post("/",upload.single("listing[image]"),(req,res)=>{
//     res.send(req.file)
// })

//edit route

router.get("/:id/edit", isLoggedIn, isOwner , wrapAsync( listingController.renderEditForm))

//update route

router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]') , validateListing,  wrapAsync (listingController.updateListing))

//delete route

router.delete("/:id", isLoggedIn, isOwner ,wrapAsync( listingController.destroyListing))

//show route
router.get("/:id", wrapAsync(listingController.showListings))


module.exports=router;
