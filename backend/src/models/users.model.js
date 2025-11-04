import mongoose from "mongoose";

const usersModel = new mongoose.Schema({
    name: { type: String},
    email: { type: String, unique: true },
    password: { type: String },
    clerkId: { type: String, unique: true },
},{timestamps: true})

export default mongoose.model('users', usersModel);