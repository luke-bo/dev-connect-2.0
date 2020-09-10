const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } =  require('express-validator');

// Bring in User model
const User = require('../../models/User');

// @route POST api/users
// @description Register User
// @access Public (no need for token as it's just a test route)

router.post('/' , [
  check('name', 'Name is required')
    .not()
    .isEmpty(),
  check('email', 'Please include valid email')
    .isEmail(),
  check('password', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6 })  
], 
async (req, res) => {
  // console.log(req.body);
  const errors = validationResult(req);
  
  if(!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  // destructuring to pull out some values from req.body
  const { name, email, password } = req.body;

  try {
  
    // See if user exists
    let user = await User.findOne({ email: email });

    if(user) {
      res.status(400).json({ errors: [ {msg: 'User already exists'} ] }); 
    }

    // Get users gravatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });

    // Create instance of a User
    user = new User({
      name,
      email,
      avatar,
      password
    });

    // Encrypt password

    // Step #1: Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Step #2: Use bcrypt to encrypt the user's password
    user.password = await bcrypt.hash(password, salt);
    // Step #3: Save user to database
    await user.save();
    // Step#4: Return payload & json webtoken
    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(
      payload, 
      config.get('jwtSecret'),
      { expiresIn: 36000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error');
  };
});

module.exports = router;
