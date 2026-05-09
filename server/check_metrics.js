import pg from 'pg';

const pool = new pg.Pool({
    user: 'postgres',
    password: 'password',
    host: '127.0.0.1',
    port: 5432,
    database: 'api_monitoring_system'
});

async function run() {
    try {
        const hits = await pool.query('SELECT COUNT(*) FROM api_hits');
        console.log(`api_hits count: ${hits.rows[0].count}`);

        const endpointMetrics = await pool.query('SELECT COUNT(*) FROM endpoint_metrics');
        console.log(`endpoint_metrics count: ${endpointMetrics.rows[0].count}`);

        if (endpointMetrics.rows[0].count === '0') {
            console.log('endpoint_metrics is EMPTY!');
        } else {
            const sample = await pool.query('SELECT * FROM endpoint_metrics LIMIT 5');
            console.log('endpoint_metrics sample:', sample.rows);
        }
    } catch(err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}
run();
