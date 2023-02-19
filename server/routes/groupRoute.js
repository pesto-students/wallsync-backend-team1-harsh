const express = require("express");
const Group = require("../models/billSplit/Group");
const Contribution = require("../models/billSplit/Contribution");
const User = require("../models/user/User");
const router = express.Router();
const equalSplit = require("../services/equal");
const unequal = require("../services/unequal");
const categorize = require("../services/categorize");
const simplifyPayment = require("../services/simplifyPayment");

router.post("/createGroup", (req, res) => {
	const newGroup = new Group(req.body);
	newGroup
		.save()
		.then((groupData) => {
			res.json(groupData);
		})
		.catch((error) => {
			res.json(error);
		});
});
router.get("/all", (req, res) => {
	Group.find()
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.json(err);
		});
});
router.get("/:groupName", (req, res) => {
	Group.findOne({ groupName: req.params.groupName })
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.json("Error fetching group data");
		});
});

router.post("/:groupName/adduser", (req, res) => {
	Group.findOne({ groupName: req.params.groupName })
		.then((groupDeets) => {
			User.findOne({ email: req.body.email })
				.then((user) => {
					if (user) {
						if (groupDeets.groupMembers.includes(user.firstName)) {
							res.json("user already exists");
						} else {
							groupDeets.groupMembers.push(user.firstName);
							groupDeets.save();
							res.json({ message: "added", members: groupDeets.groupMembers });
						}
					} else {
						res.json({ message: `send an invite to ${req.body.email}` });
					}
				})
				.catch((err) => {
					res.json("cannot find email");
				});
		})
		.catch((err) => {
			res.json("group not found");
		});
});

router.post("/:groupName/addPercentage", (req, res) => {
	Group.findOne({ groupName: req.params.groupName })
		.then((gd) => {
			req.body.map((i) => {
				gd.percentageArray.push({ name: i.name, percent: i.percent });
			});
			gd.save();
			res.json(gd.percentageArray);
		})
		.catch((err) => {
			res.json(err);
		});
});
router.get("/:groupName/settle/:split", (req, res) => {
	Group.findOne({ groupName: req.params.groupName })
		.then((gd) => {
			let result = [];
			// collecting names not present in the contributed array
			let uniqueNames = [...new Set(gd.contributions.map((item) => item.name))];

			uniqueNames.forEach((name) => {
				let shares = 0;
				gd.contributions.forEach((item) => {
					if (item.name === name) {
						shares += item.share;
					}
				});
				result.push({ name, share: shares });
			});

			// inserting members into the result array who have still not contributed
			let updatedResult = [...result];

			gd.groupMembers.forEach((member) => {
				if (!result.find((x) => x.name === member)) {
					updatedResult.push({ name: member, share: 0 });
				}
			});
			gd.finalContributions = updatedResult;

			const equalSettle = categorize(equalSplit(updatedResult));
			const unequalSettle = categorize(
				unequal(updatedResult, gd.percentageArray)
			);

			console.log(unequalSettle);
			if (req.params.split === "equal") {
				gd.memberBalances = equalSplit(updatedResult);

				res.json({
					settled: equalSplit(updatedResult),
					simplified: simplifyPayment(equalSettle.owed, equalSettle.settle),
				});
			} else {
				gd.memberBalances = unequal(updatedResult, gd.percentageArray);

				res.json({
					settled: unequal(updatedResult, gd.percentageArray),
					simplified: simplifyPayment(unequalSettle.owed, unequalSettle.settle),
				});
			}
			gd.save();
		})
		.catch((err) => {
			res.json("error calculating");
		});
});

module.exports = router;
