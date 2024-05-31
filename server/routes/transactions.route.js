import express from "express";

import {
  insertData,
  getAllTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.get("/init", insertData);
router.get("/transactions", getAllTransactions);
router.get("/statistics", getStatistics);
router.get("/bar-chart", getBarChartData);
router.get("/pie-chart", getPieChartData);
router.get("/combined-data", getCombinedData);

export default router;
