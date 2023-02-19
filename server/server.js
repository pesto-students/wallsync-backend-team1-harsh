if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8008;
connectDB();
app.listen(PORT, () => {
	console.log("WallSync is running on port " + PORT);
});
