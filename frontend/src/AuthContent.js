import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return localStorage.getItem("user");
  });
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("res");
  });
  const [refreshToken, setRefreshToken] = useState(() => {});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(0);
  // const [refreshToken, setRefreshToken] = useState(null);
  //   const [refreshTokenExpiration, setRefreshTokenExpiration] = useState(null);

  useEffect(() => {
    fetchSubscriptions(); // Fetch subscriptions when authenticated
    if (localStorage.getItem !== "") {
      console.log(localStorage.getItem("user"), "local");
      setUser(JSON.parse(localStorage.getItem("user")));
    }
    setError(error + 1);
    console.log("error cc", error);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        console.log("response", response);
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log("data", data);
      setUser(data.user);
      localStorage.setItem("refresh_token", JSON.stringify(data.refresh_token));
      localStorage.setItem("access_token", data.access_token);
      // setAccessToken(data.token)

      // console.log("token when login", data.token);
      return { success: true };
    } catch (error) {
      console.error("Error logging in user:", error);
      return { success: false, error: "Wrong email or password" };
    }
  };

  const register = async (credentials) => {
    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log("response", response);
      if (!response.ok) {
        console.log("response", response);
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      // setAccessToken(data.token);
      // setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Error registering user:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    // Logout logic here
    setUser(null);
    localStorage.setItem("user", "");
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  const getSubscription = (id) => {
    const subscription = subscriptions.filter((subs) => subs.id == id);
    setSubscription(subscription);
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/subscriptions", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  const addSubscription = async (subscriptionData) => {
    try {
      const response = await fetch("http://localhost:8000/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setSubscriptions((prevSubs) => [...prevSubs, data.subscription]);
      return { success: true };
    } catch (error) {
      console.error("Error adding subscription:", error);
      return { success: false, error: error.message };
    }
  };

  const updateSubscription = async (id, updatedData) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/subscriptions/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      fetchSubscriptions();
      return { success: true };
    } catch (error) {
      console.error("Error updating subscription:", error);
      return { success: false, error: error.message };
    }
  };

  const deleteSubscription = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/subscriptions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const newSubs = subscriptions.filter((sub) => sub.id !== id);
      setSubscriptions(newSubs);
      fetchSubscriptions();
    } catch (error) {
      console.error("Error deleting subscription:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        setIsAuthenticated,
        subscriptions,
        getSubscription,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
