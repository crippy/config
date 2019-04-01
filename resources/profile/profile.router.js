// Location bio etc
// Authentication username, password
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('./profile.model');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');
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

// @route   GET api/profile/handle/:handle
// @desc    GET Profile by handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'No Profile for the requested user.';
        // send back to client
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(error => {
      return res.status(404).json(error);
    });
});

// @route   GET api/profile/user/:user_id
// @desc    GET Profile by user_id
// @access  Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'No Profile for the requested user.';
        // send back to client
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(error => {
      return res
        .status(404)
        .json({ profile: ' There is no profile for this user.' });
    });
});

// @route   GET api/profile/all
// @desc    GET All Profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};
  Profile.find()
    .populate('user'[('name', 'avatar')])
    .then(profiles => {
      if (!profiles) {
        errors.noprofiles = 'No Profiles to display.';
        res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// @route   POST api/profile/experience
// @desc    POST Profile experience
// @access  Private JWT
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // validation
    const { errors, isValid } = validateExperienceInput(req.body);
    // if validation failednpm
    if (!isValid) {
      //Return Errors
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to exp array
      console.log(`Profile ${profile}`);
      if (profile.experience === null) {
        profile.experience = [];
      }
      profile.experience.unshift(newExp);

      profile.save().then(profile => {
        res.json(profile);
      });
    });
  }
);

// @route   DELETE api/profile/experience/:id
// @desc    DELETE Profile experience by id
// @access  Private JWT
router.delete(
  '/experience/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // get id param
    const expId = req.params.id;
    // user
    const user = req.user.id;
    Profile.findOne({ user })
      .then(profile => {
        // Remove experience
        profile.experience.remove({ _id: expId });
        // Save experience
        profile.save().then(profile => {
          res.json(profile);
        });
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/profile/education
// @desc    POST Profile education
// @access  Private JWT
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // validation
    const { errors, isValid } = validateEducationInput(req.body);
    // if validation failednpm
    if (!isValid) {
      //Return Errors
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEducation = {
        instituation: req.body.instituation,
        course: req.body.course,
        classification: req.body.classification,
        datefrom: req.body.datefrom,
        dateTo: req.body.dateTo,
        description: req.body.description
      };
      // Add to exp array
      console.log(`Profile ${profile}`);
      if (profile.education === null) {
        profile.education = [];
      }
      profile.education.unshift(newEducation);

      profile.save().then(profile => {
        res.json(profile);
      });
    });
  }
);

// @route   DELETE api/profile/education/:id
// @desc    DELETE Profile education by id
// @access  Private JWT
router.delete(
  '/education/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // get id param
    const id = req.params.id;
    // user
    const user = req.user.id;
    Profile.findOne({ user })
      .then(profile => {
        // Remove education
        profile.education.remove({ _id: id });
        // Save education
        profile.save().then(profile => {
          res.json(profile);
        });
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/profile
// @desc    POST Profile for user
// @access  Private JWT
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

// @route   DELETE api/profile
// @desc    DELETE Profile
// @access  Private JWT
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // user
    const user = req.user.id;
    Profile.findOneAndRemove({ user })
      .then(response => {
        res.json({ success: true });
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
