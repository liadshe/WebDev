const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  picture: { type: String },
  genrePreferences: [{ type: String }],
  likedContent: [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  profiles: { type: [ProfileSchema], validate: [arr => arr.length <= 5, 'Max 5 profiles'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);