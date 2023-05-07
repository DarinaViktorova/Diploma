const router = require("express").Router();
const Message = require("../models/model.message");

// Add
router.post("/", async (request, response) => {
    const newMessage = new Message(request.body);

    try {
        const savedMessage = await newMessage.save();
        response.status(200).json(savedMessage);
    } catch (error) {
        response.status(500).json(error);
    }
})

// Get
router.get("/:conversationId", async (request, response) => {
    try {
        const messages = await Message.find({
            conversationId: request.params.conversationId,
        });
        response.status(200).json(messages);
    } catch (error) {
        response.status(500).json(error);
    }
})

module.exports = router;