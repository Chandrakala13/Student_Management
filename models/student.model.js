class Student {
  constructor({ id, name, age, course, createdAt }) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.course = course;
    this.createdAt = createdAt;
  }
}

module.exports = Student;