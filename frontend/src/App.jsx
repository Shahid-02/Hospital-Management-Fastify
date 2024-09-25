import React, { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Appointment from "./Pages/Appointment";
import AboutUs from "./Pages/AboutUs";
import Register from "./Pages/Register";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Context } from "./main";
import Login from "./Pages/Login";
const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } =
    useContext(Context);

    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };
    
    useEffect(() => {
      const fetchUser = async () => {
        try {
          // Get the patientToken from cookies
          const patientToken = getCookie('patientToken');
    
          if (patientToken) {
            const response = await axios.get(
              "http://localhost:4000/api/v1/user/patient/me",
              {
                withCredentials: true,
                headers: {
                  Authorization: `Bearer ${patientToken}`
                }
              }
            );
    
            // Set user and authentication state
            setIsAuthenticated(true);
            setUser(response.data.user);
          } else {
            throw new Error("Token not found");
          }
        } catch (error) {
          // Handle errors and reset authentication state
          setIsAuthenticated(false);
          setUser({});
        }
      };
    
      fetchUser(); // Call the function when component mounts
    }, []);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;
