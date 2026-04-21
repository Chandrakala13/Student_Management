const validateStudent = (req, res, next) => {
  const { name, age, course } = req.body;

  if (!name || !age || !course) {
    return res.status(400).json({
      message: "name, age, and course are required",
    });
  }

  if (typeof name !== "string") {
    return res.status(400).json({ message: "Invalid name" });
  }

  if (typeof age !== "number") {
    return res.status(400).json({ message: "Age must be number" });
  }

  next();
};

module.exports = validateStudent;