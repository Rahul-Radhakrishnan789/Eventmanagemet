const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
 sender:{
  type: mongoose.Schema.Types.ObjectId,
  ref:'user'
 },
 reciever:{
  type: mongoose.Schema.Types.ObjectId,
  ref:'organizer'
 },
 message:{
  type:String,
 },
 time:{
  type:String
 }
});

 const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

 module.exports = ChatMessage;