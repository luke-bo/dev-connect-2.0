const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } =  require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// @route GET api/auth
// @description Route to get authentication before allowing access to protected routes
// @access Public (no need for token as it's just a test route)
router.get('/', auth, async (req, res) => {
  try {
    // console.log(req.user);
    const user = await User.findById(req.user.id).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route POST api/auth
// @description authenticate user & get token
// @access Public

router.post('/' , [
  check('email', 'Please include valid email').isEmail(),
  check('password', 'Password is required. Please enter a password.').exists()  
], 
async (req, res) => {
  // console.log(req.body);
  const errors = validationResult(req);
  
  if(!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }

  // destructuring to pull out some values from req.body
  const { email, password } = req.body;

  try {
  
    // See if user exists
    let user = await User.findOne({ email: email });

    if(!user) {
      res.status(400).json({ errors: [ {msg: 'Invalid Credentials'} ] }); 
    }

    // compare password from request with encrypted password with bcrypt compare method
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
            .status(400)
            .json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Return payload & json webtoken
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