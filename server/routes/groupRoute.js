const express = require("express");
const groupController = require("../controllers/groupController");
const router = express.Router();

router.post("/group/:id/createGroup", groupController.createGroup);
router.get("/group/:id/:groupName", groupController.getGroup);
router.post("/group/:id/:groupName/adduser", groupController.addUserToGroup);
router.post(
	"/group/:id/:groupName/addPercentage",
	groupController.addPercentageArray
);
router.get("/group/:id/:groupName/settle/:split", groupController.settle);
router.delete("/group/:id/:groupName/delete", groupController.deleteGroup);
router.put("/group/:id/:groupName/edit", groupController.editGroup);

module.exports = router;
