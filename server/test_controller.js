import pg from 'pg';
import { MetricsRepository } from './src/services/processor/repositories/metricsRepository.js';
import { AnalyticsController } from './src/services/analytics/controllers/analyticsController.js';
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

const authServiceMock = { checkSuperAdmin: async () => true };
const clientRepoMock = {};
const controller = new AnalyticsController({ analyticsService: analyticsSvc, authService: authServiceMock, clientRepository: clientRepoMock });

async function check() {
    try {
        const req = {
            query: { startTime: (Date.now() - 24*60*60*1000).toString(), endTime: Date.now().toString() },
            user: { userId: 'admin123' }
        };
        const res = {
            status: (code) => ({
                json: (data) => console.log('Response JSON:', JSON.stringify(data, null, 2))
            })
        };
        const next = (err) => console.error('Next Error:', err);

        await controller.getDashboard(req, res, next);

    } catch(err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}
check();
