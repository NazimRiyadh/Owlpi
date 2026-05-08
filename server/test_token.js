import jwt from "jsonwebtoken";
import config from "./src/shared/config/index.js";

const token = jwt.sign({ userId: "123", username: "test", email: "test@test.com", role: "admin", clientId: "123456789012345678901234" }, config.jwt.secret, { expiresIn: "1h" });
console.log(token);
