const mongoose =require("mongoose");
const Listing=require("../MODELS/listing.js")
const initData=require("../init/data.js");

main().then(res=>{
    console.log("database connected")
}).catch(err=>{
    console.log(err)
})

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}


const initDB = async ()=>{
    // await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data is initialized");
}

initDB();