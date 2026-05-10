import pg from "pg";
import config from "./index.js";
import logger from "./logger.js";

const { Pool } = pg;

class PostgresConnection {
    constructor() {
        this.pool = null;
    }

    getPool() {
        if (!this.pool) {
            const poolConfig = config.postgres.url
                ? { connectionString: config.postgres.url }
                : {
                      host: config.postgres.host,
                      port: config.postgres.port,
                      database: config.postgres.database,
                      user: config.postgres.user,
                      password: config.postgres.password,
                  };

            this.pool = new Pool({
                ...poolConfig,
                max: 20,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 5000,
            });

            this.pool.on("error", (err) => {
                logger.error("Unexpected PG pool error:", err);
            });

            logger.info("PostgreSQL pool created");
        }

        return this.pool;
    }

    async testConnection() {
        const pool = this.getPool();
        let client;

        try {
            client = await pool.connect();
            const result = await client.query("SELECT NOW()");
            logger.info(`PG connected at ${result.rows[0].now}`);
            return result.rows[0].now;
        } catch (error) {
            logger.error("PG test connection failed:", error);
            throw error;
        } finally {
            if (client) client.release();
        }
    }

    async query(text, params = []) {
        const pool = this.getPool();
        const start = Date.now();

        try {
            const result = await pool.query(text, params);
            const duration = Date.now() - start;

            logger.debug("Executed query", {
                duration,
                rowCount: result.rowCount,
            });

            return result;
        } catch (error) {
            logger.error("Query error:", {
                error: error.message,
            });
            throw error;
        }
    }

    async close() {
        if (!this.pool) return;

        await this.pool.end();
        this.pool = null;

        logger.info("PostgreSQL pool closed");
    }
}

export default new PostgresConnection();
