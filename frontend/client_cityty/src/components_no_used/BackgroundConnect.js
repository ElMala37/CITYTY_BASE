import React from "react";
import { motion } from "framer-motion";

const BackgroundConnect = () => {
  return (
    <div className="background_signin">
      <motion.div
        initial={{ backgroundColor: ["#33ff55"] }}
        animate={{ backgroundColor: ["#33ff55", "#efaf1a", "#4d72f1"] }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      ></motion.div>
    </div>
  );
};

export default BackgroundConnect;
