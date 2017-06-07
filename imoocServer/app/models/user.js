var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  phoneNumber: {
    unique: true,
    type: String
  },
  areaCode: String,
  verifyCode: String,
  verified: {
    type: Boolean,
    default: false
  },
  accessToken: String,
  nickname: String,
  gender: String,
  age: String,
  avatar: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

module.exports = mongoose.model('User', UserSchema);

// UserSchema.pre('save', function(next) {
//   if(self.isNew) {
//     self.meta.createAt = self.meta.updateAt = Date.now();
//   }else {
//     self.meta.updateAt = Date.now();
//   }
//   next();
// });

