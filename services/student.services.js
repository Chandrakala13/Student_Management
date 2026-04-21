const students = require("../data/student.data");
const Student = require("../models/student.model");
const generateId = require("../utils/generatedId");

class StudentService {
  create(data) {
    const newStudent = new Student({
      id: generateId(),
      ...data,
      createdAt: new Date(),
    });

    students.push(newStudent);
    return newStudent;
  }

  getAll({ page = 1, limit = 10, search = "" }) {
    let filtered = students.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );

    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }

  getById(id) {
    return students.find(s => s.id === id);
  }

  update(id, data) {
    const student = this.getById(id);
    if (!student) return null;

    Object.assign(student, data);
    return student;
  }

  delete(id) {
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return null;

    return students.splice(index, 1)[0];
  }
}

module.exports = new StudentService();