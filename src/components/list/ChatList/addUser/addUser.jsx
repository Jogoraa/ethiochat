import "./addUser.css";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";
import supabase from "../../../../lib/supabase";

const AddUser = () => {
  const [user, setUser] = useState(null);

  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    try {
      // Create a new chat
      const { data: newChat, error: chatError } = await supabase
        .from("chats")
        .insert({
          createdAt: new Date().toISOString(),
          messages: [],
        })
        .select("*")
        .single();

      if (chatError) {
        console.error("Error creating chat:", chatError);
        return;
      }

      // Add chat to the current user
      const { error: currentUserError } = await supabase
        .from("userchats")
        .upsert({
          userId: currentUser.id,
          chats: [
            ...(currentUser.chats || []),
            {
              chatId: newChat.id,
              lastMessage: "",
              receiverId: user.id,
              updatedAt: new Date().toISOString(),
            },
          ],
        });

      if (currentUserError) {
        console.error("Error updating current user's chats:", currentUserError);
        return;
      }

      // Add chat to the other user
      const { error: receiverError } = await supabase
        .from("userchats")
        .upsert({
          userId: user.id,
          chats: [
            ...(user.chats || []),
            {
              chatId: newChat.id,
              lastMessage: "",
              receiverId: currentUser.id,
              updatedAt: new Date().toISOString(),
            },
          ],
        });

      if (receiverError) {
        console.error("Error updating receiver's chats:", receiverError);
        return;
      }
    } catch (err) {
      console.error("Error handling add user:", err);
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
