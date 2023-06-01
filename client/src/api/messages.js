import axios from "axios";

export const getUserMessages = async (currentChatId) => {
    return await axios.get("/messages/" + currentChatId)
}

export const postSendMessage = async (message) => {
    return await axios.post("/messages", message);
}