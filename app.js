const express =require ("express");
const app =express();
const mongoose =require("mongoose");
const path=require("path");
const port =1080;
const Listing=require("./MODELS/listing.js")
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const wrapAsync=require('./util/wrapAsync.js')
const ExpressError=require('./util/ExpressError.js')
const {listingSchema}=require('./schema.js')

app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);

main().then(res=>{
    console.log("database connected")
}).catch(err=>{
    console.log(err)
})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

// app.get("/checklist",(req,res)=>{
//     const list1= new Listing({
//         title:"maharani fort",
//         description:"A historical palace ",
//         price:15000,
//         location:"Rajasthan",
//         country:"India"
//     })

//     list1.save().then(res=>{
//         console.log(res)
//     }).catch(err=>{
//         console.log(err)
//     })
//     res.send("list is saved in database");
// })

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=>el.message);
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

app.get("/listHome",wrapAsync (async (req,res)=>{
    const dataList=await Listing.find({});
    console.log("home page is working")
    // console.log(dataList);
    res.render("listings/index.ejs",{dataList});
}))

//new route

app.get("/listHome/new",(req,res)=>{
    res.render("listings/form.ejs");
})

//create route

app.post("/listHome",validateListing, wrapAsync(async (req,res,next)=>{

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

app.get("/listHome/:id/edit", wrapAsync( async(req,res)=>{
    let {id}=req.params;
    let listdata= await Listing.findById(id);
    // console.log(listdata);
    res.render("listings/edit.ejs",{listdata});
}))

//update route

app.put("/listHome/:id", validateListing, wrapAsync (async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"enter valid data")
    }
    let {id}=req.params;

    let updateitem=await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true,new:true});
    console.log(updateitem);
    res.redirect("/listHome");
}))

//delete route

app.delete("/listHome/:id",wrapAsync( async (req,res)=>{
    let {id}=req.params;
    let deletedItem=await Listing.findByIdAndDelete(id);
    console.log(deletedItem);
    res.redirect("/listHome");
}))


app.get("/listHome/:id", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    // console.log(data);
    res.render("listings/show.ejs",{data});
}))


app.all("*",(req,res,next)=>{
    next( new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message='something went wrong'}=err;
    res.status(statusCode).render('error.ejs',{message});
})


app.listen(port,()=>{
    console.log("server listening");
})

app.get("/",(req,res)=>{
    res.send("working")
})