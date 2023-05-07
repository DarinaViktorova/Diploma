const router = require("express").Router();
const Conversation = require("../models/model.conversation");

// New conversation
router.post("/", async (request, response) => {
    const newConversation = new Conversation ({
        members: [request.body.senderId, request.body.receiverId],
    })

    try {
        const savedConversation = await newConversation.save();
        response.status(200).json(savedConversation);
    } catch (error) {
        response.status(500).json(error);
    }
})

router.post("/conversations", async (request, response) => {
    const newConversation = new Conversation ({
        members: [request.body.senderId, request.body.receiverId],
    })

    try {
        const savedConversation = await newConversation.save();
        response.status(200).json(savedConversation);
    } catch (error) {
        response.status(500).json(error);
    }
})

// Get conversation of a user
router.get("/:userId", async (request, response) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [request.params.userId] }
        });
        response.status(200).json(conversation);
    } catch (error) {
        response.status(500).json(error);
    }
})

module.exports = router;