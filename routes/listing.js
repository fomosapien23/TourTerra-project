const express =require ("express");
const router=express.Router();
const wrapAsync=require('../util/wrapAsync.js')
const ExpressError=require('../util/ExpressError.js')
const { listingSchema }=require('../schema.js')
const Listing=require("../MODELS/listing.js")


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=>el.message);
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

router.get("/",wrapAsync (async (req,res)=>{
    const dataList=await Listing.find({});
    console.log("home page is working")
    // console.log(dataList);
    res.render("listings/index.ejs",{dataList});
}))



//new route

router.get("/new",(req,res)=>{
    res.render("listings/form.ejs");
})

//create route

router.post("/",validateListing, wrapAsync(async (req,res,next)=>{

    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }
    let newList=new Listing(req.body.listing);
    // console.log(newList)
    await newList.save();
    res.redirect("/listHome")
   
    
}))

//edit route

router.get("/:id/edit", wrapAsync( async(req,res)=>{
    let {id}=req.params;
    let listdata= await Listing.findById(id);
    // console.log(listdata);
    res.render("listings/edit.ejs",{listdata});
}))

//update route

router.put("/:id", validateListing, wrapAsync (async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"enter valid data")
    }
    let {id}=req.params;

    let updateitem=await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true,new:true});
    console.log(updateitem);
    res.redirect("/listHome");
}))

//delete route

router.delete("/:id",wrapAsync( async (req,res)=>{
    let {id}=req.params;
    let deletedItem=await Listing.findByIdAndDelete(id);
    console.log(deletedItem);
    res.redirect("/listHome");
}))

//show route
router.get("/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id).populate("review");
    // console.log(data);
    res.render("listings/show.ejs",{data});
}))

module.exports=router;
