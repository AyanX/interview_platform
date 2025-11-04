import {
    createServer
} from 'http';
import app from "./app.js";
import env from './lib/env.js';
import connectDb from './lib/connectDb.js';
const PORT = env.PORT;


const server = createServer(app)

async function startServer() {
    try {
        await connectDb();
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log('Error starting server and db: ' + e.message);
        process.exit(1);
    }
}

startServer();