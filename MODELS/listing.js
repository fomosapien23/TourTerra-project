const mongoose =require("mongoose");

const listSchema= mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        type:String,
        default:"https://img.freepik.com/free-photo/beautiful-shot-small-lake-with-wooden-rowboat-focus-breathtaking-clouds-sky_181624-2490.jpg?t=st=1716800684~exp=1716804284~hmac=b88f4e808b794812f84065c4c227857c9c3bb4f3d5dcbb3ff4a1207696b66d85&w=996",
        set: (v)=> v===""?"https://img.freepik.com/free-photo/beautiful-shot-small-lake-with-wooden-rowboat-focus-breathtaking-clouds-sky_181624-2490.jpg?t=st=1716800684~exp=1716804284~hmac=b88f4e808b794812f84065c4c227857c9c3bb4f3d5dcbb3ff4a1207696b66d85&w=996":v,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    }
})

const Listing=mongoose.model("Listing",listSchema);

module.exports=Listing;