import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

// Use your Railway MONGO_URI if available, otherwise fallback to local
const MONGO_URI =
    "mongodb://mongo:TRdqyCLVIfmsFKIuHjABeiCcJTOcIcGS@mongodb.railway.internal:27017";

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["super_admin", "client_admin", "client_viewer"],
            default: "client_viewer",
        },
        isActive: { type: Boolean, default: true },
    },
    { collection: "users" },
);

const User = mongoose.model("User", UserSchema);

async function createAdmin() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected successfully.");

        const adminExists = await User.findOne({ role: "super_admin" });
        if (adminExists) {
            console.log("A Super Admin already exists in the database.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("AdminPass123!", 10);

        const newAdmin = new User({
            username: "super_admin",
            email: "admin@owlpi.com",
            password: hashedPassword,
            role: "super_admin",
            isActive: true,
        });

        await newAdmin.save();
        console.log("-----------------------------------------");
        console.log("SUCCESS: Super Admin created!");
        console.log("Username: super_admin");
        console.log("Password: AdminPass123!");
        console.log("-----------------------------------------");
    } catch (error) {
        console.error("Error creating Super Admin:", error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

createAdmin();
