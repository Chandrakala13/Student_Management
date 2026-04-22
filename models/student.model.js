/**
 * Student Mongoose Model
 * Schema design for MongoDB collection
 */

const mongoose = require("mongoose");

/**
 * Student Schema
 * 
 * Fields:
 * - name: Student's full name (required, string)
 * - age: Student's age (required, number)
 * - course: Course enrolled in (required, string)
 * - createdAt: Timestamp when record was created (default: now)
 */
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    age: {
      type: Number,
      required: [true, "Student age is required"],
      min: [1, "Age must be at least 1"],
      max: [150, "Age cannot exceed 150"],
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
      minlength: [2, "Course name must be at least 2 characters"],
      maxlength: [100, "Course name cannot exceed 100 characters"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for efficient searching by name (for search functionality)
studentSchema.index({ name: "text" });

// Alternative: Case-insensitive index for partial matching
studentSchema.index({ name: 1 });

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;