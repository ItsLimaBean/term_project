let database = require("../database");

let remindersController = {
  list: (req, res) => {
    res.render("reminder/index", { reminders: database[req.session.passport.user].reminders });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database[req.session.passport.user].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: database[req.session.passport.user].reminders });
    }
  },

  create: (req, res) => {
    let reminder = {
      id: database[req.session.passport.user].reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false,
    };
    database[req.session.passport.user].reminders.push(reminder);
    res.redirect("/reminders");
  },

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database[req.session.passport.user].reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
    const toFindReminder = req.params.id;

    for (const reminder of database[req.session.passport.user].reminders) {
      if (reminder.id == toFindReminder) {
        reminder.title = req.body.title;
        reminder.description = req.body.description;
        reminder.completed = req.body.completed === "true" ? true : false;
        res.redirect(`/reminder/${toFindReminder}`);
        return;
      }
    }
    res.send("Unable to find reminder id provied.");
  },

  delete: (req, res)=> {
    const toDelete = req.params.id;
    
    for (let i = 0; i < database[req.session.passport.user].reminders.length; i++) {
      if (database[req.session.passport.user].reminders[i].id == toDelete) {
        delete database[req.session.passport.user].reminders[i]
      }
    }
    res.redirect("/reminders");
  },
};

module.exports = remindersController;
