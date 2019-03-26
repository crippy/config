// Location bio etc
// Authentication username, password
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('./profile.model');
const validateProfileInput = require('../../validation/profile');
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
    const { errors, isValid } = validateProfileInput(req.body);

    if (!isValid) {
      //Return Errors
      return res.status(400).json(errors);
    }

    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.handle = req.body.handle;
    profileFields.company = req.body.company;
    profileFields.website = req.body.website;
    profileFields.location = req.body.location;
    profileFields.bio = req.body.bio;
    profileFields.status = req.body.status;
    profileFields.githubusername = req.body.githubusername;
    profileFields.experience = req.body.experience;
    profileFields.education = req.body.education;
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    profileFields.date = req.body.date;

    if (typeof req.body.skills !== undefined) {
      profileFields.skills = req.body.skills.split(',');
    }
    // might need to fix social links check in console.log to see what way the
    //values are set
    const user = req.user.id;

    // find if a profile exists or not determines if we create or update profile
    Profile.findOne({ user })
      .then(profile => {
        console.log(`Profile is ${profile}`);
        if (profile) {
          // update
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          ).then(profile => res.status(200).json(profile));
        } else {
          // find if handle already exists
          Profile.findOne({ handle: profileFields.handle })
            // take the user and extracts name and avatar and stores it in the profile
            .populate('user', ['name', 'avatar'])
            .then(profile => {
              if (profile) {
                errors.handle = 'Handle Already exists!';
                res.status(400).json(errors);
              }
            })
            .catch(err => {
              res.status(400).json(err);
            });
          // create
          new Profile(profileFields).save().then(profile => res.json(profile));
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
);

module.exports = router;
