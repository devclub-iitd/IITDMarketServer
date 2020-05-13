import express from "express";
const router = express.Router();
import passport from "passport"
import User from "../models/user";
import Item from "../models/item";
import Review from "../models/review";
import Notification from "../models/notification";
import middleware from "../middleware";

//handle sign up logic
router.post("/register", middleware.checkRegister, async (req:express.Request, res:express.Response) => {
  var object: Object = {
    username: req.body.username,
    avatar: req.body.avatar,
    contact_number: req.body.contactNumber,
    entry_number: req.body.entryNumber,
    hostel: req.body.hostel,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    description: req.body.description
  }
  let newUser = new User(object);
  if (req.body.adminCode === process.env.ADMIN_CODE) {
    newUser.isAdmin = true;
  }
  await User.register(newUser, req.body.password);
  res.send('/register');
});

//handling login logic
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/item",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Welcome!"
  }), (req, res) => { });

// logout route
router.get("/logout", (req:express.Request, res:express.Response) => {
  req.logout();
  req.flash("success", "See you later!");
  res.redirect("/item");
});

// follow user
router.get('/follow/:slug', middleware.isLoggedIn, async (req:express.Request, res:express.Response) => {
  try {
    console.log(req.user);
    let user = await User.findById(req.user._id).exec();
    user.folCategory.push(req.params.slug);
    await user.save();
    req.login(user,() => {});
    req.flash('success', 'Successfully followed ' + req.params.id + '!');
    res.redirect('/users/' + req.user._id);
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  }
});

// view all notifications
router.get('/notifications', middleware.isLoggedIn, async (req:express.Request, res:express.Response) => {
  try {
    let user = await User.findById(req.user._id).populate({
      path: 'notifs',
      options: { sort: { "_id": -1 } }
    }).exec();
    let allNotifications = user.notifs;
    res.json(allNotifications);
  } catch (err) {
    req.flash('error', err.message);
    return res.redirect('back');
  }
});

router.get("/report", middleware.isAdmin, async (req:express.Request, res:express.Response) => {
  try {
    const items = await Item.find({ isReported: true }).exec();
    const reviews = await Review.find({ isReported: true }).exec();
    res.json({ items, reviews });
  } catch (err) {
    console.log(err);
    req.flash('error', err.message);
    return res.redirect('back');
  }
})

export default router;