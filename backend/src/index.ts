import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';
dotenv.config();
// Connect to the database
connectDB();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

