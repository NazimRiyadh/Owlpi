import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import postgres from './postgres.js';
import logger from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function initializeDatabase() {
    try {
        logger.info('Checking PostgreSQL schema...');
        
        // Path to the SQL file (relative to this file)
        const sqlPath = path.join(__dirname, '../../../scripts/init_postgres.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split by semicolon to run multiple statements if needed, 
        // but pg-pool.query can actually run multiple statements in one call.
        await postgres.query(sql);
        
        logger.info('PostgreSQL schema verified/initialized successfully');
    } catch (error) {
        logger.error('Failed to initialize PostgreSQL schema:', error);
        // We don't throw here to avoid crashing the whole server if DB is already init
        // or if there are minor permission issues, but the error will be in logs.
    }
}
