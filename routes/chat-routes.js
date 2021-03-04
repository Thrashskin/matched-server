const express = require('express');
const chatRoutes = express.Router();
const mongoose = require('mongoose');
const Chat = require('../models/Chat');

//CREATE CHAT

chatRoutes.post('/chats/create', (req, res, next) => {

  const {company, seeker} = req.body;

  const newChat = new Chat({
    company: company,
    seeker: seeker,
    messages: []
  });

  newChat.save(error => {
    if(error) {
      res.status(400).json({ message: 'Error while creatging new chat' });
      return; 
    }

    res.status(200).json({newChat});

  })

})

chatRoutes.get('/chats/:chatID', (req, res, next) => {

  const {chatID} = req.params;

  Chat.findById(chatID)
  .then(chatFromDB => {
    //res.io.emit("socket", "chats");
    res.status(200).json(chatFromDB);
  })
  .catch(error => res.json(error))

});

module.exports = chatRoutes;
