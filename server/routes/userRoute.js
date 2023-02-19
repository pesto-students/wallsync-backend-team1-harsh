const express = require("express");
const Group = require("../models/billSplit/Group");
const Contribution = require("../models/billSplit/Contribution");
const User = require("../models/user/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/register", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			return res.json({
				msg: "User Already Exist",
			});
		}
		const password = await bcrypt.hash(req.body.password, 10);
		const userdata = await User.create({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phone: req.body.phone,
			email: req.body.email,
			zip: req.body.zip,
			profilePicture: req.body.profilePicture,
			password,
		});

		res.json({
			msg: "user is sucessfully registered",
			userdata,
		});
	} catch (err) {
		console.log(err);
	}
});

router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (user) {
			const isMatch = await bcrypt.compare(password, user.password);
			if (isMatch) {
				res.json({
					user: {
						id: user._id,
						email: user.email,
						name: user.firstName + " " + user.lastName,
					},
					access_token: jwt.sign(
						{ id: req.body.id, email },
						process.env.JWT_SECRET
					),
				});
			} else {
				res.json("password does not match");
			}
		} else {
			res.json("User does not exist");
		}
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
