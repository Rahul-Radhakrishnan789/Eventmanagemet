const express=require('express')
const mongoose=require('mongoose')
const app=express()
const http = require('http');
const morgan = require("morgan")
const path = require('path')
const port = 3000
const cors=require("cors")
const dotenv=require ("dotenv")
//
const { Server } = require("socket.io");

const chatMessage = require("./model/chatSchema")

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(morgan("dev"))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))  
dotenv.config()



async function main() {
  await mongoose.connect("mongodb://127.0.0.1/mongoconnection");
  console.log("db connected");
}
main().catch((err) => console.log(err))

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});





io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`user with ID: ${socket.id} joined room: ${data}`)
  })

  socket.on("disconnect", () => {
      console.log("User disconnected",socket.id)
  });

  socket.on('send_message', async (data) => {
    try {
      const newMessage = new chatMessage({
        room: data.room,
        sender: data.author,
        reciever:data.reciever,
        message: data.message,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
        
      });
      await newMessage.save();
      console.log('Message saved to MongoDB:', newMessage);
    } catch (error) {
      console.error('Error saving message to MongoDB:', error);
    }

   
    socket.to(data.room).emit('receive_message', data);
  });
  
}); 

app.get('/api/messages/:userId', async (req, res) => {
  try {
   
    const userId = req.params.id;
    const messages = await chatMessage.find({userId});
    res.json(messages);
    console.log('messages',messages)
  } catch (error) {
    console.error('Error fetching messages from MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




const userRoute=require("./routes/userRoute")
app.use("/api",userRoute)

const organizerRoute=require("./routes/organizerRoute")
app.use("/api",organizerRoute)

const adminRoute=require("./routes/adminRoute")
app.use("/api",adminRoute)

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })