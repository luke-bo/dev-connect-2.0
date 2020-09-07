const express = require('express');
const router = express.Router();
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

  const { name, email, password } = req.body;

  try {
  // See if user exists
  let user = await User.findOne({ email: email });

  if(user) {
    res.status(400).json({ errors: [ {msg: 'User already exists'} ] }); 
  }

  // Get users gravatar

  // Encrypt password

  // Return json webtoken

  res.send('User route')

  } catch(err) {
    console.error(err.message);
    response.status(500).send('Server error');
  }


});

module.exports = router;
