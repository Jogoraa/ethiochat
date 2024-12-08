import React from 'react'
import'./list.css';
import Userinfo from './userInfo/Userinfo';
import ChatList from './ChatList/ChatList';
function List() {
  return (
    <div className='list'>
    <Userinfo/>
    <ChatList/>
    </div>
  )
}

export default List