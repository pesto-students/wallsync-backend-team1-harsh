const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Group = require("../models/billSplit/Group");
const Contribution = require("../models/billSplit/Contribution");
const User = require("../models/user/User");
const transporter = require("../config/mail");
const nodemailer = require("nodemailer");
const upload = require("../config/upload");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const register = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			return res.json({
				msg: "User Already Exist",
			});
		}
		if (!req.body.password) {
			return res.json({
				msg: "Password is required",
			});
		}

		const password = await bcrypt.hash(req.body.password.toString(), 10);
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
						firstName: user.firstName,
						lastName: user.lastName,
						profilePicture: user.profilePicture,
						isAdmin: user.isAdmin,
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
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		user.firstName = req.body.firstName || user.firstName;
		user.lastName = req.body.lastName || user.lastName;
		user.phone = req.body.phone || user.phone;
		user.email = req.body.email || user.email;
		user.zip = req.body.zip || user.zip;
		user.password = req.body.password
			? await bcrypt.hash(req.body.password, 10)
			: user.password;

		const updatedUser = await user.save();
		res.json({ message: "Updated user details", updatedUser });
	} catch (err) {
		res.status(500).json({ message: `Error: ${err}` });
	}
};

const updateProfilePicture = async (req, res) => {
	console.log(req.body); // log the request body
	try {
		const user = await User.findByIdAndUpdate(
			req.params.id,
			{
				profilePicture: {
					public_id: req.file.filename,
				},
			},
			{ new: true }
		);

		res.status(200).json({ updatedUser: user });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error updating profile picture" });
	}
};
//admin
const getUser = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			if (ud.isAdmin) {
				User.find()
					.then((data) => {
						res.json({ users: data });
					})
					.catch((err) => {
						res.json({ message: "no users found" });
					});
			} else {
				res.json("You are not an admin");
			}
		})
		.catch((err) => {
			res.json(err);
		});
};
const getGroup = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			if (ud.isAdmin) {
				Group.find()
					.then((data) => {
						res.json({ groups: data });
					})
					.catch((err) => {
						res.json({ message: "no groups found" });
					});
			} else {
				res.json("You are not an admin");
			}
		})
		.catch((err) => {
			res.json(err);
		});
};
const deleteUser = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			if (ud.isAdmin) {
				User.findOneAndDelete({ email: req.params.email })
					.then((data) => {
						res.json({ deletedUser: data });
					})
					.catch((err) => {
						res.json({ message: "user not deleted" });
					});
			} else {
				res.json("You are not an admin");
			}
		})
		.catch((err) => {
			res.json(err);
		});
};
const deleteGroup = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			if (ud.isAdmin) {
				Group.findOneAndDelete({ groupName: req.params.groupName })
					.then((data) => {
						res.json({ deletedGroup: data });
					})
					.catch((err) => {
						res.json({ message: "user not deleted" });
					});
			} else {
				res.json("You are not an admin");
			}
		})
		.catch((err) => {
			res.json(err);
		});
};
const adminEditUser = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			if (ud.isAdmin) {
				User.findOneAndUpdate({ email: req.params.email }, req.body, {
					new: true,
				})
					.then((data) => {
						res.json({ editedUser: data });
					})
					.catch((err) => {
						res.json({ message: "user not edited" });
					});
			} else {
				res.json("You are not an admin");
			}
		})
		.catch((err) => {
			res.json(err);
		});
};
const adminEditGroup = (req, res) => {
	User.findById(req.params.id)
		.then((ud) => {
			if (ud.isAdmin) {
				Group.findOneAndUpdate({ groupName: req.params.groupName }, req.body, {
					new: true,
				})
					.then((data) => {
						res.json({ editedGroup: data });
					})
					.catch((err) => {
						res.json({ message: "group not edited" });
					});
			} else {
				res.json("You are not an admin");
			}
		})
		.catch((err) => {
			res.json(err);
		});
};
module.exports = {
	register,
	login,
	getAllGroups,
	getAllRepayments,
	getBudget,
	getUser,
	getGroup,
	updateUser,
	updateProfilePicture,
	deleteUser,
	deleteGroup,
	adminEditUser,
	adminEditGroup,
};
