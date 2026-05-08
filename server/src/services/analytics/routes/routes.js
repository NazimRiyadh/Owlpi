import express from "express";
import analyticsContainer from "../dependencies/dependencies.js";
import authenticate from "#src/shared/middlewares/authenticate.js";

const router = express.Router();
const { analyticsController } = analyticsContainer.controllers;

router.get("/stats", authenticate, (req, res, next) => {
    analyticsController.getStats(req, res, next);
});

router.get("/dashboard", authenticate, (req, res, next) => {
    console.log("Hit /api/analytics/dashboard");
    analyticsController.getDashboard(req, res, next);
});

export default router;
