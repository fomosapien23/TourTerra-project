const Listing=require("../MODELS/listing")

module.exports.index=async (req,res)=>{
    const dataList=await Listing.find({});
    console.log("home page is working")
    // console.log(dataList);
    res.render("listings/index.ejs",{dataList});
}

module.exports.renderNewForm=(req,res)=>{
    // console.log(req.user) //to see user info
    
        res.render("listings/form.ejs");
        
}

module.exports.createListing=async (req,res,next)=>{

    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }

    let url=req.file.path;
    let filename =req.file.filename;
    // console.log(url," --- ", filename);
    let newList=new Listing(req.body.listing);
    newList.owner= req.user._id;
    newList.image={ url, filename};
    // console.log(newList)
    await newList.save();
    req.flash("success","New Listing is Created!")
    res.redirect("/listHome")
   
    
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let listdata= await Listing.findById(id);
    console.log(listdata);
    if(!listdata){
        req.flash("error","Listing you are requested for doesn't exist")
        res.redirect("/listHome");
    }else{
        let originalImgUrl=listdata.image.url;
        originalImgUrl= originalImgUrl.replace("/upload", "/upload/w_300")
        res.render("listings/edit.ejs",{ listdata , originalImgUrl});
    }
}

module.exports.updateListing=async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"enter valid data")
    }
    let {id}=req.params;

    let updateList=await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true,new:true});

    if(typeof req.file !="undefined"){
        let url=req.file.path;
        let filename =req.file.filename;
        updateList.image={ url, filename};
        updateList.save();
    }
    
    console.log(updateList);
    req.flash("success","Listing is Updated!")
    res.redirect(`/listHome/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedItem=await Listing.findByIdAndDelete(id);
    console.log(deletedItem);
    req.flash("success","Listing is Deleted!")
    res.redirect("/listHome");
}

module.exports.showListings=async (req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id).populate({path :"review" ,populate: {path : "author"}, }).populate("owner");
    // console.log(data);
    if(!data){
        req.flash("error","Listing you are requested for doesn't exist")
        res.redirect("/listHome")
    }else{
        res.render("listings/show.ejs",{data});
    }
}