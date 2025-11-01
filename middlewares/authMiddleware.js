// middleware/authMiddleware.js
function ensureAuth(req, res, next) {
  if (!req.session || !req.session.user || !req.session.user._id) {
    console.log("no user session, redirecting to /login");
    return res.redirect("/login");
  }
  next();
}

module.exports = ensureAuth;