import  { StreamChat}  from "stream-chat"
import env from './env.js';


export const client = StreamChat.getInstance(env.STREAM_API_KEY,env.STREAM_API_SECRET)

export const upsertUserStream= async(userData)=>{
    try {
       await client.upsertUser(userData)
    } catch (error) {
        console.log("error upserting user to Stream", error)
    }
}

export const deleteUserStream= async(userId)=>{
    try {
       await client.deleteUser(userId)
    } catch (error) {
        console.log("error deleting user from Stream", error)
    }
}