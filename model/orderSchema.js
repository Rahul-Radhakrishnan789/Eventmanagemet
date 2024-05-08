const mongoose=require("mongoose")



const orderSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    totalTickets:{
        type:Number,
    },
    totalAmount:{
        type:Number,
    },
    event:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"event"
    },
    razorpay_payment_id:{
        type:String
    },
    isCancelled:{
        type:Boolean,
        default:false
    }
    


})

const order=mongoose.model('order',orderSchema)

module.exports=order