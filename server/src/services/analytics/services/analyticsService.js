import logger from "#src/shared/config/logger.js";

class AnalyticsService {
    constructor(metricsRepo, apiHitRepo) {
        if (!metricsRepo) throw new Error("Metrics repository is required");
        this.metricsRepo = metricsRepo;
        this.apiHitRepo = apiHitRepo;
    }

    async getOverallStats(clientId, filters = {}) {
        try {
            const { startTime, endTime } = this.parseTimeFilters(filters);
            const result = await this.metricsRepo.getOverallStats(
                clientId,
                startTime,
                endTime,
            );

            // PostgreSQL returns snake_case keys
            const totalHits = parseInt(result.total_hits) || 0;
            const errorHits = parseInt(result.error_hits) || 0;
            const successRate =
                totalHits > 0 ? ((totalHits - errorHits) / totalHits) * 100 : 0;
            const errorRate = totalHits > 0 ? (errorHits / totalHits) * 100 : 0;

            return {
                totalHits,
                errorHits,
                successRate: parseFloat(successRate.toFixed(2)),
                errorRate: parseFloat(errorRate.toFixed(2)),
                avgLatency: parseFloat(result.avg_latency) || 0,
                uniqueServices: parseInt(result.unique_services) || 0,
                uniqueEndpoints: parseInt(result.unique_endpoints) || 0,
                timestamp: {
                    start: startTime,
                    end: endTime,
                },
            };
        } catch (error) {
            logger.error("Error getting overall metrics:", error);
            throw error;
        }
    }

    async getTopEndpoints(clientId, options = {}) {
        try {
            const { limit = 10 } = options;
            const { startTime, endTime } = this.parseTimeFilters(options);
            const endpoints = await this.metricsRepo.getTopEndpoints(
                clientId,
                limit,
                startTime,
                endTime,
            );

            return endpoints.map((e) => ({
                serviceName: e.service_name,
                endpoint: e.endpoint,
                method: e.method,
                totalHits: parseInt(e.total_hits) || 0,
                errorHits: parseInt(e.error_hits) || 0,
                avgLatency: parseFloat(e.avg_latency) || 0,
            }));
        } catch (error) {
            logger.error("Error getting top endpoints:", error);
            throw error;
        }
    }

    async getRecentHits(clientId, filters = {}, limit = 50) {
        try {
            const query = {};
            if (clientId) {
                query.clientId = clientId;
            }
            
            if (filters.ip) {
                query.ip = filters.ip;
            }
            
            if (filters.endpoint) {
                query.endpoint = { $regex: filters.endpoint, $options: 'i' };
            }

            if (filters.serviceName) {
                query.serviceName = { $regex: filters.serviceName, $options: 'i' };
            }

            if (filters.method) {
                query.method = filters.method.toUpperCase();
            }

            if (filters.statusCode) {
                query.statusCode = parseInt(filters.statusCode, 10);
            }

            // Fetch from MongoDB
            const hits = await this.apiHitRepo.find(query, { 
                sort: { timestamp: -1 }, 
                limit 
            });
            
            return hits;
        } catch (error) {
            logger.error("Error getting recent hits:", error);
            throw error;
        }
    }

    async getHistory(clientId, filters = {}, options = {}) {
        try {
            const { page = 1, limit = 50 } = options;
            const skip = (page - 1) * limit;

            const query = {};
            if (clientId) query.clientId = clientId;

            if (filters.ip) query.ip = filters.ip;
            if (filters.endpoint) query.endpoint = { $regex: filters.endpoint, $options: 'i' };
            if (filters.serviceName) query.serviceName = { $regex: filters.serviceName, $options: 'i' };
            if (filters.method) query.method = filters.method.toUpperCase();
            if (filters.statusCode) query.statusCode = parseInt(filters.statusCode, 10);

            // Add time range filter
            const { startTime, endTime } = this.parseTimeFilters(filters);
            query.timestamp = { $gte: startTime, $lte: endTime };

            const [hits, total] = await Promise.all([
                this.apiHitRepo.find(query, { 
                    sort: { timestamp: -1 }, 
                    limit,
                    skip 
                }),
                this.apiHitRepo.count(query)
            ]);

            return {
                hits,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            logger.error("Error getting historical hits:", error);
            throw error;
        }
    }

    async getTimeSeries(clientId, options = {}) {
        try {
            const { startTime, endTime } = this.parseTimeFilters(options);
            const metrics = await this.metricsRepo.getMetrics({
                clientId,
                ...options,
                startTime,
                endTime,
            });

            return metrics.map((m) => ({
                serviceName: m.service_name,
                endpoint: m.endpoint,
                method: m.method,
                totalHits: parseInt(m.total_hits) || 0,
                errorHits: parseInt(m.error_hits) || 0,
                avgLatency: parseFloat(m.avg_latency) || 0,
                timestamp: m.time_bucket,
            }));
        } catch (error) {
            logger.error("Error getting time series metrics:", error);
            throw error;
        }
    }

    parseTimeFilters(filters = {}) {
        let { startTime, endTime } = filters;

        const toDate = (v) => {
            if (v instanceof Date) return v;
            if (!v) return null;
            // Handle numeric strings (milliseconds)
            if (typeof v === "string" && /^\d+$/.test(v)) {
                return new Date(Number(v));
            }
            return new Date(v);
        };

        const start = toDate(startTime);
        const end = toDate(endTime);

        const now = new Date();
        return {
            startTime: start && !isNaN(start) ? start : new Date(now.getTime() - 24 * 60 * 60 * 1000),
            endTime: end && !isNaN(end) ? end : now,
        };
    }
}

export default AnalyticsService;
