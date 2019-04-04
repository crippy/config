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
  postLike: (req, res) => {
    // get logged in user
    const user = req.user.id;
    // get the postId
    const postId = req.params.id;
    // get the post by :id
    Post.findById(postId).then(post => {
      // find if the user has liked the post already using filter
      const userLiked =
        post.likes.filter(like => like.user.toString() === user).length > 0;
      // if user has liked the post return error
      if (userLiked) {
        return res
          .status(400)
          .json({ error: 'User has already liked this post' });
      }
      // add user to the likes arr of the post
      post.likes.unshift({ user });
      // save the post
      post
        .save()
        .then(post => {
          res.json(post);
        })
        .catch(err => {
          res.status(404).json({ error: err });
        });
    });
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
