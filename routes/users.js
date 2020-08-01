const express = require('express');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = express.Router();

let User = require('../models/userModel');

router.get('/', async (req, res) => {
  const user = await User.find()
  if(!user) return res.status(400).json('there is no user');
  res.json(user);
});

router.get('user/:id',  async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json('The stream with the given ID was not found.');

  res.json(user);
});
router.get('/createadmin', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash('mango', salt);
    const user = new User({
      username:'mango',
      firstname:'david',
      lastname:'champion',
      email: 'mango@gmail.com',
      password: passwordHash,
      isAdmin: true,
    });
    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    res.send({ message: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    let { email, password, passwordCheck, username,firstname,lastname } = req.body;

    // validate
    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification." });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      username,
      firstname,
      lastname
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/signin',  async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id,firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin }, process.env.SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { 
    firstname:req.body.firstname,
    lastname:req.body.lastname,
    username:req.body.username,
    email: req.body.email, }, {
    new: true
  });

  if (!user) return res.status(404).json('The user with the given ID was not found.');
  
  res.json(stream);
});

router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) return res.status(404).json('The stream with the given ID was not found.');

  res.json(user);
});



module.exports = router;