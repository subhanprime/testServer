const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "$2b$10$FPNV5t2jdMw9oN4irrjT5O.m/cNmT8Fi3C3ClYHsYAiRmoP/SEYtS",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    password: "$2b$10$FPNV5t2jdMw9oN4irrjT5O.m/cNmT8Fi3C3ClYHsYAiRmoP/SEYtS",
  },
];

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const getAllUsers = async (req, res) => {
  res
    .status(200)
    .json({ message: "Get All Users Successfully", status: true, data: users });
};

const createUser = async (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, email, password } = value;

  try {
    const emailExists = users.some((user) => user.email === email);
    if (emailExists) {
      return res
        .status(400)
        .json({ status: false, error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
    };

    users.push(newUser);

    res.status(201).json({
      message: "User created successfully",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials 1" });
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  res.json({ accessToken });
};

module.exports = { getAllUsers, createUser, userLogin };
