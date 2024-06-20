const express =require ("express");
const app =express();
const mongoose =require("mongoose");
const path=require("path");
const port =1080;
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError=require('./util/ExpressError.js')

const listings =require("./routes/listing.js")
const reviews =require("./routes/review.js")

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

app.use("/listHome",listings);
app.use("/listHome/:id/review",reviews);


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