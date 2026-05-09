class AnalyticsService {
    constructor(metricsRepo) {
        if (!metricsRepo) throw new Error("Metrics repository is required");
        this.metricsRepo = metricsRepo;
    }

    async getOverallMetrics(clientId, filters = {}) {
        try {
            const { startTime, endTime } = this.parseTimeFilters(filters);
            const result = await this.metricsRepo.getOverallStats(
                clientId,
                startTime,
                endTime,
            );
            const totalHits = parseInt(result.totalHits) || 0;
            const errorHits = parseInt(result.errorHits) || 0;
            const successRate =
                totalHits > 0 ? ((totalHits - errorHits) / totalHits) * 100 : 0;
            const errorRate = totalHits > 0 ? (errorHits / totalHits) * 100 : 0;

            return {
                totalHits,
                errorHits,
                successHits: parseFloat(successRate.toFixed(2)),
                errorRate: errorRate.toFixed(2),
                avgLatency: parseFloat(result.avgLatency) || 0,
                uniqueServices: parseInt(result.uniqueServices) || 0,
                uniqueEndpoints: parseInt(result.uniqueEndpoints) || 0,
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

    parseTimeFilters(filters = {}) {
        let { startTime, endTime } = filters;
        if (!startTime) {
            startTime = new Date();
            startTime.setHours(startTime.getHours() - 24); //provides data of last 24 hours
        }

        if (!endTime) {
            endTime = new Date();
        }
        return { startTime, endTime };
    }
}
export default AnalyticsService;
