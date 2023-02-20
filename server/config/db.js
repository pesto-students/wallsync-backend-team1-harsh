const mongoose = require("mongoose");

async function connectDB() {
	try {
		mongoose.set("strictQuery", false);
		const connect = await mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(`Connected to WallSync DB: ${connect.connection.host}`);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
}

module.exports = connectDB;
