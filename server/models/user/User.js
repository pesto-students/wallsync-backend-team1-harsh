const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		phone: { type: Number, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		zip: { type: Number, required: true },
		profilePicture: { type: String, default: "" },
		isAdmin: { type: Boolean, default: false },
		password: { type: String, required: true },
	},
	{ timestamps: true }
);

const User = mongoose.model("Users", userSchema);
module.exports = User;
