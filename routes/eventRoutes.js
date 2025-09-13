const express=require("express");

const Event=require("../models/eventModel.js");
const router=express.Router();

// for creating events
router.post("/",async(req,res)=>{
    try{
        const {name,date,location,capacity}=req.body;
        const newEvent=new Event({name,date,location,capacity})
        await newEvent.save();
        res.status(201).json({
            isSuccess:true,
            message:"Created successfully",
            data:{newEvent}
        })
    }catch(err){
      // eid  68baef9de3e8e61e4a177dce    uid 68baeffa1f431f9c63c156c2
      res.status(500).json({ error: err.message });
    }
});

// fetch all events
router.get("/",async(req,res)=>{
    try{
        const events=await Event.find()
        res.json(events);

    }catch(err){
        res.status(500).json({error:err.message});
    }
});

// fetch the events by id
router.get("/:id",async(req,res)=>{
    try{
        const events=await Event.findById(req.params.id)
        if(!events){
            res.status(404).json({
                isSuccess:false,
                message:"Event not found",
                data:{}
            });
        }
        res.json(events);
    }catch(err){
        res.status(500).json({error:err.message})
    }
});

// update the events
router.put("/:id",async(req,res)=>{
    try{
        const {name,date,location,capacity}=req.body;
        const updateEvents = await Event.findByIdAndUpdate(req.params.id, {
          name,
          date,
          location,
          capacity,
        },
        {new:true}
    );

    if(!updateEvents){
        res.status(404).json({
            isSuccess:false,
            message:"Event not found",
            data:{}
        })
    }
    res.status(200).json({
        isSuccess:true,
        message:"Event Updated Successfully",
        data:{}
    })
}catch(err){
        res.status(500).json({error:err.message})
    }
});

// deleting the events.js
router.delete("/:id",async(req,res)=>{
    try{
        const deleteEvent=await Event.findByIdAndDelete(req.params.id);
        if(!deleteEvent){
        res.status(404).json({
            isSuccess:false,
            message:"Event Not Found",
            data:{}
        })
    }
    res.status(200).json({
        isSuccess:true,
        message:"Event is Deleted ",
        data:{}
    })
    }catch(err){
       res.status(500).json({ error: err.message });
    }
})

module.exports=router;


