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
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    categories: {
        type: [String],
        enum: ['Beachfront', 'Iconic cities', 'Historical place', 'Farm', 'Countryside', 'Lake view', 'Swimming pools', 'Top of the world','Treehouse']
    }
    
})

listSchema.post('findOneAndDelete', async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: { $in : listing.review}})
    }
});

const Listing=mongoose.model("Listing",listSchema);

module.exports=Listing;