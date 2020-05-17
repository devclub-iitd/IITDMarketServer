import express from 'express';
const router = express.Router();
import passport from 'passport';
import User from '../models/user';
import Item from '../models/item';
import Chat from '../models/chat';
import Review from '../models/review';
import Notification from '../models/notification';
import middleware from '../middleware';
import {Document} from 'mongoose';
import {error} from 'console';

//User Profile
router.get('/:id', async (req: express.Request, res: express.Response) => {
  try {
    let foundUser = await User.findById(req.params.id)
      .populate('reviews')
      .populate({
        path: 'chats',
        match: {
          $and: [
            {active: true},
            {$or: [{user1: req.params.id}, {user2: req.params.id}]},
          ],
        },
      })
      .exec();
    let foundItem = await Item.find({
      $and: [{seller: foundUser}, {userIsAnonymous: true}],
    }).exec();
    if (req.user || req.user.id !== req.params.id) {
      await foundUser.depopulate('chats').execPopulate();
    }
    res.json({user: foundUser, item: foundItem});
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put(
  '/:id/ban',
  middleware.isAdmin,
  async (req: express.Request, res: express.Response) => {
    try {
      let user = await User.findById(req.params.id).exec();
      if (!user.isAdmin) {
        user.isBanned = true;
      }
      user.folCategory = [];
      await Chat.remove({
        _id: {$in: user.chats},
      }).exec();
      await Item.remove({seller: user._id}).exec();
      await user.save();
      res.send();
    } catch (err) {
      console.log(err);
      req.flash('error', err.message);
      res.status(500).send('back');
    }
  }
);

router.put('/:id/ban/temp', middleware.isAdmin, async function (
  req: express.Request,
  res: express.Response
) {
  try {
    let user = await User.findById(req.params.id).exec();
    if (!user.isAdmin) {
      user.banExpires = new Date(
        Date.now() + 3600000 * 24 * Number(req.body.day)
      );
    }
    await user.save();
    res.send('back');
  } catch (err) {
    console.log(err);
    req.flash('error', err.message);
    res.status(500).send('back');
  }
});

router.put(
  '/:id',
  middleware.isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    try {
      let user = await User.findById(req.params.id).exec();
      if (req.user._id !== user._id || req.user.isAdmin) {
        throw error('invalid user');
      }
      user.avatar = req.body.avatar;
      user.contact_number = req.body.contactNumber;
      user.entry_number = req.body.entryNumber;
      user.hostel = req.body.hostel;
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.email = req.body.email;
      user.description = req.body.description;
      await user.save();
      req.login(user, () => {});
      res.send('Done');
    } catch (err) {
      console.log(err);
      req.flash('error', err.message);
      res.status(500).send('back');
    }
  }
);

export default router;
