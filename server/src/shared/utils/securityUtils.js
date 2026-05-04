import crypto from "crypto";
class securityUtils {
    // Password requirements can be configured via environment variables
    static PASSWORD_REQUIREMENTS = {
        minLength: (() => {
            const value = Number.parseInt(
                process.env.PASSWORD_MIN_LENGTH ?? "8",
                10,
            );
            return Number.isInteger(value) && value > 0 ? value : 8;
        })(),
        requireUppercase:
            (process.env.PASSWORD_REQUIRE_UPPERCASE || "true") === "true",
        requireLowercase:
            (process.env.PASSWORD_REQUIRE_LOWERCASE || "true") === "true",
        requireNumbers:
            (process.env.PASSWORD_REQUIRE_NUMBERS || "true") === "true",
        requireSymbols:
            (process.env.PASSWORD_REQUIRE_SYMBOLS || "true") === "true",
    };

    static passwordValidate(password) {
        const errors = [];

        const requirements = this.PASSWORD_REQUIREMENTS;

        if (!password) {
            return {
                success: false,
                errors: ["Password required"],
            };
        }

        if (password.length < requirements.minLength) {
            errors.push(
                `Password must be at least ${requirements.minLength} chars long!`,
            );
        }

        if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter");
        }

        if (requirements.requireLowercase && !/[a-z]/.test(password)) {
            errors.push("Password must contain at least one lowercase letter");
        }

        if (requirements.requireNumbers && !/[0-9]/.test(password)) {
            errors.push("Password must contain at least one number");
        }

        if (requirements.requireSymbols && !/[^A-Za-z0-9]/.test(password)) {
            errors.push("Password must contain at least one special character");
        }

        // Check for common weak passwords
        const weakPasswords = [
            "password",
            "123456",
            "qwerty",
            "admin",
            "password123",
            "admin123",
            "12345678",
            "welcome",
        ];

        if (weakPasswords.includes(password.toLowerCase())) {
            errors.push("Password is too common and easily guessable");
        }

        return {
            success: errors.length === 0,
            errors,
        };
    }
    static generateApiKey() {
        return crypto.randomBytes(32).toString("hex");
    }
}

export default securityUtils;
