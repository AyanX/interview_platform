import mongoose from 'mongoose';
import env from './env.js';

async function connectDb() {
    try {
        mongoose.connect(env.DB_URL)
        const conn = mongoose.connection;

        conn.on('connected', () => {
            console.log('Interviews database connected successfully');
        })
        conn.on('error', (err) => {
            console.log('Interviews database connection failed: ' + err.message);
        })
    } catch (error) {
        console.log('Interviews database connection failed: ' + error.message);
        process.exit(1);
    }
}

export default connectDb;