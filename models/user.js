import mongoose from 'mongoose'
const { Schema } = mongoose

const User = new Schema({
  login: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    minlength: 4,
    maxlength: 40,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 5,
  },
  watchlist: [
    {
      type: Object,
    },
  ],
})

export default mongoose.model('User', User)
