import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://unrealengine456_db_user:<Mdsaad@mongodb456>@cluster0.kuwrdhq.mongodb.net/?appName=Cluster0");

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Database Connection Error:", error.message);
        process.exit(1);
    }
};

export default connectDB;