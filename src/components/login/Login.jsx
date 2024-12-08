import React, { useState } from "react";
import "./login.css";

function Login() {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState({ url: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate a login process
    setTimeout(() => {
      setLoading(false);
      alert("Logged in!");
    }, 1000);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate a registration process
    setTimeout(() => {
      setLoading(false);
      alert("Account created!");
    }, 1000);
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar({ url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" required />
          <input type="password" placeholder="Password" name="password" required />
          <button disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="Avatar" />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="Username" name="username" required />
          <input type="text" placeholder="Email" name="email" required />
          <input type="password" placeholder="Password" name="password" required />
          <button disabled={loading}>{loading ? "Loading..." : "Sign Up"}</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
