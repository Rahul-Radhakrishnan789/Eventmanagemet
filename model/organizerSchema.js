const mongoose=require("mongoose")



const organizerSchema=new mongoose.Schema({
    username:{
        type:String,
        // required:true
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    contactNumber:{
        type:String,
    },
    
})

const organizer=mongoose.model('organizer',organizerSchema)

module.exports=organizer