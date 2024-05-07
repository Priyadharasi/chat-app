module.exports = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({
      message: "No access"
    });
  }
}