const express = require("express");
const appController = require("../controllers/appController");
const router = express.Router();

router.post("/create", appController.createApplication);
router.get("/me", appController.getAllUserApplications);
router.get('/filters', appController.getApplicationFilters);
router
  .route("/:id")
  .patch(appController.updateApplication)
  .delete(appController.deleteApplication);

module.exports = router;
