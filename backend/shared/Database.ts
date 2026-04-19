import mongoose from 'mongoose';

const DatabaseConnection = {
    connect: async (uri: string): Promise<void> => {
        await mongoose.connect(uri);
        console.log("MongoDB connected");
    }
};

export default DatabaseConnection;
