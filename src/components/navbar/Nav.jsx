import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import "./Nav.css";
import authService from "../../appwrite/auth";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser } from "../../redux/authSlice";
import { NavLink, useNavigate } from "react-router-dom";

function Nav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const isLogin = useSelector((state) => state.auth.status);

  // ✅ Always check session on load
  useEffect(() => {
    async function fetchUser() {
      const userData = await authService.getCurrentUser();
      if (userData) {
        dispatch(loginUser(userData));
        setUser(userData.name);
      } else {
        dispatch(logoutUser());
        setUser("");
      }
    }

    fetchUser();
  }, []);

  // ✅ Login with Google
  function handleLogin() {
    authService.authLogin();
  }

  // ✅ Logout and update store
  function handleLogout() {
    if (confirm("want to logout", user)) {
      authService.authLogout();
      dispatch(logoutUser());
      setUser("");
      navigate("/");
    }
  }
  function getSafeInitials(name) {
    if (!name) return "";
    return name
      .trim()
      .split(/\s+/) // handles multiple spaces
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }
  return (
    <div className="nav">
      <div className="logo">Expendo</div>

      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) => {
            return `${isActive ? "active-link" : "link"}`;
          }}
        >
          Home
        </NavLink>
        <NavLink
          to="group"
          className={({ isActive }) => {
            return `${isActive ? "active-link" : "link"}`;
          }}
        >
          Group
        </NavLink>
      </div>

      {user ? (
        <div className="user-section">
          <span id="user-init">{getSafeInitials(user)}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      ) : (
        <button onClick={handleLogin} className="login-btn">
          <div className="google-icon">
            <FcGoogle />
          </div>
          Login
        </button>
      )}
    </div>
  );
}

export default Nav;
