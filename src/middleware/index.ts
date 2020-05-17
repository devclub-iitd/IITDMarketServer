import Item from '../models/item';
import Review from '../models/review';
import User from '../models/user';
import {Request, Response, NextFunction} from 'express';
import moment from 'moment'

export default {
  isLoggedIn: async (req:Request, res:Response, next:NextFunction) => {
    if (req.isAuthenticated()) {
      if (!req.user.isBanned) {
        if (req.user.banExpires && moment(req.user.banExpires) > moment(Date.now())) {
          req.flash('error', 'User has been banned temporarily');
          return res.status(500).send('/course');
        } else {
          return next();
        }
      } else {
        req.flash('error', 'User has been banned permanently');
        return res.status(500).send('/course');
      }
    }
    req.flash('error', 'You must be signed in to do that!');
    res.status(500).send('/login');
  },
  checkUserItem: (req:Request, res:Response, next:NextFunction) => {
    Item.findById(req.params.id).exec(async (err, foundItem) => {
      if (err || !foundItem) {
        console.log(err);
        req.flash('error', 'Sorry, that course does not exist!');
        res.status(500).send('/item');
      } else if (foundItem.seller === req.user._id || req.user.isAdmin) {
        req.item = await foundItem.populate('chats').execPopulate();
        next();
      } else {
        req.flash('error', "You don't have permission to do that!");
        res.status(500).send('/item/' + req.params.id);
      }
    });
  },
  checkItem: (req:Request, res:Response, next:NextFunction) => {
    Item.findById(req.params.id).exec(async (err, foundItem) => {
      if (err || !foundItem) {
        console.log(err);
        req.flash('error', 'Sorry, that course does not exist!');
        res.status(500).send('/item');
      } else if (foundItem.buyer === req.user._id) {
        if (!req.body.accept){ 
          req.item = await foundItem.populate('chats').execPopulate();
          next();
        } else {
          req.item = foundItem;
          next();
        }
      } else {
        req.flash('error', "You don't have permission to do that!");
        res.status(500).send('/item/' + req.params.id);
      }
    });
  },
  isAdmin: (req:Request, res:Response, next:NextFunction) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      req.flash('error','This site is now read only thanks to spam and trolls.');
      res.status(500).send('/item');
    }
  },
  checkReviewOwnership: (req:Request, res:Response, next:NextFunction) => {
    if (req.isAuthenticated()) {
      Review.findById(req.params.review_id, (err:Error, foundReview) => {
        if (err || !foundReview) {
          res.status(500).send('back');
        } else {
          // does user own the review?
          if (foundReview.author === req.user._id || req.user.isAdmin) {
            next();
          } else {
            req.flash('error', "You don't have permission to do that");
            res.status(500).send('back');
          }
        }
      });
    } else {
      req.flash('error', 'You need to be logged in to do that');
      res.status(500).send('back');
    }
  },
  checkUserReviewExistence: async (req:Request, res:Response, next:NextFunction) => {
    if (req.isAuthenticated()) {
      let foundUser = await User.findById(req.params.id).populate('reviews').exec();
          if  (!foundUser) {
            req.flash('error', 'User not found.');
            res.status(500).send('back');
          } else {
            // check if req.user._id exists in foundCourse.reviews
            var foundUserReview = foundUser.reviews.some(
              review => review.author === req.user._id
            );
            if (foundUserReview) {
              req.flash('error', 'You already wrote a review.');
              return res.status(500).send('/users/' + foundUser.id);
            }
            // if the review was not found, go to the next middleware
            return next();
          }
    } else {
      req.flash('error', 'You need to login first.');
      res.status(500).send('back');
    }
  },
  checkRegister: async (req:Request, res:Response, next:NextFunction) => {
    let exp:RegExp = /iitd\.ac\.in$/gm;
    if (!exp.test(req.body.email)) {
      next();
    } else {
      let kebid:RegExp = /^(\w+)/gm;
      kebid.lastIndex = 0;
      let result:RegExpExecArray = kebid.exec(req.body.email);
      let user = await User.findOne({
        email: String(new RegExp(`^${result[0]}`,'gm')),
      }).exec();
      if (user) {
        req.flash('error','You are already registered with email ' + user.email);
        res.status(500).send('/register');
      } else {
        next();
      }
    }
  },
};
