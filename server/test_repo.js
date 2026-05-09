import pg from 'pg';
import { MetricsRepository } from './src/services/processor/repositories/metricsRepository.js';
import AnalyticsService from './src/services/analytics/services/analyticsService.js';

const pool = new pg.Pool({
    user: 'postgres',
    password: 'password',
    host: '127.0.0.1',
    port: 5433,
    database: 'api_monitoring_system'
});

const logger = { error: console.error, info: console.log };
const repo = new MetricsRepository({ logger, postgres: pool });
const analyticsSvc = new AnalyticsService(repo);

async function check() {
    try {
        const timeRange = { startTime: null, endTime: null };
        const result = await Promise.allSettled([
            analyticsSvc.getOverallStats(null, timeRange),
            analyticsSvc.getTopEndpoints(null, {
                limit: 5,
                startTime: timeRange.startTime,
            }),
            analyticsSvc.getTimeSeries(null, {
                ...timeRange,
                limit: 24,
            }),
        ]);

        const [stats, topEndpoints, recentTimeSeries] = result.map(
            (item) => (item.status === "fulfilled" ? item.value : item.reason),
        );

        console.log('Stats:', stats);
        console.log('Top Endpoints:', topEndpoints);
        console.log('Recent Activity:', recentTimeSeries);
    } catch(err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}
check();
