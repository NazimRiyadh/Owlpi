import logger from "#src/shared/config/logger.js";

class AnalyticsService {
    constructor(metricsRepo) {
        if (!metricsRepo) throw new Error("Metrics repository is required");
        this.metricsRepo = metricsRepo;
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
            const { limit = 10, startTime = null } = options;
            const endpoints = await this.metricsRepo.getTopEndpoints(
                clientId,
                limit,
                startTime,
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

    async getTimeSeries(clientId, options = {}) {
        try {
            const metrics = await this.metricsRepo.getMetrics({
                clientId,
                ...options,
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
        if (!startTime) {
            startTime = new Date();
            startTime.setHours(startTime.getHours() - 24);
        }

        if (!endTime) {
            endTime = new Date();
        }
        return {
            startTime:
                startTime instanceof Date ? startTime : new Date(startTime),
            endTime: endTime instanceof Date ? endTime : new Date(endTime),
        };
    }
}

export default AnalyticsService;
