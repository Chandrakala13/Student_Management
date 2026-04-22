/**
 * Student Controller Layer
 * Handles HTTP requests and responses
 * Uses async/await for database operations
 */

const studentService = require("../services/student.services");

/**
 * Create a new student
 * POST /api/students
 */
exports.createStudent = async (req, res, next) => {
  try {
    const student = await studentService.create(req.body);
    res.status(201).json({
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors: messages,
      });
    }
    next(error);
  }
};

/**
 * Get all students with pagination and search
 * GET /api/students?page=1&limit=10&search=name
 */
exports.getAllStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const result = await studentService.getAll({
      page: Number(page),
      limit: Number(limit),
      search,
    });

    res.status(200).json({
      message: "Students retrieved successfully",
      data: result.students,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get student by ID
 * GET /api/students/:id
 */
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await studentService.getById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student retrieved successfully",
      data: student,
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        message: "Invalid student ID format",
      });
    }
    next(error);
  }
};

/**
 * Update a student
 * PUT /api/students/:id
 */
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await studentService.update(req.params.id, req.body);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation error",
        errors: messages,
      });
    }
    // Handle invalid MongoDB ObjectId
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        message: "Invalid student ID format",
      });
    }
    next(error);
  }
};

/**
 * Delete a student
 * DELETE /api/students/:id
 */
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await studentService.delete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
      data: student,
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        message: "Invalid student ID format",
      });
    }
    next(error);
  }
};