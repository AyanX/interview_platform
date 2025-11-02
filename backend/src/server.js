import {
    createServer
} from 'http';
import app from "./app.js";
import env from './lib/env.js';
const PORT = env.PORT;
const server = createServer(app)

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});