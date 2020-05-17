import express from 'express';
const router = express.Router({mergeParams: true});
import Review, {IReview} from '../models/review';
import User from '../models/user';
import Notification from '../models/notification';
import middleware from '../middleware';

// Reviews Index
router.get('/', (req: express.Request, res: express.Response) => {
  User.findById(req.params.id)
    .populate({
      path: 'reviews',
      options: {sort: {createdAt: -1}}, // sorting the populated reviews array to show the latest first
    })
    .exec((err, user) => {
      if (err || !user) {
        req.flash('error', err.message);
        res.status(500).send(err.message);
      }
      res.status(200).json(user);
    });
});

// Reviews Create
router.post(
  '/',
  middleware.isLoggedIn,
  middleware.checkUserReviewExistence,
  async (req: express.Request, res: express.Response) => {
    try {
      //lookup course using ID
      let user = await User.findById(req.params.id)
        .populate('reviews')
        .populate('notifs')
        .exec();
      let review = await Review.create(req.body.review);
      //add author username/id and associated course to the review
      review.author = req.user;
      review.user = user;
      //save review
      await review.save();
      user.reviews.push(review);
      // calculate the new average review for the course
      user.rating = calculateAverage(user.reviews);
      //save course
      let newNotification = {
        username: req.user.username,
        targetSlug: user,
        message: 'created a new review',
      };
      let notification = await Notification.create(newNotification);
      user.notifs.push(notification);
      await user.save();
      req.flash('success', 'Your review has been successfully added.');
      res.send('/users/' + req.params.id);
    } catch (err) {
      console.log(err);
      req.flash('error', err.message);
      res.send(500).status(err.message);
    }
  }
);

//calculates average
const calculateAverage = (reviews: IReview[]) => {
  if (reviews.length === 0) {
    return 0;
  }
  var sum: number = 0;
  reviews.forEach(element => {
    sum += element.rating;
  });
  return sum / reviews.length;
};

// Reviews Update
router.put(
  '/:review_id',
  middleware.isLoggedIn,
  middleware.checkReviewOwnership,
  async (req: express.Request, res: express.Response) => {
    try {
      await Review.findByIdAndUpdate(req.params.review_id, req.body.review, {
        new: true,
      }).exec();
      let user = await User.findById(req.params.id).exec();
      // recalculate course average
      user.rating = calculateAverage(user.reviews);
      //save changes
      let newNotification = {
        username: req.user.username,
        targetSlug: user,
        message: 'updated a review',
      };
      let notification = await Notification.create(newNotification);
      user.notifs.push(notification);
      await user.save();
      req.flash('success', 'Your review was successfully edited.');
      res.send('/users/' + user.id);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// Reviews Delete
router.delete(
  '/:review_id',
  middleware.isAdmin,
  async (req: express.Request, res: express.Response) => {
    try {
      await Review.findByIdAndRemove(req.params.review_id).exec();
      let user = await User.findByIdAndUpdate(
        req.params.id,
        {$pull: {reviews: req.params.review_id}},
        {new: true}
      )
        .populate('reviews')
        .exec();
      // recalculate course average
      user.rating = calculateAverage(user.reviews);
      let newNotification = {
        username: req.user.username,
        targetSlug: user,
        isCourse: false,
        message: 'deleted a review',
      };
      let notification = await Notification.create(newNotification);
      user.notifs.push(notification);
      await user.save();
      req.flash('success', 'Your review was deleted successfully.');
      res.send('/users/' + req.params.id);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

router.put(
  '/:review_id/report',
  middleware.isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    try {
      let review = await Review.findById(req.params.review_id).exec();
      review.isReported = true;
      await review.save();
      req.flash('success', 'Review reported!');
      res.send('/users/' + req.params.id);
    } catch (err) {
      console.log(err);
      req.flash('error', err.message);
      res.status(500).send('/');
    }
  }
);

router.put(
  '/:review_id/resolve',
  middleware.isAdmin,
  async (req: express.Request, res: express.Response) => {
    try {
      let review = await Review.findById(req.params.review_id).exec();
      review.isReported = false;
      await review.save();
      req.flash('success', 'Review resolved!');
      res.send('/report');
    } catch (err) {
      console.log(err);
      req.flash('error', err.message);
      res.status(500).send('/report');
    }
  }
);

router.put(
  '/:review_id/upvote',
  middleware.isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    try {
      let review = await Review.findById(req.params.review_id).exec();
      if (review.upvoted(req.user.id)) {
        review.unvote(req.user.id);
        await review.save();
        res.status(200).send(review.upvotes() - review.downvotes());
      } else if (review.downvoted(req.user.id)) {
        review.unvote(req.user.id);
        await review.save();
        review.upvote(req.user.id);
        await review.save();
        res.status(200).send(review.upvotes() - review.downvotes());
      } else {
        review.upvote(req.user.id);
        await review.save();
        res.status(200).send(review.upvotes() - review.downvotes());
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('/');
    }
  }
);

router.put(
  '/:review_id/downvote',
  middleware.isLoggedIn,
  async (req: express.Request, res: express.Response) => {
    try {
      let review = await Review.findById(req.params.review_id).exec();
      if (review.downvoted(req.user.id)) {
        review.unvote(req.user.id);
        await review.save();
        res.status(200).send(review.upvotes() - review.downvotes());
      } else if (review.upvoted(req.user.id)) {
        review.unvote(req.user.id);
        await review.save();
        review.downvote(req.user.id);
        await review.save();
        res.status(200).send(review.upvotes() - review.downvotes());
      } else {
        review.downvote(req.user.id);
        await review.save();
        res.status(200).send(review.upvotes() - review.downvotes());
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('/');
    }
  }
);

router.get(
  '/:review_id/votes',
  async (req: express.Request, res: express.Response) => {
    let review = await Review.findById(req.params.review_id).exec();
    res.status(200).json(review.upvotes() - review.downvotes());
  }
);

export default router;
