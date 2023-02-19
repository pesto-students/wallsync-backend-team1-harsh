if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cors = require("cors");
const userRoute = require("./routes/userRoute");

const app = express();
const PORT = process.env.PORT || 8008;
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api", userRoute);
app.listen(PORT, () => {
	console.log("WallSync is running on port " + PORT);
});
