import express from "express";
import { getAlerts } from "../controller/weather.controller.js";

const router = express.Router();

router.post("/weather", getAlerts);

export default router;
