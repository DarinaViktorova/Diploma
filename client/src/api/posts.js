import axios from "axios";

export const getPost = (postId) => {
    return axios.get(`/posts/${postId}`);
}

export const getPostsListOnProfile = async (username) => {
    return await axios.get(`/posts/profile/${username}`);
}

export const getPostsListOnTimeline = async (userId) => {
    return await axios.get(`/posts/timeline/${userId}`);
}

export const postUploadFile = async (data) => {
    return await axios.post("/upload", data);
}

export const postNewPost = async (newPost) => {
    return await axios.post("/posts", newPost);
}

export const deletePost = async (postId, currentUserId) => {
    return  await axios.delete(`/posts/${postId}`, {
        data: { userId: currentUserId },
      });
}

export const getLikes = async (postUserId) => {
    return await axios.get(`/users?userId=${postUserId}`);
}

export const putLike = (postId, currentUserId) => {
    return axios.put("/posts/" + postId + "/like", { 
        userId: currentUserId 
    });
}

export const getComments = async (postId) => {
    return await axios.get(`/posts/${postId}/comments`);
}

export const putComment = async (postId, currentUserId, commentText) => {
    return await axios.put(`/posts/${postId}/comments`, {
        userId: currentUserId,
        text: commentText,
      });
}