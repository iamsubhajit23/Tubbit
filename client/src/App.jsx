import "./index.css";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { Navbar } from "./components/header/Navbar.jsx";
import { getCurrentUser } from "./services/user/profile.api.js";
import { login, logout } from "./store/AuthSlice.js";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const response = await getCurrentUser();
      if ([200, 201].includes(response.statuscode)) {
        dispatch(login({userData: response}));
      }else{
        dispatch(logout())
      }
    }
    checkAuth();
  }, [])

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
export default App;
