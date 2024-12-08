import { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/addUser";
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/chatStore";
import supabase from "../../../lib/supabase";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  // Guard clause to ensure currentUser is available before proceeding
  useEffect(() => {
    if (!currentUser) {
      return; // If currentUser is not available, we stop here to prevent errors.
    }

    const fetchChats = async () => {
      const { data, error } = await supabase
        .from("userchats")
        .select("chats")
        .eq("userId", currentUser.id);

      if (error) {
        console.error("Error fetching chats:", error);
        return;
      }

      if (data && data.length > 0) {
        const items = data[0].chats;

        const promises = items.map(async (item) => {
          const { data: user, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", item.receiverId)
            .single();

          if (userError) {
            console.error("Error fetching user:", userError);
            return null;
          }

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.filter(Boolean).sort((a, b) => b.updatedAt - a.updatedAt));
      }
    };

    fetchChats();

    const subscription = supabase
      .channel("userchats")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "userchats" },
        (payload) => {
          if (payload.new.userId === currentUser.id) {
            fetchChats();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [currentUser]); // Re-run effect whenever currentUser changes

  const handleSelect = async (chat) => {
    if (!currentUser) return; // Ensure currentUser is available

    const updatedChats = chats.map((item) => {
      const { user, ...rest } = item;
      return { ...rest, isSeen: item.chatId === chat.chatId || item.isSeen };
    });

    try {
      const { error } = await supabase
        .from("userchats")
        .update({ chats: updatedChats })
        .eq("userId", currentUser.id);

      if (error) throw error;

      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.error("Error updating chat:", err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {filteredChats.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
          }}
        >
          <img
            src={
              chat.user.blocked.includes(currentUser.id)
                ? "./avatar.png"
                : chat.user.avatar || "./avatar.png"
            }
            alt=""
          />
          <div className="texts">
            <span>
              {chat.user.blocked.includes(currentUser.id)
                ? "User"
                : chat.user.username}
            </span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
