const express = require("express");
const router = express.Router();
const repaymentController = require("../controllers/repaymentController");

router.post("/repayment/:id/addRepayment", repaymentController.addRepayment);
router.put(
	"/repayment/:id/:repaymentId/editRepayment",
	repaymentController.editRepayment
);
router.delete(
	"/repayment/:id/:repaymentId/deleteRepayment",
	repaymentController.deleteRepayment
);

module.exports = router;
