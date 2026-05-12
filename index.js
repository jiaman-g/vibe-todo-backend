const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const todoRouter = require("./routers/todo.router");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Todo backend is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/todos", todoRouter);

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("연결 성공");

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB 연결 실패:", error.message);
    process.exit(1);
  }
};

startServer();
