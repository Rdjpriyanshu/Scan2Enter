require('dotenv').config();
const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors")
const http=require("http")
require("./db.js")
const eventroutes=require("./routes/eventRoutes.js");
const userRoutes=require("./routes/userRoutes.js")
const ticketRoutes=require("./routes/ticketRoutes.js")
const {Server}=require("socket.io")

const app=express();
const server=http.createServer(app);

const io = new Server(server, {
  cors: { origin: "https://scan2-enter-frontend.vercel.app/" },
});

// MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use("/api/events",eventroutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets",ticketRoutes);


server.listen(3000, () =>
  console.log(`🚀 Server running on http://localhost:${3000}`)
);

io.on("connection",(socket)=>{
    console.log(`New Client Connected`)
    socket.on("disconnect",()=>console.log("Client disconnected"));
});
module.exports=io;