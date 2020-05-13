import mongoose from "mongoose";
import { IUser } from "./user";
const voting = require("mongoose-voting");

export interface IReview extends mongoose.Document {
    rating: number
    text: String
    author: IUser
    user: IUser
    isReported: Boolean
    isAnonymous: Boolean
    upvoted: (user:IUser) => Boolean
    downvoted: (user:IUser) => Boolean
    unvote:(user:IUser) => void
    upvote:(user:IUser) => void
    downvote:(user:IUser) => void
    upvotes: () => number
    downvotes: () => number
}

const reviewSchema = new mongoose.Schema({
    rating: {
        // Setting the field type
        type: Number,
        // Making the star rating required
        required: "Please provide a rating (1-5 stars).",
        // Defining min and max values
        min: 1,
        max: 5,
        // Adding validation to see if the entry is an integer
        validate: {
            // validator accepts a function definition which it uses for validation
            validator: Number.isInteger,
            message: "{VALUE} is not an integer value."
        }
    },
    // review text
    text: {
        type: String
    },
    // author id and username fields
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // user associated with the review
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isReported: { type: Boolean, default: false },
    isAnonymous: { type: Boolean, default: false }
}, {
    // if timestamps are set to true, mongoose assigns createdAt and updatedAt fields to your schema, the type assigned is Date.
    timestamps: true
});

reviewSchema.plugin(voting);

export default mongoose.model<IReview>("Review", reviewSchema);    