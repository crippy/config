const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [
    {
      title: {
        type: String
      },
      company: {
        type: String
      },
      location: {
        type: String
      },
      datefrom: {
        type: Date
      },
      dateTo: {
        type: Date
      },
      current: {
        type: Boolean,
        required: true,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      instituation: {
        type: String,
        required: true
      },
      course: {
        type: String,
        required: true
      },
      classification: {
        type: String,
        required: true
      },
      datefrom: {
        type: Date,
        required: true
      },
      dateTo: {
        type: Date,
        required: true
      },
      description: {
        type: String
      }
    }
  ],
  social: {
    youtube: {
      type: String
    },
    facebook: {
      type: String
    },
    twitter: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
