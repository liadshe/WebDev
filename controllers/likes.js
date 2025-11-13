const User = require("../models/User");

async function toggleLike(req, res) {
  try {
    const userId = req.session?.user?._id;
    const profileName = req.session?.activeProfile?.name;
    const { contentId } = req.body;

    if (!userId || !profileName) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const profile = user.profiles.find((p) => p.name === profileName);
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    const alreadyLiked = profile.likedContent.includes(contentId);

    if (alreadyLiked) {
      profile.likedContent.pull(contentId);
    } else {
      profile.likedContent.addToSet(contentId);
    }

    await user.save();

    return res.json({
      liked: !alreadyLiked,
    });
  } catch (err) {
    console.error("toggleLike error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { toggleLike };
