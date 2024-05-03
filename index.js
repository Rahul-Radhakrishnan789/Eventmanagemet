const express=require('express')
const mongoose=require('mongoose')
const app=express()
// const http = require('http');
const morgan = require("morgan")
const path = require('path')
const port = 3000
const cors=require("cors")
const dotenv=require ("dotenv")
//
// const { Server } = require("socket.io");

// const chatMessage = require("./model/chatSchema")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(morgan("dev"))
app.use('uploads', express.static(path.join(__dirname, 'uploads')))  
dotenv.config()



async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/eventmanagement");
  console.log("db connected");
}
main().catch((err) => console.log(err))

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });





// io.on("connection", (socket) => {


//   socket.on("join_room", (data) => {
//       socket.join(data);
    
//   })

//   socket.on("disconnect", () => {
    
//   });

//   socket.on('send_message', async (data) => {
//     try {
//       const newMessage = new chatMessage({
//         sender: data.userId,
//         reciever:data.reciever,
//         message: data.message,
//         time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
        
//       });
//       await newMessage.save();
//       console.log('Message saved to MongoDB:', newMessage);
//     } catch (error) {
//       console.error('Error saving message to MongoDB:', error);
//     }

   
//     socket.to(data.room).emit('receive_message', data);
//   });
  
// }); 

// app.get('/api/messages', async (req, res) => {
//   try {

//     const messages = await chatMessage.find({}).populate('sender');

//     res.status(200).json({messages:messages});

  
//   } catch (error) {
//     console.error('Error fetching messages from MongoDB:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });




const userRoute=require("./routes/userRoute")
app.use("/api",userRoute)

const organizerRoute=require("./routes/organizerRoute")
app.use("/api",organizerRoute)

const adminRoute=require("./routes/adminRoute")
app.use("/api",adminRoute)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })