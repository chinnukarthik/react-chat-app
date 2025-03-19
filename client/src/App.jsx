import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Profile from "./pages/profile";
import Chat from "./pages/chat";
import { userAppStore } from "./store";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { GET_USER_INFO } from "./utils/constant";

const PrivateRoute = ({ children }) => {
  const { userInfo } = userAppStore();
  return userInfo ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = userAppStore();
  return userInfo ? <Navigate to="/chat" /> : children;
};

function App() {
  const { userInfo, setUserInfo } = userAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
          localStorage.setItem("userInfo", JSON.stringify(response.data)); //  Store user info
        } else {
          setUserInfo(undefined);
          localStorage.removeItem("userInfo"); //  Remove if not valid
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("User is not authenticated.");
          setUserInfo(undefined);
          localStorage.removeItem("userInfo");
        } else {
          console.error("Error fetching user info:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    // Restore user session from localStorage if available
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
      setLoading(false);
    } else {
      getUserInfo(); // Fetch user info from API
    }
  }, [setUserInfo]);

  if (loading) {
    return <div>Loading....Please wait</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
