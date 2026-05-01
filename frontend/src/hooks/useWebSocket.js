import { useEffect, useRef, useState } from "react";

const useWebSocket = (url, token, onTokenExpired) => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(null);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!token) {
      console.log("No token available, skipping WebSocket connection");
      return;
    }

    const connectWebSocket = () => {
      // Create WebSocket connection with token
      const wsUrl = `${url}?token=${token}`;
      socketRef.current = new WebSocket(wsUrl);

      socketRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Notification received:", data);

        if (data.notification) {
          setNotifications((prev) => {
            const existIndex = prev.findIndex(
              (notif) => notif.id === data.notification.id,
            );
            if (existIndex !== -1) {
              // Update existing notification
              const updated = [...prev];
              updated[existIndex] = data.notification;
              return updated;
            }
            return [data.notification, ...prev];
          });
        }
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };

      socketRef.current.onclose = (event) => {
        console.log("WebSocket disconnected", event.code);
        setIsConnected(false);

        // If closed due to authentication error (code 1008 or 4001), trigger token refresh
        if (event.code === 1008 || event.code === 4001) {
          console.log(
            "WebSocket closed due to auth error, refreshing token...",
          );
          if (onTokenExpired) {
            const newToken = onTokenExpired();
          }
        } else {
          // Attempt to reconnect after 3 seconds for other errors
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect WebSocket...");
            connectWebSocket();
          }, 3000);
        }
      };
    };

    connectWebSocket();

    // Cleanup on unmount or token change
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url, token, onTokenExpired]);

  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  };

  return { notifications, isConnected, sendMessage, setNotifications };
};

export default useWebSocket;
