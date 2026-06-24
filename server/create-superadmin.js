import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const MONGO_URI =
    process.env.MONGO_URI ||
    "mongodb://localhost:27017/api_monitoring_system";
const ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

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
    if (!ADMIN_PASSWORD) {
        console.error(
            "SUPER_ADMIN_PASSWORD is required. Set it in server/.env before running this script.",
        );
        process.exit(1);
    }

    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected successfully.");

        const adminExists = await User.findOne({ role: "super_admin" });
        if (adminExists) {
            console.log("A Super Admin already exists in the database.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

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
        console.log("Password: (value from SUPER_ADMIN_PASSWORD)");
        console.log("-----------------------------------------");
    } catch (error) {
        console.error("Error creating Super Admin:", error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

createAdmin();
