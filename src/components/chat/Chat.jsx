import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import supabase from "../../lib/supabase";
import { format } from "timeago.js";

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  // Fetch chat data from Supabase
  useEffect(() => {
    const fetchChat = async () => {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("chatId", chatId)
        .single();

      if (error) {
        console.log(error);
      } else {
        setChat(data);
      }
    };

    fetchChat();
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        // Upload image to Supabase Storage
        const { data, error } = await supabase
          .storage
          .from('images') // Replace with your bucket name
          .upload(`${Date.now()}_${img.file.name}`, img.file);

        if (error) throw error;

        const { publicURL, error: urlError } = supabase
          .storage
          .from('images')
          .getPublicUrl(data.path);

        if (urlError) throw urlError;

        imgUrl = publicURL;
      }

      // Insert message into the chat table in Supabase
      const { error } = await supabase
        .from("messages")
        .insert([
          {
            chat_id: chatId,
            sender_id: currentUser.id,
            text,
            img_url: imgUrl,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;

      // Update the user's last message in the user chats table
      const userIDs = [currentUser.id, user.id];

      for (const id of userIDs) {
        const { data: userChatsData, error } = await supabase
          .from("userchats")
          .select("chats")
          .eq("user_id", id)
          .single();

        if (error) throw error;

        const chatIndex = userChatsData.chats.findIndex(
          (c) => c.chatId === chatId
        );

        if (chatIndex !== -1) {
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          const { error: updateError } = await supabase
            .from("userchats")
            .upsert({
              user_id: id,
              chats: userChatsData.chats,
            });

          if (updateError) throw updateError;
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setImg({ file: null, url: "" });
      setText("");
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Lorem ipsum dolor, sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currentUser?.id ? "message own" : "message"
            }
            key={message.createdAt}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message.text}</p>
              <span>{format(message.createdAt)}</span>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
