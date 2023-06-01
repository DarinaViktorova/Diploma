import { useContext, useRef, useState } from 'react';
import { AuthContext } from "../../context/AuthContext";
import './share.css';
import { PermMedia, Cancel } from "@material-ui/icons";
import { postUploadFile, postNewPost } from '../../api/posts';

const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;

const Share = () => {
  const description = useRef();

  const { user } = useContext(AuthContext);

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
        await postUploadFile(data);
      } catch (error) { }
    }

    try {
      await postNewPost(newPost);
      window.location.reload();
    } catch (error) { }
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
            placeholder={user.username + ", what's in your mind?"}
            className='shareInput'
            ref={description}
          />
        </div>

        <hr className='shareHr' />
        {file && (
          <div className="shareImgContainer">
            <img className='shareImg' src={URL.createObjectURL(file)} alt="" />
            <Cancel className='shareCancelImg' onClick={() => setFile(null)} />
          </div>
        )}

        <form className="shareBotton" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label className="shareOption" htmlFor='file'>
              <PermMedia htmlColor="lightblue" className="shareIcon" />
              <span className="shareOptionText"> Add a photo </span>
              <input
                type="file"
                id="file"
                accept=".jpeg, .jpg, .png"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>

            <button className="shareButton" type='submit'>Share</button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default Share
