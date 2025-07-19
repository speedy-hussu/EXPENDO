import React, { useEffect, useState } from "react";
import authService from "./appwrite/auth";
import { Container, Nav } from "./components/componentIndex";
import { useDispatch } from "react-redux";
import "./App.css";
import { loginUser } from "./redux/authSlice";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Home, GroupList, ExpenseList } from "./pages/pageIndex";
function App() {
  return (
    <Container>
      <Nav />
      <Outlet />
    </Container>
  );
}

export default App;
