import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import style from "../component_style/header.module.css";
import { BookStore } from "./BookStore";
import { Book } from "./Book";
import { CRUDicon } from "./CRUDicon";
import { LoginIcon } from "./LoginIcon";
import { LoginModal } from "./LoginModal";
import { useState } from "react";
import useUser from "../context/useUser.jsx";
import { RegisterModal } from "./RegisterModal";

export const Header = () => {
  const { userId, logout } = useUser();

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const closeAllModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <div className="sticky">
      <div className={style.header}>
        <Link to="/">
          <Logo />
        </Link>

        <div className={style.links}>
          <Link to="/bookstores">
            <BookStore />
          </Link>
          <Link to="/books">
            <Book />
          </Link>
          <Link to="/crud">
            <CRUDicon />
          </Link>
          <div onClick={() => (userId ? logout() : setShowLogin(true))}>
            <LoginIcon />
            <LoginModal
              isOpen={showLogin}
              onClose={closeAllModals} // zatvara oba
              onSwitchToRegister={() => {
                setShowLogin(false);
                setShowRegister(true);
              }}
            />

            <RegisterModal
              isOpen={showRegister}
              onClose={closeAllModals} // zatvara oba
              onSwitchToLogin={() => {
                setShowRegister(false);
                setShowLogin(true);
              }}
            />
          </div>
        </div>
      </div>
      <div className={style.hr}></div>
    </div>
  );
};
