import { useContext, useRef, useState } from 'react';
import {AuthContext} from "../../context/AuthContext";
import axios from 'axios';
import './share.css';
import {PermMedia, Label, Room, EmojiEmotions, Cancel} from "@material-ui/icons";

const Share = () => {

  const {user} = useContext(AuthContext);
  const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

  const description = useRef(); 

  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      description: description.current.value
    }

    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.image = fileName;
      console.log(newPost);
      try {
        await axios.post("/upload", data);
       // newPost.image = fileName;
      } catch (error) {}
    }

    try {
       await axios.post("/posts", newPost);
       window.location.reload();
    } catch (error) {}
  }

  return (
    <div className='share'>
      <div className="shareWrapper">
        <div className="shareTop">
            <img className="shareProfileImg" 
              src={user.avatar
                ? publicFolder + user.avatar
                : publicFolder + "people/default_avatar.jpg"
              } 
              alt="" 
              />
            <input 
              placeholder="What's in your mind?" 
              className='shareInput'
              ref={description}
              />
        </div>
        <hr className='shareHr'/>
        {file && (
          <div className="shareImgContainer">
            <img className='shareImg' src={URL.createObjectURL(file)} alt="" />
            <Cancel className='shareCancelImg' onClick={() => setFile(null)}/>
          </div>
        )}
        <form className="shareBotton" onSubmit={submitHandler}>
            <div className="shareOptions">
                <label className="shareOption" htmlFor='file'>
                    <PermMedia htmlColor="tomato" className="shareIcon"/>
                    <span className="shareOptionText">Photo or Video</span>
                    <input 
                      type="file" 
                      id="file" 
                      accept=".jpeg, .jpg, .png" 
                      style={{display: "none"}}
                      onChange={(e) => setFile(e.target.files[0])}
                      />
                </label>
                <div className="shareOption">
                    <Label htmlColor="blue" className="shareIcon"/>
                    <span className="shareOptionText">Tag</span>
                </div>
                <div className="shareOption">
                    <Room htmlColor="green" className="shareIcon"/>
                    <span className="shareOptionText">Location</span>
                </div>
                <div className="shareOption">
                    <EmojiEmotions htmlColor="gold" className="shareIcon"/>
                    <span className="shareOptionText">Feelings</span>
                </div>
                <button className="shareButton" type='submit'>Share</button>
            </div>
        </form>
      </div>
    </div>
  )
}

export default Share
