import express from 'express';
const router = express.Router();
import Item from '../models/item';
import User from '../models/user';
import Chat from '../models/chat';
import Notification from '../models/notification';
import middleware from '../middleware';

// var multer = require('multer');
// var storage = multer.diskStorage({
//   filename: function(req, file, callback) {
//     callback(null, Date.now() + file.originalname);
//   }
// });
// var imageFilter = function (req, file, cb) {
//     // accept image files only
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
//         return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };
// var upload = multer({ storage: storage, fileFilter: imageFilter})

// var cloudinary = require('cloudinary');
// cloudinary.config({
//   cloud_name: 'cloudxx365',
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// Define escapeRegex function for search feature
const escapeRegex = (text: string) =>
  text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

// INDEX - show all courses
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const perPage: number = 8;
    const pageQuery = parseInt(`${req.query.page}`);
    const pageNumber: number = pageQuery ? pageQuery : 1;
    let noMatch = null;
    if (req.query.search) {
      const regex = new RegExp(escapeRegex(`${req.query.search}`), 'gi');
      let allItems = await Item.find({title: `${regex}`})
        .skip(perPage * pageNumber - perPage)
        .limit(perPage)
        .exec();
      let count = await Item.count({title: `${regex}`}).exec();
      if (allItems.length < 1) {
        noMatch = 'No items match that query, please try again.';
      }
      res.json({
        items: allItems,
        current: pageNumber,
        pages: Math.ceil(count / perPage),
        noMatch: noMatch,
        search: req.query.search,
      });
    } else {
      // get all campgrounds from DB
      let allItems = await Item.find({})
        .skip(perPage * pageNumber - perPage)
        .limit(perPage)
        .exec();
      let count = await Item.countDocuments().exec();
      res.json({
        items: allItems,
        current: pageNumber,
        pages: Math.ceil(count / perPage),
        noMatch: noMatch,
        search: false,
      });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// //INDEX - show all courses
// router.get("/", function(req, res){
//   if(req.query.search && req.xhr) {
//       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
//       // Get all courses from DB
//       Course.find({title: regex}, function(err, allCourse){
//          if(err){
//             console.log(err);
//          } else {
//             res.status(200).json(allCourse);
//          }
//       });
//   } else {
//       // Get all courses from DB
//       Course.find({}, function(err, allCourse){
//          if(err){
//              console.log(err);
//          } else {
//             if(req.xhr) {
//               res.json(allCourse);
//             } else {
//               res.render("course/index",{course: allCourse, page: 'course'});
//             }
//          }
//       });
//   }
// });

//CREATE - add new course to DB
router.post(
  '/',
  middleware.isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    try {
      // get data from form and add to courses array
      var newItem = {
        title: req.body.title,
        image: req.body.image,
        description: req.body.description,
        seller: req.user,
        price: req.body.price,
        tag: req.body.tag,
        userIsAnonymous: req.body.anonymous,
        category: req.body.category,
        ApproxTime: {
          month: req.body.month,
          year: req.body.year,
        },
      };
      let item = await Item.create(newItem);
      let users = await User.find({folCategory: item.category}).exec();
      let newNotification = {
        targetItem: item,
        message: 'Another item came for you in which u may be interested',
      };
      // Socket !!
      for (let follower of users) {
        let notification = await Notification.create(newNotification);
        follower.notifs.push(notification);
        follower.save();
      }
      res.send('Done');
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// SHOW - shows more info about one item
router.get('/:id', async (req: express.Request, res: express.Response) => {
  try {
    //find the item with provided ID
    let item;
    if (req.user) {
      item = await Item.findById(req.params.id).exec();
      if (item.seller === req.user.id) {
        await item.populate('chats').execPopulate();
      } else {
        await item
          .populate({
            path: 'chats',
            match: {user2: req.user.id},
          })
          .execPopulate();
      }
    } else {
      item = await Item.findById(req.params.id).exec();
    }
    res.json(item);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// PUT - updates course in the database
router.put(
  '/:id',
  middleware.isLoggedIn,
  middleware.checkUserItem,
  async (req: express.Request, res: express.Response) => {
    try {
      let nn: boolean = false;
      if (req.body.category !== req.item.category) {
        nn = true;
      }
      req.item.title = req.body.title;
      req.item.image = req.body.image;
      req.item.description = req.body.description;
      req.item.seller = req.user;
      req.item.price = req.body.price;
      req.item.tag = req.body.tag;
      req.item.userIsAnonymous = req.body.anonymous;
      req.item.category = req.body.category;
      req.item.ApproxTime = {
        month: req.body.month,
        year: req.body.year,
      };
      await req.item.save();
      let users = await User.find({folCategory: req.item.category}).exec();
      let newNotification = {
        targetItem: req.item,
        message: 'updated an item',
      };
      // Socket !!
      for (let follower of users) {
        let notification = await Notification.create(newNotification);
        follower.notifs.push(notification);
        follower.save();
      }
      for (let notifusers of req.item.chats) {
        let notification = await Notification.create(newNotification);
        let userx = await User.findById(notifusers.user2).exec();
        userx.notifs.push(notification);
        await userx.save();
      }
      res.send('Done');
    } catch (err) {
      res.send(500).send(err.message);
    }
  }
);

// DELETE - removes course and its comments from the database
router.delete(
  '/:id',
  middleware.isLoggedIn,
  middleware.checkUserItem,
  async (req: express.Request, res: express.Response) => {
    try {
      let newNotification = {
        targetItem: req.item,
        message: 'deleted an item',
      };
      for (let notifusers of req.item.chats) {
        let notification = await Notification.create(newNotification);
        let userx = await User.findById(notifusers.user2).exec();
        userx.notifs.push(notification);
        await userx.save();
        Chat.findOneAndRemove({_id: notifusers.id});
      }
      await req.item.remove();
      res.status(206).send('Deleted');
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

router.post(
  '/:id/sellIni',
  middleware.isLoggedIn,
  middleware.checkUserItem,
  async (req: express.Request, res: express.Response) => {
    try {
      let user = await User.findOne({
        $or: [{_id: req.body.id}, {email: req.body.email}],
      }).exec();
      if (!user) {
        req.flash('error', 'No user found');
        res.send(300);
      } else {
        req.item.buyer = user;
        req.item.buy_date = new Date(Date.now());
        req.item.status = 'INPROCESS';
        for (let chat of req.item.chats) {
          chat.active = false;
          chat.save();
        }
        let newNotification = {
          targetItem: req.item,
          message: 'deleted an item',
        };
        let notification = await Notification.create(newNotification);
        user.notifs.push(notification);
        await user.save();
        await req.item.save();
        req.flash('success', 'jhgd');
        res.send('done');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

router.post(
  ':id/sellFin',
  middleware.isLoggedIn,
  middleware.checkItem,
  async (req: express.Request, res: express.Response) => {
    try {
      if (req.body.accept) {
        req.item.status = 'SOLD';
        await req.item.save();
        res.send('Done');
      } else {
        req.item.status = 'UNSOLD';
        req.item.buy_date = undefined;
        req.item.buyer = undefined;
        for (let chat of req.item.chats) {
          chat.active = true;
          chat.save();
        }
        let newNotification = {
          targetItem: req.item,
          message: 'deleted an item',
        };
        let notification = await Notification.create(newNotification);
        req.item.seller.notifs.push(notification);
        await req.item.seller.save();
        await req.item.save();
        req.flash('success', 'jhgd');
        res.send('done');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

router.put(
  '/id/report',
  middleware.isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    try {
      let item = await Item.findById(req.params.id).exec();
      item.isReported = true;
      await item.save();
      req.flash('success', 'Item reported!');
      res.send('/item/' + req.params.id);
    } catch (err) {
      console.log(err);
      req.flash('error', err.message);
      res.send('/');
    }
  }
);

export default router;