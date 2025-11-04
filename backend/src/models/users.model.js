import mongoose from "mongoose";

const usersModel = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    clerkId: { type: String, required: true, unique: true },
},{timestamps: true})

export default mongoose.model('Users', usersModel);