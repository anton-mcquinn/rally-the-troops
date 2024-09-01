import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Use the MONGO_URI from the environment variables
    const mongoURI = process.env.MONGO_URI as string;

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      process.exit(1); // Exit process with failure
    } else {
      console.error("An unexpected error occurred");
      process.exit(1); // Exit process with failure
    }
  }
};

export default connectDB;
