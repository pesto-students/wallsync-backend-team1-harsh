const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Group = require("../models/billSplit/Group");
const Contribution = require("../models/billSplit/Contribution");
const User = require("../models/user/User");

const register = async (req, res) => {
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
};
const login = async (req, res) => {
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
};

// const getAllGroups = (req, res) => {
// 	User.findById(req.params.id)
// 		.then((ud) => {
// 			const groupId = ud.groups.map((i) => i);
// 			let res = [];
// 			Group.findById(req.params.groupId)
// 				.then((data) => {
// 					res.push(data);
// 					res.json(res);
// 				})
// 				.catch((err) => {
// 					res.json("Error fetching group data");
// 				});
// 		})
// 		.catch((err) => {
// 			res.json("error fetching groups");
// 		});
// };
const getAllGroups = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).populate("groups");
		const groups = user.groups;
		res.json(groups);
	} catch (err) {
		res.json("error fetching groups");
	}
};
const getAllRepayments = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).populate("repayments");
		const repayments = user.repayments;
		res.json(repayments);
	} catch (err) {
		res.json("error fetching repayments");
	}
};
const getBudget = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).populate("budgets");
		const budgets = user.budgets;
		res.json(budgets);
	} catch (err) {
		res.json("error fetching budget");
	}
};
const getUser = (req, res) => {
	User.findById(req.params.id)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.json(err);
		});
};
const getUsers = (req, res) => {
	User.find().then((data) => {
		res.json(data);
	});
};
module.exports = {
	register,
	login,
	getAllGroups,
	getAllRepayments,
	getBudget,
	getUser,
	getUsers,
};
