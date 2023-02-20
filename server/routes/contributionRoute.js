const express = require("express");
const contributionController = require("../controllers/contributionController");
const router = express.Router();

router.post(
	"/:groupName/:firstName/addCont",
	contributionController.addContribution
);

module.exports = router;
