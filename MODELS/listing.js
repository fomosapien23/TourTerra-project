const mongoose =require("mongoose");
const {Schema}=mongoose
const Review=require("./review.js")
const User=require("./user.js")

const listSchema= Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        url:String,
        filename:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
})

listSchema.post('findOneAndDelete', async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: { $in : listing.review}})
    }
});

const Listing=mongoose.model("Listing",listSchema);

module.exports=Listing;