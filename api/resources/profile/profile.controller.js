const Profile = require('./profile.model');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

const { validationResult } = require('express-validator/check');

module.exports = {
  // GET api/profile
  getProfile: async (req, res) => {
    try {
      // gets the current user from the requesters token
      console.log(req);
      const profile = await Profile.findOne({ user: req.user.id }).populate(
        'user',
        ['name', 'avatar']
      );

      if (!profile) {
        return res
          .status(400)
          .json({ error: 'There is no profile for this user' });
      }

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json(err);
    }
    // const error = {};
    // // gets it from the requesters jwt token
    // const user = req.user.id;
    // Profile.findOne({ user })
    //   .then(profile => {
    //     if (!profile) {
    //       error.noProfile = 'Profile does not exist';
    //       return res.status(404).json(error);
    //     }
    //     return res.json(profile);
    //   })
    //   .catch(error => {
    //     return res.status(404).json(error);
    //   });
  },
  // GET api/profile/handle/:id
  getHandleById: async (req, res) => {
    try {
      const profile = await Profile.findOne({
        handle: req.params.handle
      }).populate('user', ['name', 'avatart']);

      if (!profile) {
        res.status(400).json({ error: 'No Profile for the requested user.' });
      }
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
    }
  },
  //  GET api/profile/user/:id
  getProfileById: async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.params.id }).populate(
        'user',
        ['name', 'avatar']
      );

      if (!profile) {
        return res
          .status(400)
          .json({ error: 'No profile for the requested user.' });
      }

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
    }
  },
  // GET api/profile/all
  getAllProfiles: async (req, res) => {
    try {
      const profiles = await Profile.find().populate('user', [
        'name',
        'avatar'
      ]);
      res.json(profiles);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
  // POST api/profile/experience
  postProfileExperience: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      datefrom,
      dateTo,
      current,
      description
    } = req.body;

    const newExperience = {
      title,
      company,
      location,
      datefrom,
      dateTo,
      current,
      description
    };

    try {
      // find the current profile to update
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(400).json({ error: 'Profile not found.' });
      }

      // add the new experience to the front of the array
      profile.experience.unshift(newExperience);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).json('Server Error');
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
  },
  // DELETE api/profile/experience
  deleteProfileExperience: async (req, res) => {
    // get id param
    const expId = req.params.id;
    try {
      const profile = await Profile.findById({ user: req.user.id });

      if (!profile) {
        return res.status(400).json({ error: 'Profile not found.' });
      }

      const idx = profile.experience.findIndex(exp => exp._id === expId);

      profile.experience.splice(idx, 1);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
    }
  },
  // POST api/profile/education
  postProfileEducation: (req, res) => {
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
  },
  // DELETE api/profile/experience/:id
  deleteProfileEducationById: async (req, res) => {
    // get id param
    const expId = req.params.id;
    try {
      const profile = await Profile.findById({ user: req.user.id });

      if (!profile) {
        return res.status(400).json({ error: 'Profile not found.' });
      }

      const idx = profile.education.findIndex(ed => ed._id === expId);

      profile.education.splice(idx, 1);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
    }

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
  },
  // POST api/profile
  postProfile: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      //Return Errors
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedIn
    } = req.body;

    // build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedIn) profileFields.social.linkedIn = linkedIn;
    profileFields.date = new Date();

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      // create new profile
      profile = new Profile(profileFields);
      await Profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
    }
  },
  // DELETE api/profile
  deleteProfile: async (req, res) => {
    try {
      const user = req.user.id;
      // remove profile
      const profile = await Profile.findByIdAndRemove({ user });
      // remove user from db ...

      res.status(200).json({ message: 'User profile deleted.' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
    }
  }
};
