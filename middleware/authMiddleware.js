const passport = require("passport");

const authMid = async (req, res, next) => {
  await passport.authenticate("jwt", { session: false }, async (err, user) => {
    if (!user || err) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized",
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

module.exports = authMid;

// checkAuth, stara wersja
