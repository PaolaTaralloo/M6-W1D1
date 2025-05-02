import mongoose from 'mongoose';
import "dotenv/config"; // Import dotenv to load environment variables


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}
export default connectDB;