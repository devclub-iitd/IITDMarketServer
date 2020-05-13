import express from 'express'
const router = express.Router({mergeParams:true})
import middleware from '../middleware/index'
import Item from '../models/item'
import Chat from '../models/chat'
import User from '../models/user'

router.post('/new', middleware.isLoggedIn, async (req:express.Request, res:express.Response) => {
    let item = await Item.findById(req.params.id).exec();
    let user = await User.findById(req.user._id).exec();
    let newChat = {
        user1: item.seller,
        user2: user,
        item: item,
        message: ['jjjk']
    }
    let chat = await Chat.create(newChat)
    item.seller.chats.push(chat)
    await item.seller.save()
    item.chats.push(chat)
    await item.save()
    req.user.chats.push(chat)
    user.chats.push(chat)
    await user.save()
    req.login(user, () => {})
    req.flash('success', 'Successfully followed ' + req.params.id + '!');
    res.send('/item/' + req.params._id);
})

router.get('/:chatId', middleware.isLoggedIn, async (req, res) => {
    let chat = await Chat.findById(req.params.chatId).exec()
    res.json(chat)
})

router.put('/:chatId', middleware.isLoggedIn, async (req, res) => {
    let chat =  await Chat.findById(req.params.chatId).exec()
    chat.messages.push(req.body.message)
    await chat.save()
    res.send('Done')
})

export default router