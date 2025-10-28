const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  picture: { type: String },
  genrePreferences: [{ type: String }],
  likedContent: [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  profiles: {
    type: [ProfileSchema],
    validate: [(arr) => arr.length <= 5, "Max 5 profiles"],
  },
  createdAt: { type: Date, default: Date.now },
});

// if this is a brand-new user and they have no profiles yet so creating a default profile
UserSchema.pre("save", function (next) {
  if (this.isNew && (!this.profiles || this.profiles.length === 0)) {
    this.profiles = [
      {
        name: this.username, // default profile name
        picture: "cow.jpg", // optional default picture
        genrePreferences: [],
        likedContent: [],
      },
    ];
  }
  next();
});
module.exports = mongoose.model("User", UserSchema);
