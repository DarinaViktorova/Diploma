import axios from "axios";

export const getUserByUsername = async (username) => {
  return await axios.get(`/users?username=${username}`);
}

export const getFriendByUserId = async (userId) => {
  return await axios("/users?userId=" + userId);
}

export const getFriendsList = async (userId) => {
  return await axios.get("/users/friends/" + userId);
} 

export const putUserFollow = async (userId, currentUserId) => {
  return await axios.put(`/users/${userId}/follow`, {
    userId: currentUserId,
  });
}

export const putUserUnfollow = async (userId, currentUserId) => {
    return await axios.put(`/users/${userId}/unfollow`, {
        userId: currentUserId,
      });
}

