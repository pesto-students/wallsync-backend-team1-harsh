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
const repaymentRoute = require("./routes/repaymentRoute");

const app = express();
const PORT = process.env.PORT || 8008;
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api", userRoute);
app.use("/api", groupRoute);
app.use("/api", contributionRoute);
app.use("/api", budgetRoute);
app.use("/api", repaymentRoute);
app.get("/api", (req, res) => {
	const path = `/api/item/${v4()}`;
	res.setHeader("Content-Type", "text/html");
	res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
	res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});
app.get(
	"/",
	(req,
	(res) => {
		res.json("wallsync running");
	})
);
app.listen(PORT, () => {
	console.log("WallSync is running on port " + PORT);
});
