import React from "react";
import { motion } from "framer-motion";
import loginImage from "../assets/blue2.jpg";

const AnimatedLogo = () => {
  return (
    <div style={style.container}>
      {/* Logo and Text Container */}
      <div style={style.logoContainer}>
        {/* "B" Logo with Animation */}
        <motion.img
          src={loginImage}
          alt="B Logo"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, x: -10 }}
          transition={{ duration: 1 }}
          style={style.image}
        />
      </div>

      <div style={style.logoContainer1}>
        {/* "LUE" Sliding in from Right */}
        <motion.span
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
          style={style.text}
        >
          LUE
        </motion.span>
      </div>
    </div>
  );
};

const style = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "20vh",
    backgroundColor: "royalblue", // Tailwind's bg-blue-600
  },
  logoContainer1: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "royalblue",
    padding: "0px",
    borderRadius: "10px",
    //boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  image: {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
  },
  text: {
    fontSize: "60px",
    fontWeight: "bold",
    color: "white", // Blue color
    marginLeft: "0px",
    marginTop: "8px",
    fontFamily: "auto",
  },
};

export default AnimatedLogo;
