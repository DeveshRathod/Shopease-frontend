import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import noMessage from "../data/images/noMessage.png";
import {
  setNotifications,
  setNewNotificationCount,
} from "../store/reducers/notification.slice";
import Loader from "../components/Loader";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [isEmpty, setIsEmpty] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);

  let url;
  if (currentUser && currentUser.isAdmin) {
    url = "/dashboard";
  } else if (currentUser && !currentUser.isAdmin) {
    url = "/orders";
  }

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`/api/user/notifications`, {
          headers: {
            authorization: `${token}`,
          },
        });

        setMessages(response.data.notifications);
        dispatch(setNotifications(response.data.notifications));
        dispatch(setNewNotificationCount(response.data.unreadCount));
        if (response.data.notifications.length === 0) {
          setIsEmpty(true);
        } else {
          setIsEmpty(false);
        }
      } catch (err) {
        setIsEmpty(true);
      } finally {
        setTimeout(() => setLoading(false), 2000);
      }
    };

    fetchMessages();
  }, [dispatch]);

  if (window.location.pathname === "/messages") {
    useEffect(() => {
      const markAsRead = async () => {
        try {
          const token = localStorage.getItem("token");

          const response = await axios.get(`/api/user/markAsRead`, {
            headers: {
              authorization: `${token}`,
            },
          });

          dispatch(setNewNotificationCount(0));
        } catch (err) {}
      };

      markAsRead();
    }, [dispatch]);
  }

  useEffect(() => {
    setLoading(true);
  }, []);

  const toggleSelect = (notificationId) => {
    if (selectedIds.includes(notificationId)) {
      setSelectedIds(selectedIds.filter((id) => id !== notificationId));
    } else {
      setSelectedIds([...selectedIds, notificationId]);
    }
  };

  const selectAll = () => {
    const allIds = messages.map((message) => message.notificationId);
    setSelectedIds(allIds);
  };

  const deleteSelected = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.delete(`/api/user/deleteNotifications`, {
          data: {
            notificationIds: selectedIds,
          },
          headers: {
            authorization: `${token}`,
          },
        });

        if (response.status === 200) {
          dispatch(setNotifications(response.data));
          setMessages(response.data);
          if (response.data.length === 0) {
            setIsEmpty(true);
          }

          setSelectedIds([]);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {isEmpty ? (
            <div className="flex flex-col sm:flex-row md:flex-row w-full justify-center">
              <div className=" w-full h-fit flex justify-center items-center flex-col gap-5 border bg-gray-50 pt-6 pb-10 rounded-md">
                <img
                  src={noMessage}
                  alt="empty_cart"
                  className=" w-full h-full md:w-full md:h-full lg:w-1/3 lg:h-1/3 sm:w-1/3 sm:h-1/3 p-5"
                />
                <p className=" text-2xl sm:text-3xl mt-10">
                  No notifications yet!
                </p>
                <Link
                  to="/explore/all"
                  className=" px-6 py-2 bg-black text-white rounded-md"
                >
                  Explore
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-6 text-start">
                Notifications
              </h1>
              <div className="flex justify-end mb-4 items-center">
                <div className="flex items-center">
                  <button
                    className="bg-black text-white px-4 py-2 rounded-md mr-2"
                    onClick={selectAll}
                  >
                    Select All
                  </button>
                  <button
                    className="bg-black text-white px-4 py-2 rounded-md"
                    onClick={() => setSelectedIds([])}
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
              <ul className="space-y-4">
                {messages.map((message) => (
                  <li
                    key={message.notificationId}
                    className={`p-4 border rounded-lg flex justify-between items-start bg-white ${
                      selectedIds.includes(message.notificationId)
                        ? "border-red-500"
                        : ""
                    }`}
                    onClick={() => toggleSelect(message.notificationId)}
                  >
                    <div className="flex-1">
                      <p className="text-lg font-semibold mb-1">
                        {message.message}
                      </p>
                      <p className="text-gray-500 text-sm mb-2">
                        <strong>From:</strong> {message.sender}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(message.date).toLocaleString()}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Link
                        to={url}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
              {selectedIds.length > 0 && (
                <div>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
                    onClick={deleteSelected}
                  >
                    Delete Selected
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Layout>
  );
};

export default Messages;
