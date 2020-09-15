const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route GET api/profile/me
// @description Get current user's profile
// @access Private

router.get('/me' , auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
                                 .populate('user', ['name', 'avatar']);
    
    if(!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user'})
    }

    res.json(profile);

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route POST api/profile
// @description Create or Update a user profile
// @access Private

// Here we pass our auth middleware and the express-validator check methods as params in our post request
router.post(
  '/',
  [
    auth, 
      [
        check('status', 'Status is required')
          .not()
          .isEmpty(),
        check('skills', 'Skills is required')
          .not()
          .isEmpty()
      ] 
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    res.json({ msg: 'Validation passed'});
  }
);


module.exports = router;