import React, { useState } from 'react';
import './ChatList.css';

function ChatList() {
  const [addMode, setMode] = useState(false);

  return (
    <div className='chatList'>
      {/* Search Section */}
      <div className='search'>
        <div className='searchBar'>
          <img src='./search.png' alt='Search' />
          <input type='text' placeholder='Search chats' />
        </div>
        <img
          src={addMode ? './minus.png' : './plus.png'}
          alt={addMode ? 'Remove chat' : 'Add chat'}
          className='add'
          onClick={() => setMode((prev) => !prev)}
        />
      </div>

      {/* Chat List Items */}
      <div className='item'>
        <img src='./avatar.png' alt='User profile' />
        <div className='texts'>
          <span>John Doe</span>
          <p>Lorem ipsum dolor sit amet</p>
        </div>
      </div>

      <div className='item'>
        <img src='./avatar.png' alt='User profile' />
        <div className='texts'>
          <span>Jane Smith</span>
          <p>How are you doing?</p>
        </div>
      </div>

      <div className='item'>
        <img src='./avatar.png' alt='User profile' />
        <div className='texts'>
          <span>Michael Brown</span>
          <p>Catch you later!</p>
        </div>
      </div>

      <div className='item'>
        <img src='./avatar.png' alt='User profile' />
        <div className='texts'>
          <span>Emily Davis</span>
          <p>Let's chat soon.</p>
        </div>
      </div>

      <div className='item'>
        <img src='./avatar.png' alt='User profile' />
        <div className='texts'>
          <span>Chris Wilson</span>
          <p>Good morning!</p>
        </div>
      </div>
    </div>
  );
}

export default ChatList;
