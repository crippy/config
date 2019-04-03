const Post = require('./posts.model');
const validatePostInput = require('../../validation/post');

module.exports = {
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
