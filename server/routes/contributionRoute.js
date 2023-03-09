const express = require("express");
const contributionController = require("../controllers/contributionController");
const router = express.Router();

router.post(
	"/contribution/:id/:groupName/addCont",
	contributionController.addContribution
);
router.put(
	"/contribution/:id/:groupName/:contributionId/editCont",
	contributionController.editContribution
);
router.delete(
	"/contribution/:id/:groupName/:contributionId/deleteCont",
	contributionController.deleteContribution
);

module.exports = router;
