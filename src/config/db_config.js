
import mongoose from "mongoose";


export const connectDB = async () => {
    const db_url = process.env.MONGO_DB_URI;
    try {
        await mongoose.connect(db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(" 💚💚Connected to MongoDB");
    } catch (error) {
        console.error(" ⚠ Error connecting to MongoDB:", error);
        process.exit(1);
    }
};