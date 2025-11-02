import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
    DB_URL: process.env.DB_URL ,
};