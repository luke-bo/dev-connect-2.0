const express = require('express');
const router = express.Router();

// @route GET api/users
// @description Test route
// @access Public (no need for token as it's just a test route)
router.get('/' , (req, res) => res.send('User route'));

module.exports = router;
