import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { UserModel } from './auth-service/UserModel';

dotenv.config();

async function updateRole() {
    if (!process.env.MONGODB_URI) {
        console.error("No MONGODB_URI");
        return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Update existing user
    let result = await UserModel.findOneAndUpdate(
        { email: 'test@nexusshop.com' }, 
        { role: 'admin' }, 
        { new: true }
    );
    
    console.log("Updated user:", result);
    await mongoose.disconnect();
}

updateRole().catch(console.error);
