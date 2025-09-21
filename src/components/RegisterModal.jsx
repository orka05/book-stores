import { useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import useUser from "../context/useUser.jsx";
import styles from "../component_style/login.module.css";

export const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    korisnickoIme: "",
    lozinka: "",
    email: "",
    datumRodjenja: "",
    telefon: "",
    adresa: "",
    zanimanje: "",
  });
  const [message, setMessage] = useState("");

  const { setUserId } = useUser();
  const db = getFirestore();

  const selectedDate = new Date(formData.datumRodjenja);
  const today = new Date();

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // validacija - sva polja moraju biti popunjena
    for (const key in formData) {
      if (!formData[key]) {
        setMessage("⚠️ Sva polja moraju biti popunjena!");
        return;
      }
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setMessage("⚠️ Unesite validan email.");
      return;
    }
    if (formData.lozinka.length < 3) {
      setMessage("⚠️ Lozinka mora imati najmanje 3 karaktera.");
      return;
    }
    if (!/^\d+$/.test(formData.telefon)) {
      setMessage("⚠️ Telefon sme sadržati samo brojeve.");
      return;
    }
    today.setHours(0, 0, 0, 0);

    if (selectedDate >= today) {
      setMessage("⚠️ Datum rođenja mora biti u proslosti!");
      return;
    }
    // --- validacija adrese ---
    if (
      // --- validacija adrese ---
      (() => {
        const parts = formData.adresa.split(",");
        return (
          parts.length !== 3 || // mora imati tri dela
          !/^\p{L}+(?:\s+\p{L}+)*$/u.test(parts[1].trim()) || // drugo polje samo slova (latinica + ćirilica)
          !/^\d+$/.test(parts[2].trim()) // treće polje samo brojevi
        );
      })()
    ) {
      setMessage(
        "⚠️ Adresa mora biti u formatu [_,_,_] gde drugo polje ima samo slova a trece samo brojeve"
      );
      return;
    }

    try {
      // Provera da li korisničko ime već postoji
      const q = query(
        collection(db, "korisnici"),
        where("korisnickoIme", "==", formData.korisnickoIme)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setMessage("❌ Korisničko ime je zauzeto.");
        return;
      }

      // Dodavanje korisnika u bazu
      const docRef = await addDoc(collection(db, "korisnici"), formData);

      // Automatsko logovanje
      setUserId(docRef.id);
      localStorage.setItem("userId", docRef.id);

      setMessage("✅ Uspešna registracija!");
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1000);

      setFormData({
        ime: "",
        prezime: "",
        korisnickoIme: "",
        lozinka: "",
        email: "",
        datumRodjenja: "",
        telefon: "",
        adresa: "",
        zanimanje: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Greška prilikom registracije.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => onClose()}
        >
          ×
        </button>
        <h2>Registracija</h2>
        <form onSubmit={handleSubmit}>
          <p className="top-margine">ime:</p>
          <input
            type="text"
            name="ime"
            placeholder="Ime"
            value={formData.ime}
            onChange={handleChange}
            className={styles.input}
          />
          <p>prezime:</p>
          <input
            type="text"
            name="prezime"
            placeholder="Prezime"
            value={formData.prezime}
            onChange={handleChange}
            className={styles.input}
          />
          <p>korisnickoIme:</p>
          <input
            type="text"
            name="korisnickoIme"
            placeholder="Korisničko ime"
            value={formData.korisnickoIme}
            onChange={handleChange}
            className={styles.input}
          />
          <p>lozinka:</p>
          <input
            type="password"
            name="lozinka"
            placeholder="Lozinka"
            value={formData.lozinka}
            onChange={handleChange}
            className={styles.input}
          />
          <p>email:</p>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
          />
          <p>datumRodjenja:</p>
          <input
            type="date"
            name="datumRodjenja"
            value={formData.datumRodjenja}
            onChange={handleChange}
            className={styles.input}
          />
          <p>telefon:</p>
          <input
            type="text"
            name="telefon"
            placeholder="Telefon"
            value={formData.telefon}
            onChange={handleChange}
            className={styles.input}
          />
          <p>adresa:</p>
          <input
            type="text"
            name="adresa"
            placeholder="Adresa"
            value={formData.adresa}
            onChange={handleChange}
            className={styles.input}
          />
          <p>zanimanje:</p>
          <input
            type="text"
            name="zanimanje"
            placeholder="Zanimanje"
            value={formData.zanimanje}
            onChange={handleChange}
            className={styles.input}
          />

          <p
            className={styles.register}
            onClick={() => {
              onSwitchToLogin();
            }}
          >
            Log in
          </p>

          <button type="submit" className={styles.button}>
            Registruj se
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};
