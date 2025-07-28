import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AuthSecurity({ children, auth = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  useEffect(() => {
    if (!auth && authStatus !== auth) {
      navigate("/");
    }
  }, []);

  return <>{children}</>;
}
export default AuthSecurity;
