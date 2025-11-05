import { Inngest } from "inngest";
import User from "../models/users.model.js";
import connectDb from "./connectDb.js";
import { upsertUserStream, deleteUserStream } from "./stream.js";

export const inngest = new Inngest({
    id: "interviews-app"
});

const addUserToDb = async (userData) => {
    console.log("Syncing user data to MongoDB");
    // extract user data from event
    const { id, email_addresses, password, first_name, last_name } = userData;
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
        name: first_name && first_name + " " + last_name && last_name,
        email: email_addresses[0]?.email_address,
        password,
        clerkId: id,
        id:id,
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
        try {
            await connectDb();
            console.log("Clerk user created event received");
            console.log(event.data)
            const newUser = await addUserToDb(event.data);
            await User.create(newUser.newUser);
            upsertUserStream(newUser.newUser)
            console.log("User synced to MongoDB");
        } catch (error) {
            console.log("err syncing user to clerk or stream", error)
        }

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
        try {
            await connectDb();
            console.log("Clerk user deleted event received");

            // Logic to sync user data from Clerk to MongoDB

            const deletedUser = await User.findOneAndDelete({
                clerkId: event.data.id,
            });
            deleteUserStream(event.data.id)
            if (deletedUser) {
                console.log("User deleted from MongoDB");
            } else {
                console.log("User not found in MongoDB");
            }
        } catch (error) {
            console.log("error deleting user", error)
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
