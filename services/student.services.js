/**
 * Student Service Layer
 * Handles all database operations for students
 * Uses Mongoose for MongoDB interactions
 */

const Student = require("../models/student.model");

class StudentService {
  /**
   * Create a new student
   * @param {Object} data - Student data (name, age, course)
   * @returns {Object} Created student document
   */
  async create(data) {
    const student = await Student.create(data);
    return student;
  }

  /**
   * Get all students with pagination and search
   * @param {Object} options - { page, limit, search }
   * @returns {Object} { students, total, page, totalPages }
   */
  async getAll({ page = 1, limit = 10, search = "" }) {
    // Build search query
    const searchQuery = search
      ? { name: { $regex: search, $options: "i" } } // Case-insensitive regex search
      : {};

    // Get total count for pagination
    const total = await Student.countDocuments(searchQuery);

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // Fetch students with pagination
    const students = await Student.find(searchQuery)
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limit);

    return {
      students,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
    };
  }

  /**
   * Get student by ID
   * @param {string} id - Student MongoDB ObjectId
   * @returns {Object|null} Student document or null
   */
  async getById(id) {
    const student = await Student.findById(id);
    return student;
  }

  /**
   * Update a student
   * @param {string} id - Student MongoDB ObjectId
   * @param {Object} data - Fields to update
   * @returns {Object|null} Updated student or null
   */
  async update(id, data) {
    const student = await Student.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true } // Return updated doc, run schema validators
    );
    return student;
  }

  /**
   * Delete a student
   * @param {string} id - Student MongoDB ObjectId
   * @returns {Object|null} Deleted student or null
   */
  async delete(id) {
    const student = await Student.findByIdAndDelete(id);
    return student;
  }
}

module.exports = new StudentService();