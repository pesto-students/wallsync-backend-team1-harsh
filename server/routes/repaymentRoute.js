const express = require("express");
const router = express.Router();
const repaymentController = require("../controllers/repaymentController");

router.post("/:id/addRepayment", repaymentController.addRepayment);
router.put(
	"/:id/:repaymentId/editRepayment",
	repaymentController.editRepayment
);
router.delete(
	"/:id/:repaymentId/deleteRepayment",
	repaymentController.deleteRepayment
);

module.exports = router;
