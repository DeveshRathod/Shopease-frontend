import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../store/reducers/user.slice";

const PrivateRoute = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get("/api/user/me", {
            headers: {
              authorization: `${token}`,
            },
          });

          const userData = await response.data;
          dispatch(setUser(userData.currentUser));
          const user = JSON.stringify(userData.currentUser);
          localStorage.setItem("currentUser", user);
        } else {
          navigate("/signin");
          localStorage.setItem("currentUser", null);
        }
      } catch (error) {
        navigate("/signin");
        localStorage.setItem("currentUser", null);
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUser();
  }, []);

  return currentUser && !currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" />
  );
};

export default PrivateRoute;
