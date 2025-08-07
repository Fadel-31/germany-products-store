import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 p-4 flex items-center space-x-4 backdrop-blur-sm bg-white/30 border-b border-gray-100"
    >
      <motion.img
        src="../public/germanlogo.png"
        alt="Store Logo"
        className="w-10 h-10 object-contain"
        whileHover={{ rotate: 10, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400 }}
      />
      <motion.h1 
        className="text-l font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500"
        whileHover={{ scale: 1.05 }}
      >
        German Store
      </motion.h1>
    </motion.nav>
  );
}