const express = require('express');
const router = express.Router();

// @route GET api/posts
// @description Test route
// @access Public (no need for token as it's just a test route)
router.get('/' , (req, res) => res.send('Posts route'));

module.exports = router;