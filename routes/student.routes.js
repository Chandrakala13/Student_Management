const express = require("express");
const router = express.Router();

const controller = require("../controllers/student.controller");
const validate = require("../middleware/validation.middleware");
const { authenticate } = require("../middlewares/auth.middleware");

// All student routes are now protected - authentication required
router.post("/", authenticate, validate, controller.createStudent);
router.get("/", authenticate, controller.getAllStudents);
router.get("/:id", authenticate, controller.getStudentById);
router.put("/:id", authenticate, validate, controller.updateStudent);
router.delete("/:id", authenticate, controller.deleteStudent);

module.exports = router;