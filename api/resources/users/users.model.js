const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: String,
  date: { type: Date, default: Date.now }
});

// can use methods in here like, should do validation etc names, indexs and hooks

// UserSchema.methods.checkPassword = (password) => {
//   const passwordHash = this.password;
//   return new Promise((resolve, reject) => {
//     bycrypt.compare(password, passwordhash, (err, same) => {
//       if(err) {
//         return reject(err);
//       }

//       resolve(same);
//     })
//   })
// }

// export User model 
module.exports = User = mongoose.model('users', UserSchema);
