The proposed documents in the mongodb database are:
1. User
2. Item
3. Review
4. Notification
5. Chat
6. Message

The proposed schemas for each of the above documents are as follows:

### User
```
{
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    email: String,
    description: String,
    folCategory: [
    	{
	    type: String
	}
    ],
    isBanned: Boolean,
    banExpires: Date,
    isAdmin: Boolean,
    contact_number: String,
    entry_number: String,
    hostel: String,
    avatar: String,
    chatPersons: [
    	{
	    username: String,
	    _id: String
	}
    ],
    notifs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notification'
        }
    ],
    review: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
}
```

### Item
```
{
    title: String,
    seller: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
    },
    buyer: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
    },
    category: {
        type: String,
        enum: ["GENERAL","COOLER","LAPTOP","CYCLE","MATTRESS",],
        trim: true,
        default: "GENERAL",
    }
    tag: String,
    price: Number,
    description: String,
    images: [
        {
            type: String,
        }
    ],
    buy_date: Date,
    ApproxTime: {
        month: {
            type: Number,
            min: 1,
            max: 12,
        },
        year: Number,
    },
    status: {
        type: String,
        enum: ["UNSOLD","INPROCESS","SOLD"],
    },
    isReported: {
        type: Boolean,
        default: false,
    },
    userIsAnonymous: {
        type: Boolean,
        default: false,
    },
}
```

### Review
```
{
    rating: {
        type: Number,
        required: "Please provide a rating (1-5 stars).",
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: "{VALUE} is not an integer value."
        }
    },
    text: String,
    author: {
        username: String,
	_id: String
    },
    // user associated with the review
    user: {
        username: String,
	_id: String
    },
    isReported:{
        type:Boolean,
        default:false
    },
    isAnonymous:{
        type:Boolean, 
        default:false
    },
}
```

### Notification
```
{
    target: String,
    message: String,
    isRead: {
        type: Boolean,
        default: false
    },
    isItem: Boolean
}
```

### Chat
```
{
    user1: {
        username: String,
	_id: String
    }
    user2: {
        username: String,
	_id: String
    }
    item: {
        title: String,
	_id: String
    }
    messages: [
         type: mongoose.Schema.Types.ObjectId,
	 ref: 'Message'
    ],
    active: Boolean
}
```

### Message
```
{
    from: {
    	username: String,
	_id: String
    },
    to: {
    	username: String,
	_id: String
    },
    message: String
}
```

For various API endpoints and their implementation details see [API Implementations](https://github.com/devclub-iitd/IITDMarketServer/wiki)
