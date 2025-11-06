import express from 'express';
const app = express();
import path from 'path';
import env from './lib/env.js';
import bodyParser from 'body-parser';
import { functions, inngest } from './lib/inggest.js';
import { clerkMiddleware } from '@clerk/express'
import { serve} from 'inngest/express';
import { protectedRoute } from './middlewares/protectedRoute.js';
import cors from 'cors';
//add auth to req obj
app.use(clerkMiddleware())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'http://localhost:3000', // must match your frontend origin
    credentials: true, // allow cookies/auth headers
  })
);

app.use("/api/inngest", serve({client:inngest,functions:functions}));


app.get("/home", (req, res) => {
    console.log("Home route accessed");
    return res.send({ message: "Welcome to the interview platform API!" });
});
app.get("/health", (req, res) => {
   return res.send({ status: 'OK' });
});

app.get("/protected",protectedRoute,(req,res)=>{
    console.log(" Protected route accessed by user:", req.user);
    res.send({ message: `Hello ${req.user.name}, you have accessed a protected route!` });
});

if (env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get("/{*any}", (req, res) => {
       return res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
    });
}

export default app;