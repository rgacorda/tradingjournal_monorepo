const express = require("express");
const router = express.Router();
const mistakeController = require("../controllers/mistake.controller");
const verifyToken = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.post(
  "/",
  verifyToken,
  roleMiddleware("create:mistake"),
  mistakeController.createMistake
);
router.get("/", verifyToken, mistakeController.getAllMistakes);
router.get("/:id", verifyToken, mistakeController.getMistake);
router.put(
  "/:id",
  verifyToken,
  roleMiddleware("update:mistake"),
  mistakeController.updateMistake
);
router.delete(
  "/delete",
  verifyToken,
  roleMiddleware("delete:mistake"),
  mistakeController.deleteMistake
);

module.exports = router;
