const express = require("express");
const app = express();
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const reminderController = require("./controller/reminder_controller");
const authController = require("./controller/auth_controller");
const passport = require("./middleware/passport");
const session = require("express-session");
const check = require("./middleware/checkAuth")

app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(express.urlencoded({ extended: false }));

app.use(ejsLayouts);

app.set("view engine", "ejs");

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.user);

  console.log("Entire session object:");
  console.log(req.session);

  console.log(`Session details are: `);
  console.log(req.session.passport);
  next();
});

// Routes start here

app.get("/reminders", check.ensureAuthenticated, reminderController.list);

app.get("/reminder/new", check.ensureAuthenticated, reminderController.new);

app.get("/reminder/:id", check.ensureAuthenticated, reminderController.listOne);

app.get("/reminder/:id/edit", check.ensureAuthenticated, reminderController.edit);

app.post("/reminder/", check.ensureAuthenticated, reminderController.create);

app.get("/dashboard", check.ensureAuthenticated, (req, res) => {
  res.send("WElcome " + req.user.name)
})

// Implement this yourself
app.post("/reminder/update/:id", check.ensureAuthenticated, reminderController.update);

// Implement this yourself
app.post("/reminder/delete/:id", check.ensureAuthenticated, reminderController.delete);

// Fix this to work with passport! The registration does not need to work, you can use the fake database for this.
app.get("/register", check.forwardAuthenticated, authController.register);
app.get("/login", check.forwardAuthenticated, authController.login);
app.post("/register", check.forwardAuthenticated, authController.registerSubmit);
app.post("/login", check.forwardAuthenticated, authController.loginSubmit);

app.listen(3001, function () {
  console.log(
    "Server running. Visit: localhost:3001/reminders in your browser 🚀"
  );
});
