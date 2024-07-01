require('dotenv').config()
// console.log(process.env) 

const express =require ("express");
const app =express();
const mongoose =require("mongoose");
const path=require("path");
const port =8080;
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError=require('./util/ExpressError.js')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport=require("passport")
const localStrategy= require("passport-local")
const User=require("./MODELS/user.js")

const listingRouter =require("./routes/listing.js")
const reviewRouter =require("./routes/review.js");
const userRouter =require("./routes/user.js");
const { resolveAny } = require("dns");

app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);

// const mongo_url='mongodb://127.0.0.1:27017/wonderlust';
const dbUrl= process.env.ATLASDB_URL;

main().then(res=>{
    console.log("database connected") 
}).catch(err=>{
    console.log(err)
})



async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,

})

store.on("error", ()=>{
    console.log("ERROR In MONGO SESSION STORE", err)
});

const sessionOptions={
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.use("/listHome",listingRouter);
app.use("/listHome/:id/review",reviewRouter);
app.use("/",userRouter);


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

// app.get("/",(req,res)=>{
//     res.send("working")
// })