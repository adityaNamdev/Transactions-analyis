import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/db.js";
import transactionRoutes from "./routes/transactions.route.js";

dotenv.config({
  path: "./.env",
});

const app = express();
const Port = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(cors());

app.use(express.json());

connectDB();

//routes
app.use('/api/v1', transactionRoutes);

app.listen(Port, () => {
  console.log(`App is listen on port:${Port}`);
});
