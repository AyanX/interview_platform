import express from 'express';
const app = express();
import path from 'path';
import env from './lib/env.js';
import bodyParser from 'body-parser';
import { functions, inngest } from './lib/inggest.js';
import { clerkMiddleware } from '@clerk/express'
import { serve} from 'inngest/express';
import cors from 'cors';
app.use(cors({
    credentials: true,
}))
app.use(clerkMiddleware())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/inngest", serve({client:inngest,functions:functions}));

app.get("/health", (req, res) => {
    res.send("API is running....");
});

if (env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get("/{*any}", (req, res) => {
       return res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
    });
}

export default app;