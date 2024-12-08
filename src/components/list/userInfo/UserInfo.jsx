import React from 'react';
import './userInfo.css'; 
function Userinfo() {
  return (
    <div className='userInfo'>
      <div className='user'>
        <img src='./avatar.png' alt='User profile' />
        <div className='userDetails'>
          <h2>John Doe</h2>
          <p>Last seen 10 minutes ago</p>
        </div>
      </div>
      <div className='icons'>
        <img src='/more.png' alt='More options' />
        <img src='/video.png' alt='Video call' />
        <img src='/edit.png' alt='Edit profile' />
      </div>
    </div>
  );
}

export default Userinfo;
