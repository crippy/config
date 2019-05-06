const Post = require('./posts.model');
const User = require('../users/users.model');
const Profile = require('../profile/profile.model');

const { validationResult } = require('express-validator/check');

module.exports = {
  getPosts: async (req, res) => {
    try {
      const posts = await Post.find().sort({ data: -1 });
      res.json(posts);
    } catch (err) {
      console.err(err.message);
      res.status(500).json('Server Error');
    }
  },
  getPost: async (req, res) => {
    try {
      const postId = req.param.id;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found.' });
      }
      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json('Server Error');
    }
  },
  deletePost: async (req, res) => {
    const user = req.user.id;
    const postId = req.params.id;
    try {
      const postToRemove = await Post.findById(postId);

      if (!postToRemove) {
        return releaseEvents.status(400).json({ error: 'No Post exists.' });
      }

      // make sure the current user is the same person who created it.
      if (postToRemove.user.toString() !== user) {
        return res.status(400).json({ error: 'Unauthorized to delete post.' });
      }

      await postToRemove.remove();
      res.json({ message: 'Post removed.' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
    }
  },
  postLike: async (req, res) => {
    try {
      // postid
      const postId = req.params.id;
      // user
      const user = req.user.id;
      console.log(`user is type ${typeof user} ${user}`);
      // get the post item
      const post = await Post.findById(postId);
      console.log(`${post}`);
      if (!post) {
        return res.status(404).json({ error: 'Post not found.' });
      }
      const alreadyLiked = post.likes.includes(user);
      console.log(`${alreadyLiked}`);
      // if liked remove user
      if (alreadyLiked) {
        post.likes = post.likes.filter(like => like !== user.toString());
      } else {
        post.likes = [...post.likes, user];
        console.log(`${post}`);
      }

      const savedPost = await post.save();
      res.json(savedPost);
    } catch (err) {
      console.error(err.message);
      res.status(404).json('Server Error');
    }
  },
  postData: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Get current user profile, minus the password field
      const user = await User.findById(req.user.id).select('-password');

      // setup post model
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
      res.status(500).json('Server Error');
    }
  }
};
