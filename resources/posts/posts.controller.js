const Post = require('./posts.model');
const Profile = require('../profile/profile.model');
const validatePostInput = require('../../validation/post');

module.exports = {
  getPosts: (req, res) => {
    Post.find()
      .sort({ date: -1 })
      .then(posts => res.json(posts))
      .catch(err => res.status(404).json({ error: 'No posts found' }));
  },
  getPost: (req, res) => {
    const id = req.params.id;
    Post.findById(id)
      .then(post => res.json(post))
      .catch(err => res.status(404).json({ error: 'No post with that Id' }));
  },
  deletePost: (req, res) => {
    const user = req.user.id;
    const postId = req.params.id;
    Post.findById(postId).then(post => {
      if (post.user.toString() !== user) {
        // unauthed
        return res
          .status(401)
          .json({ error: 'No authorized to delete this post' });
      }
      Post.remove()
        .then(response => {
          res.status(200).json(response);
        })
        .catch(err => {
          res.status(404).json({ error: err });
        });
    });
  },
  postLike: async (req, res) => {
    try {
      // postid
      const postId = req.params.id;
      // user
      const user = req.user.id;
      // get the post item
      const post = await Post.findById(postId);

      if (!post) return res.status(404).json({ error: 'Post not found' });

      const alreadyLiked = post.likes.includes(user);
      // if liked remove user
      if (alreadyLiked)
        postslikes = post.likes.filter(like => like !== user.toString());
      else post.likes = post.like.push(user);

      const savedPost = await post.save(post);
      return res.json({ savedPost });
    } catch (error) {
      res.status(404).json({ error });
    }
  },
  postData: (req, res) => {
    console.log(req.body);
    // validation
    const { errors, isValid } = validatePostInput(req.body);
    // if validation failed
    if (!isValid) {
      //Return Errors
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost
      .save()
      .then(response => {
        res.json(response);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
