const Profile = require('./profile.model');
const request = require('request');
const config = require('config');
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
        return res
          .status(400)
          .json({ error: 'No Profile for the requested user.' });
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
  postProfileEducation: async (req, res) => {
    const {
      instituation,
      course,
      classification,
      datefrom,
      dateTo,
      description
    } = req.body;

    const newEducation = {
      instituation,
      course,
      classification,
      datefrom,
      dateTo,
      description
    };

    try {
      // find the current profile to update
      const profile = await Profile.findOne({ user: req.user.id });

      if (!profile) {
        return res.status(400).json({ error: 'Profile not found.' });
      }

      // add the new experience to the front of the array
      profile.education.unshift(newEducation);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server error');
    }
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
  },
  // GET api/profile/github/:username
  getGithubProfile: (req, res) => {
    try {
      const gitHubUsername = req.params.username;
      console.log(gitHubUsername);
      const options = {
        url: `https://api.github.com/users/${gitHubUsername}/repos?per_page=5
        &sort=created:asc&client_id=${config.get(
          'githubClientId'
        )}&client_secret=${config.get('githubSecret')}`,
        method: 'GET',
        headers: { 'user-agent': 'node.js' }
      };
      request(options, (error, response, body) => {
        if (error) console.error(error);

        if (response.statusCode !== 200) {
          return res.status(400).json({ error: 'No GitHub profile found.' });
        }

        res.json(JSON.parse(body));
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json('Server Error');
    }
  }
};
