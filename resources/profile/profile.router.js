// Location bio etc
// Authentication username, password
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Profile = require('./profile.model');
const User = require('../users/users.model');
const controller = require('./profile.controller');

// @route   GET api/profile/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ id: 1, name: 'Profile Works' });
});

// @route   GET api/profile
// @desc    GET current users profle: loggedin user
// @access  Private with passport.authenticate
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const error = {};
    // gets it from the requesters jwt token
    const user = req.user.id;
    Profile.findOne({ user })
      .then(profile => {
        console.log(`Profile from server ${profile}`);
        if (!profile) {
          error.noProfile = 'Profile does not exist';
          return res.status(404).json(error);
        }
        return res.json(profile);
      })
      .catch(error => {
        return res.status(404).json(error);
      });
  }
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const error = {};
    const profile = {};
    profile.user = req.user.id;
    profile.handle = req.body.handle;
    profile.company = req.body.company;
    profile.website = req.body.website;
    profile.location = req.body.location;
    profile.bio = req.body.bio;
    profile.status = req.body.status;
    profile.githubusername = req.body.githubusername;
    profile.experience = req.body.experience;
    profile.education = req.body.education;
    profile.social.youtube = req.body.social.youtube;
    profile.social.facebook = req.body.social.facebook;
    profile.social.twitter = req.body.social.twitter;
    profile.social.instagram = req.body.social.instagram;
    profile.date = req.body.date;

    if (typeof req.body.skills !== undefined) {
      profile.skills = req.body.skills.split(',');
    }
    // might need to fix social links check in console.log to see what way the
    //values are set
    const user = req.user.id;

    // find if a profile exists or not determines if we create or update profile
    Profile.findOne({ user })
      .then(profile => {
        if (profile) {
          // update
          Profile.findOneAndUpdate(
            { user },
            { $set: profile },
            { new: true }
          ).then(profile => res.status(200).json(profile));
        } else {
          // find if handle already exists
          Profile.findOne({ handle: profile.handle }).then(profile => {
            if (profile) {
              error.message = 'Handle Already exists!';
              res.status(400).json(error);
            }
          });
          // create
          // new Profile(profile).save().then(profile => res.json(profile));
          Profile.create(profile).then(profile => res.json(profile));
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
);

module.exports = router;
