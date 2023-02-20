const express = require("express");
const groupController = require("../controllers/groupController");
const router = express.Router();

router.post("/createGroup", groupController.createGroup);
router.get("/:groupName", groupController.getGroup);
router.post("/:groupName/adduser", groupController.addUserToGroup);
router.post("/:groupName/addPercentage", groupController.addPercentageArray);
router.get("/:groupName/settle/:split", groupController.settle);

module.exports = router;
