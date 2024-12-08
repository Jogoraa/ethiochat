import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import AddUser from "./components/list/ChatList/addUser/addUser";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";

const App = () => {
  const user = false; 
  return (
    <div className="container">
      {user ? (
        <>
          <List />
          <Chat />
          <Detail />  
        </>
      ) : (
        <Login />
      )}
      <Notification/>
      <AddUser/>
    </div>
  );
};

export default App;
