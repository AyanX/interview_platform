import { Inngest } from "inngest";
import User from "../models/users.model.js";
import connectDb from "./connectDb.js";

export const inngest = new Inngest({
    id: "interviews-app"
});

const addUserToDb = async (userData) => {
    console.log("Syncing user data to MongoDB");
    // extract user data from event
    const { id, email, name, clerkId, password } = userData;
    // check if user already exists
    let user = await User.findOne({
        clerkId: id,
    });
    if (user) {
        console.log("User already exists in MongoDB");
        return 
    }
    // create new user
    const newUser = new User({
        name,
        email,
        password,
        clerkId: id,
    });
    console.log("New user created:", newUser);
    // return new user
    return {
        newUser,
        created: true,
    };
};

const syncUser = inngest.createFunction(
    {
        id: "sync-user",
    },
    {
        event: "clerk/user.created",
    },
    async ({ event }) => {
            await connectDb();
            console.log("Clerk user created event received");
            console.log(event.data)
            const newUser = await addUserToDb(event.data);
            await User.create(newUser.newUser);
            console.log("User synced to MongoDB");
     
    }
    // Logic to sync user data from Clerk to MongoDB
);



const deleteUser = inngest.createFunction(
    {
        id: "delete-user",
    },
    {
        event: "clerk/user.deleted",
    },
    async ({ event }) => {
        await connectDb();
        console.log("Clerk user deleted event received");

        // Logic to sync user data from Clerk to MongoDB

        const deletedUser = await User.findOneAndDelete({
            clerkId: event.data.id,
        });
        if (deletedUser) {
            console.log("User deleted from MongoDB");
        } else {
            console.log("User not found in MongoDB");
        }
    }
    // Logic to sync user data from Clerk to MongoDB
);

const updateUserInDb = async (userData) => {
    const { id, email, name } = userData;
    const updated = await User.findOneAndUpdate(
        { clerkId: id },
        { name, email }
    );
    return updated;
};

const syncUserUpdate = inngest.createFunction(
    {
        id: "update-user",
    },
    {
        event: "clerk/user.updated",
    },
    async ({ event }) => {
        await connectDb();

        // Logic to update user data from Clerk to MongoDB

        console.log("Clerk user updated event received");
        // if no updatedUser,
        const updatedUser = await updateUserInDb(event.data);
        if (updatedUser) {
            console.log("User updated in MongoDB");
        } else {
            console.log("User not found in MongoDB");
        }
    }
);

export const functions = [syncUser,
    deleteUser,
    syncUserUpdate,]
