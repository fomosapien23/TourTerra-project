const User= require("../MODELS/user.js");

module.exports.renderSignupForm= (req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signup=  async (req,res)=>{

    try{
        let {username , password , email }= req.body;

        let newuser= new User({
            email:email,
            username:username,
        })

        let registeredUser= await User.register(newuser,password);
        console.log(registeredUser);

        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }

            req.flash("success","Welcome! SignUp Succesfully")
            return res.redirect("/listHome"); 
        })
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect("/signup")
    }
    

}

module.exports.renderLoginForm=(req,res)=>{
    res.render("user/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","welcome back to TourTerra! Login Successfully ");
    const redirectUrl = res.locals.redirectUrl || '/listHome'; 
    console.log(redirectUrl); 
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }else{
            req.flash("success","Logged you out!")
            res.redirect("/listHome");
        }
    })
}