const mongoose = require("mongoose");

async function connectDB() {
	try {
		const connect = await mongoose.connect(process.env.DB_URL);
		console.log(`Connected to WallSync DB: ${connect.connection.host}`);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
}

module.exports = connectDB;
