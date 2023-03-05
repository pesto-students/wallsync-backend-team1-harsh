const express = require("express");
const contributionController = require("../controllers/contributionController");
const router = express.Router();

router.post(
	"/:groupName/:firstName/addCont",
	contributionController.addContribution
);
router.put(
	"/:id/:groupName/:contributionId/editCont",
	contributionController.editContribution
);
router.delete(
	"/:id/:groupName/:contributionId/deleteCont",
	contributionController.deleteContribution
);
module.exports = router;
