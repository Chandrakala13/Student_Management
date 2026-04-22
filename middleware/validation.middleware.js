/**
 * Student Validation Middleware
 * Validates incoming request body before database operations
 */

const validateStudent = (req, res, next) => {
  const { name, age, course } = req.body;

  // Check required fields
  if (!name || name.trim() === "") {
    return res.status(400).json({
      message: "Validation error",
      errors: ["Student name is required"],
    });
  }

  if (age === undefined || age === null) {
    return res.status(400).json({
      message: "Validation error",
      errors: ["Student age is required"],
    });
  }

  if (!course || course.trim() === "") {
    return res.status(400).json({
      message: "Validation error",
      errors: ["Course is required"],
    });
  }

  // Validate name type and length
  if (typeof name !== "string") {
    return res.status(400).json({
      message: "Validation error",
      errors: ["Name must be a string"],
    });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({
      message: "Validation error",
      errors: ["Name must be at least 2 characters"],
    });
  }

  if (name.trim().length > 100) {
    return res.status(400).json({
      message: "Validation error",
      errors: ["Name cannot exceed 100 characters"],
    });
  }

  // Validate age type and range
  if (typeof age !== "number" || !Number.isFinite(age)) {
    return res.status(400).json({
      message: "Validation error",
      errors: ["Age must be a valid number"],
    });
  }

  if (age < 1 || age > 150) {
    return res.status(400).json({
      message: "Validation error",
      errors: ["Age must be between 1 and 150"],
    });
  }

  // Validate course type and length
  if (typeof course !== "string") {
    return res.status(400).json({
      message: "Validation error",
      errors: ["Course must be a string"],
    });
  }

  if (course.trim().length < 2) {
    return res.status(400).json({
      message: "Validation error",
      errors: ["Course must be at least 2 characters"],
    });
  }

  if (course.trim().length > 100) {
    return res.status(400).json({
      message: "Validation error",
      errors: ["Course cannot exceed 100 characters"],
    });
  }

  // All validations passed
  next();
};

module.exports = validateStudent;