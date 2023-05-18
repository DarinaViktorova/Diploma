import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import "./chat.css";
import { SendRounded } from "@material-ui/icons";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {io} from "socket.io-client";


const Chat = () => {

  const { user } = useContext(AuthContext);

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

  // const [username, setUsername] = useState("");
  // const [error, setError] = useState("");

 
  const scrollRef = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", data => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
    currentChat?.members.includes(arrivalMessage.sender) &&
    setMessages((prev) => [...prev, arrivalMessage]);
}, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(user.followings.filter(f => users.some(u => u.userId === f)));
    });
  }, [user]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await axios.get("/conversations/" + user._id);
        setConversations(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axios.get("/messages/" + currentChat?._id);
        setMessages(response.data);
      } catch (error) {
        console.log(error);
      }
    } 
    getMessages();
  }, [currentChat]);
  
 
/**----------------------------------------------------------------------- */
  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const response = await axios.post("/messages", message);
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: "smooth"});
  }, [messages]);

  return (
    <>
      <Topbar />
      <div className="chat">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <h1>Conversations</h1>
            {conversations.map(conv => (
              <div key={conv._id} onClick={() => setCurrentChat(conv)}>
                <Conversation conversation={conv}  currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {
              currentChat ?
            <>
            <div className="chatBoxTop">
              {messages.map(msg => (
                <div ref={scrollRef}>
                <Message  
                  message={msg}
                  own={msg.sender === user._id}
                />
                </div>
              ))}

            </div>
            <div className="chatBoxBottom">
              <textarea 
                className="chatMessageInput" 
                placeholder="Message"
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
                ></textarea>
              <button className="chatSubmitButton" onClick={handleSend}><SendRounded /></button>
            </div>
            </> : <div className="messageStartContainer">
                <span className="noConversationText">Open a conversation to start a chat</span>
              </div>
            }
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline 
              onlineUsers={onlineUsers} 
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Chat
