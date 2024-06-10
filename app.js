const express =require ("express");
const app =express();
const mongoose =require("mongoose");
const path=require("path");
const port =1080;
const Listing=require("./MODELS/listing.js")
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

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

app.get("/checklist",(req,res)=>{
    const list1= new Listing({
        title:"maharani fort",
        description:"A historical palace ",
        price:15000,
        location:"Rajasthan",
        country:"India"
    })

    list1.save().then(res=>{
        console.log(res)
    }).catch(err=>{
        console.log(err)
    })
    res.send("list is saved in database");
})

app.get("/listHome",async (req,res)=>{
    const dataList=await Listing.find({});
    console.log("home page is working")
    // console.log(dataList);
    res.render("listings/index.ejs",{dataList});
})

//new route

app.get("/listHome/new",(req,res)=>{
    res.render("listings/form.ejs");
})

//create route

app.post("/listHome",async (req,res)=>{
    let newList=new Listing(req.body.listing);
    // console.log(newList)
    await newList.save();
    res.redirect("/listHome")
})

//edit route

app.get("/listHome/:id/edit", async(req,res)=>{
    let {id}=req.params;
    let listdata= await Listing.findById(id);
    // console.log(listdata);
    res.render("listings/edit.ejs",{listdata});
})

//update route

app.put("/listhome/:id", async(req,res)=>{
    let {id}=req.params;

    let updateitem=await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true,new:true});
    console.log(updateitem);
    res.redirect("/listHome");
})

//delete route

app.delete("/listHome/:id",async (req,res)=>{
    let {id}=req.params;
    let deletedItem=await Listing.findByIdAndDelete(id);
    console.log(deletedItem);
    res.redirect("/listHome");
})


app.get("/listHome/:id",async (req,res)=>{
    let {id}=req.params;
    let data=await Listing.findById(id);
    // console.log(data);
    res.render("listings/show.ejs",{data});
})







app.listen(port,()=>{
    console.log("server listening");
})

app.get("/",(req,res)=>{
    res.send("working")
})