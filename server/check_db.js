import pg from 'pg';

const pool = new pg.Pool({
    user: 'postgres',
    password: 'password',
    host: '127.0.0.1',
    port: 5433,
    database: 'api_monitoring_system'
});

async function check() {
    try {
        const res = await pool.query('SELECT MIN(time_bucket) as min, MAX(time_bucket) as max FROM endpoint_metrics');
        console.log('Time range:', res.rows[0]);
    } catch(err) {
        console.error('DB Error:', err);
    } finally {
        await pool.end();
    }
}

check();
