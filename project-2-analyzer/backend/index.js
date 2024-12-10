const express = require("express");

const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/UserRoutes");
const chartDataRoutes = require("./routes/ChartData");

const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/chart", chartDataRoutes);

// Server setup
const PORT =  5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
