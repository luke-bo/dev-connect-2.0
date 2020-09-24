const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route GET api/posts
// @description Test route
// @access Public (no need for token as it's just a test route)
// router.get('/' , (req, res) => res.send('Posts route'));

// @route POST api/posts
// @description Create a post
// @access Private
router.post('/',
  [
    auth,
    [
      check('text', 'Text is required.')
        .not()
        .isEmpty()
    ]
  ], 
  async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });  
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route GET api/posts
// @description Get all posts
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    // sort({ date: -1 }) will sort posts newest to oldest
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET api/posts/:id
// @description Get post by id
// @access Private

router.get('/:id', auth, async (req, res) => {
  try {
    // sort({ date: -1 }) will sort posts newest to oldest
    const post = await Post.findById(req.params.id);

    // Check to see if a post with the inputed id exists
    if(!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);

    // This if statement checks for ObjectId errors, so if  the id that is passed is not a valid id, it will throw the same error message as submitting a valid post id that does not exist. This gives the front end more info about the error, instead of just throwing a 500.
    if(err.kind === "ObjectId") {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;