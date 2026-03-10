import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Routes, Route, useLocation } from "react-router-dom";
import ChatBox from "./components/ChatBox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import { assets } from "./assets/assets";
import "./assets/prism.css";
import Loading from "./pages/Loading";
import { useAppContext } from "./context/AppContext";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { user, loadingUser, theme, createNewChat } = useAppContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  if (pathname === "/loading" || loadingUser) return <Loading />;

  return (
    <>
      <Toaster />
      {/* Mobile Header Bar — only visible below md breakpoint */}
      {!isMenuOpen && (
        <div className="mobile-header md:hidden">
          <button
            className="mobile-header__btn"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <img
              src={assets.menu_icon}
              className="w-6 h-6 not-dark:invert"
              alt="Menu"
            />
          </button>
          <img
            src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
            alt="Nexo"
            className="mobile-header__logo logo-recolor"
          />
          <button
            className="mobile-header__new-chat"
            onClick={createNewChat}
            aria-label="New chat"
          >
            <span className="mobile-header__plus">+</span>
          </button>
        </div>
      )}

      {user ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:bg-gradient-to-br dark:from-[#030712] dark:via-[#0f172a] dark:to-[#030712] dark:text-gray-100 transition-colors duration-500">
          <div className="flex h-screen w-screen">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/chat/:chatId" element={<ChatBox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default App;
