import { BrownBook } from "../components/BrownBook";
import style from "../style/main.module.css";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { validationError } from "./ValidationError";

export const UsersCRUD = () => {
  const [userList, setUserList] = useState([]);
  const [searchText, setSearchText] = useState(""); // input value

  const usersCollection = collection(db, "korisnici");

  const [currentId, setCurrentId] = useState("");
  const [currentAdresa, setCurrentAdresa] = useState("");
  const [currentDatum, setCurrentDatum] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentIme, setCurrentIme] = useState("");
  const [currentkorisnickoIme, setCurrentkorisnickoIme] = useState("");
  const [currentLozinka, setCurrentLozinka] = useState("");
  const [currentPrezime, setCurrentPrezime] = useState("");
  const [currentTelefon, setCurrentTelefon] = useState("");
  const [currentZanimanje, setCurrentZanimanje] = useState("");

  const [isNew, setIsNew] = useState(false);

  const selectedDate = new Date(currentDatum);
  const today = new Date();

  useEffect(() => {
    const getUserList = async () => {
      try {
        const data = await getDocs(usersCollection);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUserList(filteredData);
      } catch (err) {
        console.error(err);
      }
    };
    getUserList();
  }, [usersCollection]);

  const filteredUsers = userList.filter((user) =>
    user.korisnickoIme.toLowerCase().includes(searchText.toLowerCase())
  );

  const onSubmit = async () => {
    today.setHours(0, 0, 0, 0);
    if (
      !currentId ||
      !currentAdresa ||
      !currentDatum ||
      !currentEmail ||
      !currentIme ||
      !currentkorisnickoIme ||
      !currentLozinka ||
      !currentPrezime ||
      !currentTelefon ||
      !currentZanimanje ||
      // --- validacija adrese ---
      (() => {
        const parts = currentAdresa.split(",");
        return (
          parts.length !== 3 || // mora imati tri dela
          !/^\p{L}+(?:\s+\p{L}+)*$/u.test(parts[1].trim()) || // drugo polje samo slova (latinica + ćirilica)
          !/^\d+$/.test(parts[2].trim()) // treće polje samo brojevi
        );
      })() ||
      // --- validacija emaila ---
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail) ||
      // --- validacija telefona (samo brojevi i + ili -) ---
      /[A-Za-z\p{L}]/u.test(currentTelefon) ||
      selectedDate >= today
    ) {
      validationError(`
        <p>Adresa u formatu [_,_,_] gde drugo polje ima samo slova a trece samo brojeve</p>
        <p>Datum mora biti u proslosti</p>
        <p>Email mora da sadrzi @ i . sa nekim nastavkom</p>
        <p>Kontakt telefon ne sme da sadrzi slova</p>
        <button onclick="window.close()">Zatvori</button>
        `);
      return;
    }
    let postoji = false;
    userList.map((user) => {
      if (user.korisnickoIme == currentkorisnickoIme) {
        postoji = true;
      }
    });

    if (isNew) {
      if (postoji) {
        validationError(`
        <p>KORISNICKO IME VEC POSTOJI!</p>
        <button onclick="window.close()">Zatvori</button>
        `);
        return;
      }
      await addDoc(usersCollection, {
        adresa: currentAdresa,
        datumRodjenja: currentDatum,
        email: currentEmail,
        ime: currentIme,
        korisnickoIme: currentkorisnickoIme,
        lozinka: currentLozinka,
        prezime: currentPrezime,
        telefon: currentTelefon,
        zanimanje: currentZanimanje,
      });
    } else {
      const userDoc = doc(db, "korisnici", currentId);
      await updateDoc(userDoc, {
        adresa: currentAdresa,
        datumRodjenja: currentDatum,
        email: currentEmail,
        ime: currentIme,
        korisnickoIme: currentkorisnickoIme,
        lozinka: currentLozinka,
        prezime: currentPrezime,
        telefon: currentTelefon,
        zanimanje: currentZanimanje,
      });
    }
    setCurrentId("");
    setCurrentAdresa("");
    setCurrentDatum("");
    setCurrentEmail("");
    setCurrentIme("");
    setCurrentkorisnickoIme("");
    setCurrentLozinka("");
    setCurrentPrezime("");
    setCurrentTelefon("");
    setCurrentZanimanje("");
    setIsNew(false);
  };

  const deleteUser = async (id) => {
    const confirmed = window.confirm(
      "Da li ste sigurni da želite da obrišete korisnika?"
    );
    if (!confirmed) return;

    const userDoc = doc(db, "korisnici", id);
    await deleteDoc(userDoc);

    setCurrentId("");
    setCurrentAdresa("");
    setCurrentDatum("");
    setCurrentEmail("");
    setCurrentIme("");
    setCurrentkorisnickoIme("");
    setCurrentLozinka("");
    setCurrentPrezime("");
    setCurrentTelefon("");
    setCurrentZanimanje("");
    setIsNew(false);
  };

  return (
    <div className="body">
      <BrownBook />
      <h1 className="center txt-center bg top-padding bottom-padding">
        Lista svih knjizara:
      </h1>
      <div className="center bottom-padding">
        <input
          type="text"
          placeholder="Pretraži po nazivu..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={style.nazivKnjige}
        />
      </div>
      <div className={style.containerCrud}>
        <div className={`${style.list} bottom-margine`}>
          {filteredUsers.map((user) => (
            <div
              onClick={() => {
                setCurrentId(user.id);
                setCurrentAdresa(user.adresa);
                setCurrentDatum(user.datumRodjenja);
                setCurrentEmail(user.email);
                setCurrentIme(user.ime);
                setCurrentkorisnickoIme(user.korisnickoIme);
                setCurrentLozinka(user.lozinka);
                setCurrentPrezime(user.prezime);
                setCurrentTelefon(user.telefon);
                setCurrentZanimanje(user.zanimanje);
                setIsNew(false);
              }}
              key={user.id}
              className={`${style.item} ${
                user.id == currentId ? style.selected : null
              }`}
            >
              <h2 className={`${style.atribut} ${style.main}`}>
                {user.korisnickoIme}
              </h2>
              <p className={`${style.atribut} ${style.side}`}>{user.ime}</p>
              <p className={`${style.atribut} ${style.side}`}>{user.prezime}</p>
              <button onClick={() => deleteUser(user.id)} className="x">
                X
              </button>
            </div>
          ))}
        </div>
        <div className={`${style.form}`}>
          <h1>Izmene u bazi:</h1>
          <p>korisnickoIme:</p>
          <input
            type="text"
            name="korisnickoIme"
            value={currentkorisnickoIme}
            onChange={({ target: { value } }) => setCurrentkorisnickoIme(value)}
            placeholder="korisnickoIme"
            className={`${style.updateInput} bottom-margine`}
          />
          <p>lozinka:</p>
          <input
            type="text"
            name="lozinka"
            value={currentLozinka}
            onChange={({ target: { value } }) => setCurrentLozinka(value)}
            placeholder="lozinka"
            className={`${style.updateInput} bottom-margine`}
          />
          <p>ime:</p>
          <input
            type="text"
            name="ime"
            value={currentIme}
            onChange={({ target: { value } }) => setCurrentIme(value)}
            placeholder="ime"
            className={`${style.updateInput} bottom-margine`}
          />
          <p>prezime:</p>
          <input
            type="text"
            name="prezime"
            value={currentPrezime}
            onChange={({ target: { value } }) => setCurrentPrezime(value)}
            placeholder="prezime"
            className={`${style.updateInput} bottom-margine`}
          />
          <p>datumRodjenja:</p>
          <input
            type="date"
            name="datumRodjenja"
            value={currentDatum}
            onChange={({ target: { value } }) => setCurrentDatum(value)}
            placeholder="datumRodjenja"
            className={`${style.updateInput} bottom-margine`}
          />
          <p>adresa:</p>
          <input
            type="text"
            name="adresa"
            value={currentAdresa}
            onChange={({ target: { value } }) => setCurrentAdresa(value)}
            placeholder="adresa"
            className={`${style.updateInput} bottom-margine`}
          />
          <p>email:</p>
          <input
            type="mail"
            name="email"
            value={currentEmail}
            onChange={({ target: { value } }) => setCurrentEmail(value)}
            placeholder="email"
            className={`${style.updateInput} bottom-margine`}
          />
          <p>kontaktTelefon:</p>
          <input
            type="text"
            name="kontaktTelefon"
            value={currentTelefon}
            onChange={({ target: { value } }) => setCurrentTelefon(value)}
            placeholder="kontaktTelefon"
            className={`${style.updateInput} bottom-margine`}
          />
          <p>zanimanje:</p>
          <input
            type="text"
            name="zanimanje"
            value={currentZanimanje}
            onChange={({ target: { value } }) => setCurrentZanimanje(value)}
            placeholder="zanimanje"
            className={`${style.updateInput} bottom-margine`}
          />
          <p>Dodaj kao novog korisnika: </p>
          <input
            type="checkbox"
            name="addNew"
            checked={isNew}
            onChange={() => setIsNew(!isNew)}
            className={`${style.check} bottom-margine`}
          />
          <button
            className={`${style.update} bottom-margine`}
            onClick={onSubmit}
          >
            UPDATE
          </button>
        </div>
      </div>
    </div>
  );
};
