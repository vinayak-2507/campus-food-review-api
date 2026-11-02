const express = require("express");
const controller = require("../controllers/reviewController");

const router = express.Router();

router.route("/").get(controller.getReviews).post(controller.createReview);
router.route("/:id").get(controller.getReview).patch(controller.updateReview).delete(controller.deleteReview);

module.exports = router;
