const express=require("express");
const Ticket=require("../models/ticketModel.js")
const Event=require("../models/eventModel.js")
const User=require("../models/userModel.js")
const QRcode=require("qrcode")
const {v4:uuidv4}=require("uuid")
const crypto=require("crypto")
const Base_URL = "https://scan2enter-backend.onrender.com";
const router=express.Router();

router.post("/book",async(req,res)=>{
    try{
        const {eventId,userId}=req.body
        const event=await Event.findById(eventId)
        // checking event exist or not
        if(!event) {return res.status(404).json({message:"Event not Found"})}

        // checking user exist or not
        const user=await User.findById(userId)
        if(!user){return res.status(404).json({message:"User Not Found"})}

        //creating token
        const token=uuidv4()
        const ticketId=uuidv4()
        const qrData = `${Base_URL}/api/tickets/validate/${token}`;
        const qrCode = await QRcode.toDataURL(qrData);

        const newTicket = new Ticket({ticketId, eventId, userId, token, qrCode,status:"valid"});
        await newTicket.save();

        res.status(201).json({
            isSuccess:true,
            message:"Ticket booked successfully",
            data:newTicket,
        });

    }catch(err){
        res.status(500).json({ error: err.message });
    }
});

router.post("/validate",async(req,res)=>{
    try{
        const {token}=req.body;

        const ticket=await Ticket.findOne({token});
        if(!ticket) return res.status(404).json({message:"Ticket not found"});

        if(ticket.status!=="valid"){
            return res.status(400).json({message:"Ticket alreadly used or expired"});
        }

        //update ticket status after scanning
        ticket.status="scanned";
        await ticket.save();

        res.json({
            isSuccess:true,
            message:"Ticket validate successfully",
            data:ticket,
        })
    }catch(err){
        res.status(500).json({error:err.message});
    }
});

// GET by token (for scanning from QR)
router.get("/validate/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const ticket = await Ticket.findOne({ token }).populate("eventId userId");
    if (!ticket) {
      return res.status(404).send("<h1>❌ Ticket not found</h1>");
    }

    // If ticket already used
    if (ticket.status !== "valid") {
      return res.send(`
        <html>
          <head>
            <title>Ticket Scanned</title>
            <style>
              body { font-family: Arial; text-align: center; margin-top: 50px; }
              .card { border: 1px solid #ccc; padding: 20px; border-radius: 12px; max-width: 400px; margin: auto; }
              h2 { color: red; }
            </style>
          </head>
          <body>
            <div class="card">
              <h2>⚠ Ticket Already Used</h2>
              <p>Name: ${ticket.userId.name}</p>
              <p>Event: ${ticket.eventId.name}</p>
              <p>Status: ${ticket.status}</p>
            </div>
          </body>
        </html>
      `);
    }

    // Update ticket status to scanned
    ticket.status = "scanned";
    await ticket.save();

    res.send(`
      <html>
        <head>
          <title>Ticket Valid</title>
          <style>
            body { font-family: Arial; text-align: center; margin-top: 50px; }
            .card { border: 1px solid #ccc; padding: 20px; border-radius: 12px; max-width: 400px; margin: auto; background:#f9f9f9; box-shadow:0 4px 8px rgba(0,0,0,0.2); }
            h2 { color: green; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>✅ Ticket Validated</h2>
            <p><strong>Name:</strong> ${ticket.userId.name}</p>
            <p><strong>Phone:</strong> ${ticket.userId.phone}</p>
            <p><strong>Event:</strong> ${ticket.eventId.name}</p>
            <p><strong>Date:</strong> ${ticket.eventId.date}</p>
            <p><strong>Location:</strong> ${ticket.eventId.location}</p>
            <p><strong>Status:</strong> ${ticket.status}</p>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send("<h1>⚠ Server Error</h1>");
  }
});



//admin get all ticket

router.get("/",async(req,res)=>{
    try{
        const tickets=await Ticket.find().populate("eventId userId");
        res.json(tickets);
    } catch(err){
        res.status(500).json({error:err.message});
    }
});

// admin -get single ticket
router.get("/:id",async(req,res)=>{
    try{
        const ticket=await Ticket.findById(req.params.id).populate("eventId userId");
        if(!ticket) return res.status(404).json({message:"Ticket not found"});
        res.json(ticket);
    }catch(err){res.status(500).json({error:err.message})}
});

//admin delete ticket
router.delete("/:id",async(req,res)=>{
    try{
        const ticket =await Ticket.findByIdAndDelete(req.params.id);
        if(!ticket) return res.status(404).json({message:"Ticket not found"});
        res.json(ticket);
    }catch(err){res.status(500).json({error:err.message})};
});

module.exports=router;