const mongoose=require("mongoose")



const venueSchema = new mongoose.Schema({
    title:{
        type:String,
        // required:true
    },
    place:{
        type:String,
         // required:true
    },
    maximumSeats:{
        type:Number,
        // required:true
    },
    images:{
        type:Array
    },
    Facilities:{
        type:Array
    },
    price: {
        type:Number
    },
    available:{
        type:Boolean,
        default:true
    },
    mapUrl:{
        type:String
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "organizer",
    }
})

const venue = mongoose.model("venue", venueSchema);

module.exports = venue;