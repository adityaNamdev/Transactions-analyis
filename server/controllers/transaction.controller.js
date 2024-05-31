import axios from "axios";
import { Transaction } from "../models/transaction.model.js";

export const insertData = async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    await Transaction.insertMany(response.data);

    res.status(200).send("Get All data Successfully ");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  const { month, search, page = 1, perPage = 10 } = req.query;
  const skip = (page - 1) * perPage;
  try {
    let query = {};
    if (month) {
      query = {
        $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] },
      };
    }

    if (search) {
      query.$or = [
        { title: { $regex: new RegExp(search, "i") } },
        { description: { $regex: new RegExp(search, "i") } },
      ];
    }

    const transactions = await Transaction.find(query)
      .skip(skip)
      .limit(perPage)
      .lean();

    const totalCount = await Transaction.countDocuments(query);

    res.json({
      transactions,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / perPage),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getStatistics = async (req, res) => {
  const { month } = req.query;

  try {
    const query = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] },
    };

    const totalSaleAmount = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: null, totalSaleAmount: { $sum: "$price" } } },
    ]);

    const totalSoldItems = await Transaction.countDocuments({
      ...query,
      sold: true,
    });
    const totalNotSoldItems = await Transaction.countDocuments({
      ...query,
      sold: false,
    });

    res.json({
      totalSaleAmount:
        totalSaleAmount.length > 0 ? totalSaleAmount[0].totalSaleAmount : 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const ranges = [
      { range: "0-100", min: 0, max: 100 },
      { range: "101-200", min: 101, max: 200 },
      { range: "201-300", min: 201, max: 300 },
      { range: "301-400", min: 301, max: 400 },
      { range: "401-500", min: 401, max: 500 },
      { range: "501-600", min: 501, max: 600 },
      { range: "601-700", min: 601, max: 700 },
      { range: "701-800", min: 701, max: 800 },
      { range: "801-900", min: 801, max: 900 },
      { range: "901-above", min: 901, max: Infinity },
    ];

    const query = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] },
    };

    const result = await Promise.all(
      ranges.map(async (range) => {
        const count = await Transaction.countDocuments({
          ...query,
          price: { $gte: range.min, $lt: range.max },
        });
        return { range: range.range, count };
      })
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPieChartData = async (req, res) => {
  const { month } = req.query;
  const query = {
    $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] },
  };

  try {
    const data = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: "$category", items: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCombinedData = async (req, res) => {
  const { month } = req.query;
  try {   

    const statistics = await axios.get(`http://localhost:${process.env.PORT}/api/v1/statistics?month=${month}`);
    const barChart = await axios.get(`http://localhost:${process.env.PORT}/api/v1/bar-chart?month=${month}`);
    const pieChart = await axios.get(`http://localhost:${process.env.PORT}/api/v1/pie-chart?month=${month}`);
  

    res.json({
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
