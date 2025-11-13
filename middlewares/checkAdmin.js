function checkAdmin(req, res, next) {
  try {
    if (!req.session.user || req.session.user.username !== "admin") {

      return res
        .status(403)
        .render("forbidden", { message: "Access denied: Admins only" });
    } else {
      next();
    }
  } catch (err) {
    return res
      .status(403)
      .render("forbidden", { message: "Access denied: Admins only" });
  }
}
module.exports = checkAdmin;
