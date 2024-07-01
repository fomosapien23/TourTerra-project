const Listing = require("../MODELS/listing")
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const dataList = await Listing.find({});
    console.log("home page is working")
    // console.log(dataList);
    res.render("listings/index.ejs", { dataList });
}

module.exports.renderNewForm = (req, res) => {
    // console.log(req.user) //to see user info

    res.render("listings/form.ejs");

}

module.exports.createListing = async (req, res, next) => {

    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send()

    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url," --- ", filename);
    let newList = new Listing(req.body.listing);
    newList.owner = req.user._id;
    newList.image = { url, filename };
    newList.geometry = response.body.features[0].geometry;
    // console.log(newList)
    await newList.save();
    req.flash("success", "New Listing is Created!")
    res.redirect("/listHome")


}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listdata = await Listing.findById(id);
    console.log(listdata);
    if (!listdata) {
        req.flash("error", "Listing you are requested for doesn't exist")
        res.redirect("/listHome");
    } else {
        let originalImgUrl = listdata.image.url;
        originalImgUrl = originalImgUrl.replace("/upload", "/upload/w_300")
        res.render("listings/edit.ejs", { listdata, originalImgUrl });
    }
}

module.exports.updateListing = async (req, res, next) => {
    const { id } = req.params;
    const { listing } = req.body;

    if (!listing) {
        throw new ExpressError(400, "Invalid data: Listing data missing");
    }

    try {
        // Perform geocoding to get coordinates based on location
        const response = await geocodingClient.forwardGeocode({
            query: listing.location,
            limit: 1
        }).send();

        if (!response || !response.body || !response.body.features || !response.body.features.length) {
            throw new ExpressError(400, "Location not found or geocoding error");
        }

        // Update listing with new data including geometry
        const newGeometry = response.body.features[0].geometry;
        const updatedListing = await Listing.findByIdAndUpdate(id, { ...listing, geometry: newGeometry }, { new: true });

        if (!updatedListing) {
            throw new ExpressError(404, "Listing not found");
        }

        // Handle image upload if provided
        if (req.file) {
            const { path, filename } = req.file;
            updatedListing.image = { url: path, filename };
            await updatedListing.save();
        }

        req.flash("success", "Listing updated successfully");
        res.redirect(`/listHome/${id}`);
    } catch (err) {
        // Handle errors
        if (err.name === "ValidationError") {
            req.flash("error", "Validation Error: Please check your input fields");
        } else if (err.name === "CastError") {
            req.flash("error", "Invalid ID: Listing not found");
        } else {
            req.flash("error", "Error updating listing");
        }
        res.redirect(`/listHome/${id}/edit`);
    }
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedItem = await Listing.findByIdAndDelete(id);
    console.log(deletedItem);
    req.flash("success", "Listing is Deleted!")
    res.redirect("/listHome");
}

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate({ path: "review", populate: { path: "author" }, }).populate("owner");
    // console.log(data);
    if (!data) {
        req.flash("error", "Listing you are requested for doesn't exist")
        res.redirect("/listHome")
    } else {
        res.render("listings/show.ejs", { data });
    }
}


module.exports.showCategory = async(req,res) =>{
    let { categoryId } = req.params;
    // console.log(categoryId)
    let dataList=await Listing.find({categories: categoryId});
    // console.log(dataList)
    if (!dataList && dataList.length==0) {
        req.flash("error", "Listing you are requested for doesn't exist")
        res.redirect("/listHome")
    } else {
        res.render("listings/index.ejs", { dataList });
    }


}

module.exports.searchListings = async (req, res) => {
    const { searchKey } = req.query;
    console.log(searchKey)
    const searchQuery = new RegExp(searchKey, 'i'); // 'i' makes it case-insensitive

    let dataList = await Listing.find({
        $or: [
            { title: searchQuery },
            { description: searchQuery },
            { location: searchQuery },
            { country: searchQuery }
        ]
    });

    if (!dataList || dataList.length === 0) {
        req.flash("error", "No listings found matching your search criteria");
        return res.redirect("/listHome");
    } else {
        res.render("listings/index.ejs", { dataList });
    }
};