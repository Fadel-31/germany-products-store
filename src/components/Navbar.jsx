import { motion } from "framer-motion";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false); // close menu after click
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 p-4 flex items-center justify-between backdrop-blur-sm bg-white/30 border-b border-gray-100"
    >
      {/* Logo + Title */}
      <div className="flex items-center space-x-3">
        <motion.img
          src="/germanlogo.png"
          alt="Store Logo"
          className="w-10 h-10 object-contain"
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        />
        <motion.h1
className="text-l font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-amber-400"
          whileHover={{ scale: 1.05 }}
        >
          German Store
        </motion.h1>
      </div>

      {/* Hamburger (only visible under 450px) */}
      <div className="block sm:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-md hover:bg-gray-200 transition"
        >
          <FaBars size={20} />
        </button>

        {/* Dropdown menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-4 top-16 bg-white shadow-lg rounded-lg p-4"
          >
            <button
              onClick={scrollToContact}
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Contact
            </button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
