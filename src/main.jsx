import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ExpenseList, GroupList, Home, Login } from "./pages/pageIndex.js";
import AuthSecurity from "./components/AuthSecurity.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/group",
        element: (
          <AuthSecurity auth="true">
            <GroupList />,
          </AuthSecurity>
        ),
      },
      {
        path: "/group/:groupId",
        element: (
          <AuthSecurity auth="true">
            <ExpenseList />,
          </AuthSecurity>
        ),
      },
      // {
      //   path: "/login",
      //   element: (
      //     <AuthSecurity auth="false">
      //       <Login />
      //     </AuthSecurity>
      //   ),
      // },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </Provider>
);
