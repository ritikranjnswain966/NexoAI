import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import { Routes, Route, useLocation } from "react-router-dom";
import ChatPage from "./components/chat/ChatPage";
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
      {!isMenuOpen && (
        <div className="mobile-header md:hidden">
          <button
            className="mobile-header__btn"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <img
              src={assets.menu_icon}
              className="h-6 w-6 not-dark:invert"
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
        <div
          className="bg-[linear-gradient(180deg,#f8fbff,#eef4ff)] text-slate-900 transition-colors duration-500 dark:bg-[linear-gradient(180deg,#030712,#020617)] dark:text-gray-100"
          style={{ minHeight: "100dvh" }}
        >
          <div className="flex w-screen" style={{ height: "100dvh" }}>
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<ChatPage />} />
              <Route path="/chat/:chatId" element={<ChatPage />} />
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
