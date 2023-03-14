const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Group = require("../models/billSplit/Group");
const Contribution = require("../models/billSplit/Contribution");
const User = require("../models/user/User");
const transporter = require("../config/mail");
const nodemailer = require("nodemailer");
const upload = require("../config/upload");
const cloudinary = require("cloudinary").v2;
// const register = async (req, res) => {
// 	try {
// 		const user = await User.findOne({ email: req.body.email });
// 		if (user) {
// 			return res.json({
// 				msg: "User Already Exist",
// 			});
// 		}

// 		const password = await bcrypt.hash(req.body.password, 10);
// 		const userdata = await User.create({
// 			firstName: req.body.firstName,
// 			lastName: req.body.lastName,
// 			phone: req.body.phone,
// 			email: req.body.email,
// 			zip: req.body.zip,
// 			profilePicture: req.body.profilePicture,
// 			password,
// 		});

// 		res.json({
// 			msg: "user is sucessfully registered",
// 			userdata,
// 		});
// 		const options = {
// 			from: "wallsyncapp@gmail.com",
// 			to: `${req.body.email}`,
// 			subject: "Wallsync Account created",
// 			text: "WELCOME, Your Wallsync Account has been created",
// 		};
// 		transporter.sendMail(options, function (err, info) {
// 			if (err) {
// 				console.log(err);
// 				return;
// 			}
// 			console.log("Sent: " + info.response);
// 		});
// 	} catch (err) {
// 		console.log(err);
// 	}
// };
//
const register = async (req, res) => {
	try {
		upload(req, res, async (err) => {
			if (err) {
				return res.json({
					msg: "Error uploading file",
				});
			}

			const user = await User.findOne({ email: req.body.email });
			if (user) {
				return res.json({
					msg: "User Already Exist",
				});
			}
			const result = await cloudinary.uploader.upload(req.file.path, {
				folder: "uploads",
				allowed_formats: ["png", "jpg", "jpeg"],
				transformation: [{ width: 500, height: 500, crop: "limit" }],
			});
			const password = await bcrypt.hash(req.body.password, 10);
			const userdata = await User.create({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				phone: req.body.phone,
				email: req.body.email,
				zip: req.body.zip,
				profilePicture: {
					public_id: result.public_id,
					data: req.file.buffer,
					contentType: req.file.mimetype,
					imageName: req.file.originalname,
				},
				password,
			});

			res.json({
				msg: "user is sucessfully registered",
				userdata,
			});

			const options = {
				from: "wallsyncapp@gmail.com",
				to: `${req.body.email}`,
				subject: "Wallsync Account created",
				text: "WELCOME, Your Wallsync Account has been created",
			};
			transporter.sendMail(options, function (err, info) {
				if (err) {
					console.log(err);
					return;
				}
				console.log("Sent: " + info.response);
			});
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
						firstName: user.firstName,
						lastName: user.lastName,
						profilePicture: user.profilePicture,
						zip: user.zip,
						phone: user.phone,
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

const updateUser = async (req, res) => {
	try {
		let user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		upload(req, res, async (err) => {
			if (err) {
				return res.status(400).json({
					msg: "Error uploading file",
				});
			}
			console.log(req.file, "cloudinary result");

			if (req.file) {
				const result = await cloudinary.uploader.upload(req.file.path, {
					folder: "uploads",
					allowed_formats: ["png", "jpg", "jpeg"],
					transformation: [{ width: 500, height: 500, crop: "limit" }],
				});
				user.profilePicture = {
					public_id: result.public_id,
					data: req.file.buffer,
					contentType: req.file.mimetype,
					imageName: req.file.originalname,
				};
			}
			user.firstName = req.body.firstName || user.firstName;
			user.lastName = req.body.lastName || user.lastName;
			user.phone = req.body.phone || user.phone;
			user.email = req.body.email || user.email;
			user.zip = req.body.zip || user.zip;
			user.password = req.body.password
				? await bcrypt.hash(req.body.password, 10)
				: user.password;

			// const updatedUser = await user.save();
			const updatedUser = await User.findByIdAndUpdate(req.params.id, user, {
				new: true,
			});
			res.json({
				msg: "User data successfully updated",
				updatedUser,
			});
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({ msg: "Server Error" });
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
	updateUser,
};
