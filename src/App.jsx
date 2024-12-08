import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import AddUser from "./components/list/ChatList/addUser/addUser";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import supabase from "./lib/supabase";  // Import Supabase client

const App = () => {
  const [user, setUser] = useState(null);

  // Check if a user is logged in on page load (this persists the session)
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user); // If a session exists, set the user
      }

      // Listen for authentication state changes
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);  // Update user state based on session
      });

      // Clean up the listener on component unmount
      return () => {
        authListener?.unsubscribe();
      };
    };

    fetchSession();
  }, []);

  return (
    <Router>
      <div className="container">
        <Routes>
          {/* Route for Login page */}
          <Route path="/login" element={<Login />} />

          {/* Protected route for the main app components */}
          <Route
            path="/"
            element={
              user ? (
                <>
                  <List />
                  <Chat />
                  <Detail />
                
                </>
              ) : (
                <Navigate to="/login" />  // Redirect to login if not logged in
              )
            }
          />
        </Routes>
      </div>
      <Notification />
    </Router>
  );
};

export default App;
