import http from 'http';

const req = http.request({
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/analytics/dashboard?startTime=' + (Date.now() - 24*3600*1000),
    method: 'GET',
    headers: {
        // Need authentication! Let's login first or bypass
    }
});
