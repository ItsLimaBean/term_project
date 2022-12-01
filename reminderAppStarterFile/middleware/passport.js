const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userController = require("../controller/userController");
const localLogin = new LocalStrategy(
  {
    usernameField: "exampleInputEmail1",
    passwordField: "exampleInputPassword1",
  },
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password);
    console.log("localstaregy")
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);

passport.serializeUser(function (user, done) {
    console.log("serialize")
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  let user = userController.getUserById(id);
    console.log("deserialize")
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

module.exports = passport.use(localLogin);
