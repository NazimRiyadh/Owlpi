import mongoose from "mongoose";
import securityUtils from "../utils/securityUtils.js";
import bcrypt from "bcryptjs";

const schemaDefinition = {
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        validate: {
            validator: function (username) {
                return /^[a-zA-Z0-9_.-]+$/.test(username);
            },
            message: "Please enter a valid username",
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: "Please enter a valid email",
        },
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        validator: function (password) {
            if (
                this.isModified("password") &&
                password &&
                !password.startsWith("$2a$")
            ) {
                const validation = securityUtils.passwordValidate(password);
                return validation.success;
            }
            return true;
        },
        message: function (props) {
            if (props.value && !props.value.startsWith("$2a$")) {
                const validation = securityUtils.passwordValidate(props.value);
                return validation.errors.join(". ");
            }
            return "Password validation failed";
        },
    },

    role: {
        type: String,
        enum: ["super_admin", "client_admin", "client_viewer"],
        default: "client_viewer",
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: function () {
            return this.role !== "super_admin";
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    permissions: {
        canCreateApiKeys: {
            type: Boolean,
            default: false,
        },
        canManageUsers: {
            type: Boolean,
            default: false,
        },
        canViewAnalytics: {
            type: Boolean,
            default: true,
        },
        canExportData: {
            type: Boolean,
            default: false,
        },
    },
};

const userSchema = new mongoose.Schema(schemaDefinition, {
    timestamps: true,
    collection: "users",
});

// DB middleware -> Hash password before saving, prevents password saving without hashing
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Indexes for efficient querying, B-tree indexing
userSchema.index({ clientId: 1, isActive: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model("User", userSchema);
export default User;
