const express = require('express');
const chatRoutes = express.Router();
const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

//CREATE CHAT

chatRoutes.post('/chats/create', (req, res, next) => {

  console.log('body', req.body)

  const { company, seeker } = req.body;


  Chat.find({ company: company, seeker: seeker })
    .then(chatsFromDB => {
      if (chatsFromDB.length > 0) {
        console.log(chatsFromDB)
        let chat = chatsFromDB[0]
        console.log('There is already a chat between these two users')
        console.log(chat)
        res.status(200).json(chat);
      } else {
        const newChat = new Chat({
          company: company,
          seeker: seeker,
          messages: []
        });

        newChat.save(error => {

          if (error) {
            res.status(400).json({ message: 'Error while creating new chat' });
            return;
          }

          Chat.find({ company: company, seeker: seeker })
            .then(chatsFromDB => {
              let chat = chatsFromDB[0]
              console.log('Chat object created successfully')
              res.status(200).json(chat);
            })
            .catch(error => res.status(400).json(error))

          // console.log({newChat})
          // res.status(200).json( newChat );
        });
      }
    })
    .catch(error => res.status(400).json(error))
});

//GET specific chat
chatRoutes.get('/chats/:chatID', (req, res, next) => {

  const { chatID } = req.params;

  Chat.findById(chatID).populate('messages')
    .then(chatFromDB => {
      res.status(200).json(chatFromDB);
    })
    .catch(error => res.json(error))

});

//POST create message
chatRoutes.post('/chats/:chatID/createMessage', (req, res, next) => {

  console.log(req.body)
  let { senderID, senderName, content } = req.body
  let { chatID } = req.params

  let newMessage = new Message({
    senderName: senderName,
    senderID: senderID,
    content: content
  });

  newMessage.save((error, msg) => {

    if (error) {
      res.status(400).json({ message: 'Error while creating new message object' });
      return;
    }

    console.log(msg)

    Chat.findByIdAndUpdate(chatID, {
      $push: { messages: msg._id }
    }).
      then(response => {
        console.log(response)
        res.status(200).json(response);
      })
      .catch(error => console.log(error))
  })

})

//GET user messages
chatRoutes.get('/:userID/chats', (req, res, next) => {

  let { userID } = req.params

  Chat.find({
    $or: [
      { company: userID },
      { seeker: userID }
    ]
  }).populate('company')
    .populate('seeker')
    .then(chatsFromDB => {
      res.status(200).json(chatsFromDB);
    })
    .catch(error => res.status(400).json({ message: 'Error while retrieving chats' }))
})

module.exports = chatRoutes;
