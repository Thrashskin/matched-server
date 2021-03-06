const express = require('express');
const chatRoutes = express.Router();
const mongoose = require('mongoose');
const Chat = require('../models/Chat');

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
        res.status(200).json( chat );
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
            res.status(200).json( chat );
          })
          .catch(error => res.status(400).json(error))

          // console.log({newChat})
          // res.status(200).json( newChat );
        });
      }
    })
    .catch(error => res.status(400).json(error))
});

chatRoutes.get('/chats/:chatID', (req, res, next) => {

  const { chatID } = req.params;

  Chat.findById(chatID)
    .then(chatFromDB => {
      res.status(200).json(chatFromDB);
    })
    .catch(error => res.json(error))

});

chatRoutes.post('/chats/:chatID/createMessage')
module.exports = chatRoutes;
