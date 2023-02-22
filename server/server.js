if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const groupRoute = require("./routes/groupRoute");
const contributionRoute = require("./routes/contributionRoute");
const budgetRoute = require("./routes/budgetRoute");
const app = express();
const PORT = process.env.PORT || 8008;
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api", userRoute);
app.use("/api", groupRoute);
app.use("/api", contributionRoute);
app.use("/api", budgetRoute);

app.listen(PORT, () => {
	console.log("WallSync is running on port " + PORT);
});
