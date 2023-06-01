

const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000",
    },
});


let users = [];
let comments = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId);
}


io.on("connection", (socket) => {
    // When connect
    console.log("A user connected ...");

    // Take userId and socketId from user (client)
    socket.on("addUser", userId => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    })

    // Send and get message
    socket.on("sendMessage", ({senderId, receiverId, text}) => {
        const user = getUser(receiverId);
        if (user) {
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            });
        } else {
            console.log(`User ${receiverId} not found`);
        }
    })

    // Send and get comments
    socket.on("addComment", async ({ postId, comment }) => {
        if (!comments[postId]) {
            comments[postId] = [comment];
          } else {
            comments[postId].push(comment);
          }
          io.emit("newComment", comments[postId]);
      });
      
    // Receive new comments
    socket.on("getComments", (postId) => {
        io.to(socket.id).emit("comments", comments[postId] || []);
      });

    // Disconnection  function
    socket.on("disconnect", () => {
        console.log("A user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    })
})