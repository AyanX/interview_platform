import { requireAuth } from "@clerk/express";
import usersModel from "../models/users.model.js";

export const protectedRoute = [
  ()=>{console.log("Protected route middleware invoked");},
  requireAuth(),
  async(req,res,next)=>{
    try {
        const userId = req.auth().id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await usersModel.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }   
        req.user = user;
        next();
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
  }
]
