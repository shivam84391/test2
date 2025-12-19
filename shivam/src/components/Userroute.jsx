// components/UserRoute.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/me`,
          { withCredentials: true }
        );

        if (res.data.user.role === "USER") {
          setIsUser(true);
        }
      } catch {
        setIsUser(false);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) return <p>Checking user access...</p>;

  if (!isUser) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default UserRoute;
