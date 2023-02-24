const express = require("express");
const groupController = require("../controllers/groupController");
const router = express.Router();

router.post("/:id/createGroup", groupController.createGroup);
router.get("/:id/:groupName", groupController.getGroup);
router.post("/:id/:groupName/adduser", groupController.addUserToGroup);
router.post(
	"/:id/:groupName/addPercentage",
	groupController.addPercentageArray
);
router.get("/:id/:groupName/settle/:split", groupController.settle);
router.delete("/:id/:groupName/delete", groupController.deleteGroup);
router.put("/:id/:groupName/edit", groupController.editGroup);
module.exports = router;
