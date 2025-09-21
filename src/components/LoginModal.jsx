import React, { useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import useUser from "../context/useUser.jsx";
import styles from "../component_style/login.module.css";

export const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const { setUserId } = useUser();
  const db = getFirestore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const q = query(
        collection(db, "korisnici"),
        where("korisnickoIme", "==", username)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const userDoc = docSnap.data();

        if (userDoc.lozinka === password) {
          setUserId(docSnap.id);
          localStorage.setItem("userId", docSnap.id);

          setMessage("✅ Uspesno logovanje!");
          setTimeout(() => {
            setMessage("");
            setUsername("");
            setPassword("");
            onClose();
          }, 1000);
        } else {
          setMessage("❌ Pogrešna lozinka.");
        }
      } else {
        setMessage("❌ Korisnik ne postoji.");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Greška prilikom logovanja.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            ×
          </button>
          <h2>Prijava</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Korisničko ime"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Lozinka"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
            <p
              className={styles.register}
              onClick={() => {
                onSwitchToRegister();
              }}
            >
              Register
            </p>
            <button type="submit" className={styles.button}>
              Uloguj se
            </button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>
    </>
  );
};
