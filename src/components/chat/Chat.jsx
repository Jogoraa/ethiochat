import React, { useState } from 'react'; // Import useState
import './chat.css';
import Picker from 'emoji-picker-react'; // Correct import for the emoji picker

const Chat = () => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null); // Store selected image

  const handleEmojiClick = (emojiObject) => {
    // Append the emoji to the text input
    setText((prev) => prev + emojiObject.emoji);
  };
  //image pick
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Store the image data as base64
      };
      reader.readAsDataURL(file);
    }
  };
  //camera
  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Store the captured image as base64
      };
      reader.readAsDataURL(file);
    }
  };
  const sendMessage = () => {
    if (text.trim() !== "") {
      // Add the new message
      setMessages((prev) => [...prev, { text, sender: "you" }]);
      setText("");
      // Simulate a response from the other user
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "Got it!", sender: "other" },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="chat">
      <div className="top">
        {/* User and Icons at the top */}
        <div className="user">
          <img src="./avatar.png" alt="User profile" />
          <div className="user-info">
            <div className="texts">
              <span> Emanuel Jogora</span>
              <p>Last seen 10 minutes ago</p>
            </div>
          </div>
          <div className="icons">
            <img src="./phone.png" alt="Voice call" />
            <img src="./video.png" alt="Video call" />
            <img src="./info.png" alt="More information" />
          </div>
        </div>
      </div>
<div className='center'>
      {/* Conversation Section */}
      <div className="message own">
        <img src='./avatar.png' alt="Avatar" />
        <div className='texts'>
          <p>Lorem ipsum dolor fatuas ajselsfc wladcke</p>
          <span>11:45 AM</span>
        </div>
      </div>
      <div className="message">
        <img src='./Profile.png' alt="sender" />
        <div className='texts'>
          <p>Lorem ipsum dolor fatuas ajselsfc wladcke</p>
          <span>11:45 AM</span>
        </div>
      </div>
      <div className="message own">
        <img src='./avatar.png' alt="Avatar" />
        <div className='texts'>
          <p>Lorem ipsum dolor fatuas ajselsfc wladcke</p>
          <span>11:45 AM</span>
        </div>
      </div>
      <div className="message">
        <img src='./avatar.png' alt="Avatar" />
        <div className='texts'>
          <p>Lorem ipsum dolor fatuas ajselsfc wladcke</p>
          <span>11:45 AM</span>
        </div>
      </div>
      </div>
      {/* Chat input */}
      <div className="bottom">
        {/* File attach, camera, mic icons */}
        <div className="icons">
          {/* Attach photo icon */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input">
            <img src="/img.png" alt="Attach file" />
          </label>          {/* Open camera icon */}
          <input
            type="file"
            accept="image/*"
            capture="camera"
            onChange={handleCameraCapture}
            style={{ display: 'none' }}
            id="camera-input"
          />
          <label htmlFor="camera-input">
            <img src="/camera.png" alt="Camera" />
          </label>
          <img src="/mic.png" alt="Microphone" />
        </div>

        {/* Text input */}
        <input
          type="text"
          placeholder="Type a message here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

      
        <div className="emoji" onClick={() => setShowEmoji(!showEmoji)}>
          <img src="/emoji.png" alt="Emoji" />
        </div>

        {/* Send button */}
        <button type="button" className="sendButton" onClick={sendMessage}>
          Send
        </button>
      </div>

      {/* Show emoji picker when showEmoji is true */}
      {showEmoji && (
        <Picker onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject)} />
      )}
    </div>
  );
};

export default Chat;
