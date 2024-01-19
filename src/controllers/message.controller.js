const { Router } = require('express');
const HTTP_RESPONSES = require('../constants/http-responses.contant');
const Message = require('../models/message.model');
const messagesService = require('../services/messages.service');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const messages = await messagesService.getAll();
    res.json({ status: 'success', payload: messages });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const message = await messagesService.getById(id);
    if (!message) {
      return res
        .status(HTTP_RESPONSES.NOT_FOUND)
        .json({ status: 'error', error: 'Message not found' });
    }
    res.json({ status: 'success', payload: message });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user, message } = req.body;
    const newMessage = {
      user,
      message,
      timestamp: new Date(),
    };
    const savedMessage = await messagesService.insertOne(newMessage);
    res
      .status(HTTP_RESPONSES.CREATED)
      .json({ status: 'success', payload: savedMessage });
  } catch (error) {
    console.log(error);
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});

router.put('/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { user, message } = req.body;
    const updateData = { user, message };
    const updatedMessage = await messagesService.updateOne(messageId, updateData);
    if (!updatedMessage) {
      return res
        .status(HTTP_RESPONSES.NOT_FOUND)
        .json({ status: 'error', error: 'Message not found' });
    }
    res
      .status(HTTP_RESPONSES.OK)
      .json({ status: 'success', payload: updatedMessage });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});
router.delete('/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const deletedMessage = await messagesService.deleteById(messageId);
    if (!deletedMessage) {
      return res
        .status(HTTP_RESPONSES.NOT_FOUND)
        .json({ status: 'error', error: 'Message not found' });
    }
    res
      .status(HTTP_RESPONSES.OK)
      .json({ status: 'success', payload: deletedMessage });
  } catch (error) {
    res
      .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
      .json({ status: 'error', error });
  }
});

module.exports = router;
