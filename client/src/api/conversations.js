import axios from "axios";

export const getUserConversations = async (userId) => {
    return await axios.get("/conversations/" + userId);
}

export const postUserConversation = async (userId, currentUserId) => {
    return await axios.post("/conversations", {
      senderId: currentUserId,
      receiverId: userId,
    });
  }