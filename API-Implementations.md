# API Implementations

Implementations for the various routes and their respective endpoints are described below:

***

### /user
#### POST /login
```
// login user
Algo:
```
#### POST /register
```
// register new user
Algo:
```
#### GET
```
// get logged user
Algo:
    Find user in document populate chats, items and notifications and return res
    res: {
        message: String,
        data: UserObject <UserSchema>
    }
```
#### PUT
```
// update user profile
    req: {
	body: {
		should contain new data
	},
    }

Algo:
1. Check for auth
2. Find the user
3. Update the fields
4. Save it
5. Return in res
   
    res: {
        message: String,
        data: updated User Document,
    }
    
```
#### DELETE
```
// delete user profile (sensitive operation)
Algo:
1. Check for auth
2. Delete it

    res: {
        message: String,
    }
```
***

### /item
#### GET
```
// get all items
Algo:
return all items from items document after populating required fields.
    
    res: {
        message: String,
        data: [items],
    }
```
#### POST
```
// post new item
req: {
    body: newItem,
}

Algo:
1. Check for auth
2. Calls create item fn for new item
3. Create new notifications for user who have wishlisted/follwed this particular category.

res: {
    message: String,
    data: [items]
}
```
#### PUT /:id
```
// edit item details (includes any edit operation update, sold, etc)
req: {
    body:{
        updated data
    }
}

Algo:
1. Check for auth
2. Find the item
3. Update the item
4. Notify all the users that have chatted about this item

res: {
    message: String,
    data: [items]
}
```
#### DELETE /:id
```
// delete item

Algo:
1. Check for auth
2. Send notif to all the users who are chatting about this item
3. Deleting the item

res: {
    message: String,
}
```
***

### /review
#### POST
```
// post review for a user
req: {
    body: {
        review body
    }
}

Algo:
1. Check for auth
2. Find the user associated
3. Create a new review
4. Notify the user about the review

res: {
    message: String,
}
```
#### PUT /:id
```
// edit any review
req: {
    body: {
        update review body
    }
}

Algo:
1. Check for auth
2. Find the user associated
3. Update and save the review
4. Notify the user about the review

res: {
    message: String,
    data: updated review
}
```
#### DELETE /:id
```
// delete any review
Algo:
1. Check for auth
2. Find the user associated
3. Delete the review
4. Notify the user about the review

res: {
    message: String,
}
```
***

### /notification

***
// figure out how to manage chats in db after any chat session