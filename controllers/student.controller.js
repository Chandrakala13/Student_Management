const studentService = require("../services/student.services");

exports.createStudent = (req, res, next) => {
  try {
    const student = studentService.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
};

exports.getAllStudents = (req, res, next) => {
  try {
    const { page, limit, search } = req.query;

    const students = studentService.getAll({
      page: Number(page),
      limit: Number(limit),
      search,
    });

    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};

exports.getStudentById = (req, res, next) => {
  const student = studentService.getById(req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.status(200).json(student);
};

exports.updateStudent = (req, res) => {
  const updated = studentService.update(req.params.id, req.body);

  if (!updated) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.status(200).json(updated);
};

exports.deleteStudent = (req, res) => {
  const deleted = studentService.delete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.status(200).json(deleted);
};