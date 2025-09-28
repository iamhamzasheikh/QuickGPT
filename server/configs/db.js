import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('Database is connected')
        });

        mongoose.connection.on('error', (error) => {
            console.log("MongoDB connection error:", error.message)
        })

        await mongoose.connect(`${process.env.MONGODB_URI}/quickgpt`)

    } catch (error) {
        console.log(error.message)
    }
}

export default connectDB;