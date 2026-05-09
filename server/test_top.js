import AnalyticsService from './src/services/analytics/services/analyticsService.js';
import { MetricsRepository } from './src/services/processor/repositories/metricsRepository.js';
import pg from 'pg';

const pool = new pg.Pool({
    user: 'postgres',
    password: 'password',
    host: '127.0.0.1',
    port: 5433,
    database: 'api_monitoring_system'
});

const logger = { error: console.error, info: console.log, warn: console.warn };
const repo = new MetricsRepository({ postgres: pool, logger });
const analyticsService = new AnalyticsService(repo);

async function run() {
    try {
        const end = Date.now();
        const start = end - 24 * 3600 * 1000;
        const timeRange = { startTime: start, endTime: end };
        
        console.log("timeRange:", timeRange);

        const result = await Promise.allSettled([
            analyticsService.getOverallStats(null, timeRange),
            analyticsService.getTopEndpoints(null, {
                limit: 50,
                startTime: timeRange.startTime,
            }),
            analyticsService.getTimeSeries(null, {
                ...timeRange,
                limit: 24,
            }),
        ]);

        console.log("RESULT:", JSON.stringify(result, null, 2));
    } catch(err) {
        console.error('ERROR:', err);
    } finally {
        await pool.end();
    }
}
run();
