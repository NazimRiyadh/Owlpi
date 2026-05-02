import mongoose from "mongoose";

/** User Schema - Represents a user in the system with authentication and role-based access control.
 * Each user can be associated with a client (except super_admin) and has specific permissions.
 * Passwords are hashed before saving to the database for security.
 *
 * @type {import("mongoose").SchemaDefinition}
 */
const userSchema = new mongoose.Schema(
    {
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
                    const validation = SecurityUtils.validatePassword(password);
                    return validation.success;
                }
                return true;
            },
            message: function (props) {
                if (props.value && !props.value.startsWith("$2a$")) {
                    const validation = SecurityUtils.validatePassword(
                        props.value,
                    );
                    // ["Password is required", "Password must contain at least one uppercase letter"]
                    // "Password is required. Password must contain at least one uppercase letter."
                    return validation.errors.join(". ");
                }
                return "Password validation failed";
            },
        },

        ole: {
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
    },
    {
        timestamps: true,
        collection: "users",
    },
);

// DB middleware -> Hash password before saving, prevents password saving without hashing
userSchema.pre("save", async (next) => {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Indexes for efficient querying, B-tree indexing
userSchema.index({ clientId: 1, isActive: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model("User", userSchema);
export default User;
