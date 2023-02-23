const express = require("express");
const router = express.Router();
const repaymentController = require("../controllers/repaymentController");

router.post("/:id/addRepayment", repaymentController.addRepayment);
router.put("/:id/:repaymentId/edit", repaymentController.editRepayment);
router.delete("/:id/:repaymentId/delete", repaymentController.deleteRepayment);
router.get("/:id/repayments", repaymentController.getRepayments);
module.exports = router;
