import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import supabase from "../../lib/supabase";  // Import Supabase client
import upload from "../../lib/upload";  // Assuming this function uploads to Supabase Storage

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle avatar selection
  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
  
    // Validate inputs
    if (!username || !email || !password) {
      return toast.warn("Please enter all required fields!");
    }
    if (!avatar.file) return toast.warn("Please upload an avatar!");
  
    // Validate unique username
    const { data: existingUsers, error: fetchError } = await supabase
      .from("users")
      .select("username")
      .eq("username", username);
  
    if (fetchError) {
      console.error(fetchError.message);
      return toast.error("Failed to check username availability.");
    }
  
    if (existingUsers.length > 0) {
      return toast.warn("Select another username");
    }
  
    try {
      // Sign up user with email and password
      const { user, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (signUpError) {
        throw new Error(signUpError.message); // Sign-up failed, throw error
      }
  
      if (!user) {
        throw new Error("User registration failed."); // If user object is undefined
      }
  
      // Upload avatar (handle potential error)
      let imgUrl;
      try {
        imgUrl = await upload(avatar.file);
      } catch (uploadError) {
        console.error(uploadError);
        return toast.error("Failed to upload avatar. Please try again.");
      }
  
      // Add user to the database
      const { error: dbError } = await supabase
        .from("users")
        .insert([
          {
            id: user.id,
            username,
            email,
            avatar: imgUrl,
            blocked: [],
          },
        ]);
  
      if (dbError) {
        throw new Error(dbError.message);
      }
  
      // Set up user chats (assuming you have a 'userchats' table)
      await supabase.from("userchats").insert([
        {
          user_id: user.id,
          chats: [],
        },
      ]);
  
      toast.success("Account created! You can login now!");
    } catch (err) {
      console.error(err);
      toast.error(err.message); // Provide more specific error message if possible
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message); // Login failed
      }

      console.log("User logged in:", user);
      toast.success("Login successful!");

      // You could add a redirect or perform other actions here

    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      {/* Login Form */}
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>
        </form>
      </div>

      <div className="separator"></div>

      {/* Register Form */}
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="Avatar Preview" />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="Username" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loading}>{loading ? "Loading..." : "Sign Up"}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
