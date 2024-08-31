import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Replace <username>, <password>, <database_name> with your actual credentials
        const mongoURI = 'mongodb://test:test@127.0.0.1:27017/rally-the-troops?authSource=rally-the-troops';

const conn = await mongoose.connect(mongoURI);

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            process.exit(1); // Exit process with failure
        } else {
            console.error('An unexpected error occurred');
            process.exit(1); // Exit process with failure
        }
    }
};

export default connectDB;
