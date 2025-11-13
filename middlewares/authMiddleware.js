function ensureAuth(req, res, next) {
  if (!req.session || !req.session.user || !req.session.user._id) {
    return res.redirect("/login");
  }
  next();
}

module.exports = ensureAuth;