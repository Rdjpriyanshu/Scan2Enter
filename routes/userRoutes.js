const express=require("express")
const User=require("../models/userModel.js")
const router=express.Router()

router.post("/register",async(req,res)=>{
    try{
        const {name,phone}=req.body;
        const newUser=new User({name,phone})
        await newUser.save()
        res.status(201).json({
            isSuccess:true,
            message:"User registered successfully",
            data:{id:newUser._id,name:newUser.name,phone:newUser.phone}
        });
    } catch(err){res.status(500).json({error:err.message})}
})

router.get("/",async(req,res)=>{
    try{
         const user=await User.find()
         res.json(user)
    }catch(err){
        res.status(500).json({error:err.message});
    }
})

module.exports = router;