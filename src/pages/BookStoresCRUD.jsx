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

export const BookStoresCRUD = () => {
  const [storeList, setStoreList] = useState([]);
  const [searchText, setSearchText] = useState(""); // input value

  const storesCollection = collection(db, "knjizare");

  const [currentId, setCurrentId] = useState("");
  const [currentNaziv, setCurrentNaziv] = useState("");
  const [currentAdresa, setCurrentAdresa] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentTelefon, setCurrentTelefon] = useState("");
  const [currentLogo, setCurrentLogo] = useState("");
  const [currentGodina, setCurrentGodina] = useState("");
  const [currentKnjige, setCurrentKnjige] = useState("");

  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const getStoreList = async () => {
      try {
        const data = await getDocs(storesCollection);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setStoreList(filteredData);
      } catch (err) {
        console.error(err);
      }
    };
    getStoreList();
  }, [storesCollection]);

  const filteredStores = storeList.filter((store) =>
    store.naziv.toLowerCase().includes(searchText.toLowerCase())
  );

  const onSubmit = async () => {
    if (
      !currentAdresa ||
      !currentEmail ||
      !currentGodina ||
      !currentId ||
      !currentLogo ||
      !currentNaziv ||
      !currentTelefon ||
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
      // --- validacija godine (samo brojevi) ---
      /\D/.test(currentGodina) ||
      // --- validacija logo linka ---
      !currentLogo.startsWith("https://")
    ) {
      validationError(`
        <p>Adresa u formatu [_,_,_] gde drugo polje ima samo slova a trece samo brojeve</p>
        <p>email mora da sadrzi @ i . sa nekim nastavkom</p>
        <p>Kontakt telefon ne sme da sadrzi slova</p>
        <p>Logo mora da pocinje sa "https://"</p>
        <p>U godinu se upisuju samo brojevi</p>
        <button onclick="window.close()">Zatvori</button>
        `);
      return;
    }

    if (isNew) {
      await addDoc(storesCollection, {
        adresa: currentAdresa,
        email: currentEmail,
        godinaOsnivanja: currentGodina,
        knjige: currentKnjige,
        kontaktTelefon: currentTelefon,
        logo: currentLogo,
        naziv: currentNaziv,
      });
    } else {
      const storeDoc = doc(db, "knjizare", currentId);
      await updateDoc(storeDoc, {
        adresa: currentAdresa,
        email: currentEmail,
        godinaOsnivanja: currentGodina,
        knjige: "",
        kontaktTelefon: currentTelefon,
        logo: currentLogo,
        naziv: currentNaziv,
      });
    }
    setCurrentAdresa("");
    setCurrentEmail("");
    setCurrentGodina("");
    setCurrentKnjige("");
    setCurrentTelefon("");
    setCurrentLogo("");
    setCurrentNaziv("");
    setCurrentId("");
  };

  const deleteStore = async (id) => {
    const storeDoc = doc(db, "knjizare", id);
    await deleteDoc(storeDoc);
    setCurrentAdresa("");
    setCurrentEmail("");
    setCurrentGodina("");
    setCurrentKnjige("");
    setCurrentTelefon("");
    setCurrentLogo("");
    setCurrentNaziv("");
    setCurrentId("");
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
          {filteredStores.map((store) => (
            <div
              onClick={() => {
                setCurrentId(store.id);
                setCurrentNaziv(store.naziv);
                setCurrentAdresa(store.adresa);
                setCurrentEmail(store.email);
                setCurrentTelefon(store.kontaktTelefon);
                setCurrentLogo(store.logo);
                setCurrentGodina(store.godinaOsnivanja);
                setCurrentKnjige(store.knjige);
                setIsNew(false);
              }}
              key={store.id}
              className={`${style.item} ${
                store.id == currentId ? style.selected : null
              }`}
            >
              <h2 className={`${style.atribut} ${style.main}`}>
                {store.naziv}
              </h2>
              <img
                className={`${style.atribut} ${style.slika}`}
                src={store.logo}
                alt="slika"
                width={100}
              />
              <button onClick={() => deleteStore(store.id)} className="x">
                X
              </button>
            </div>
          ))}
        </div>
        <div className={`${style.form}`}>
          <h1>Izmene u bazi:</h1>
          <p>naziv:</p>
          <input
            type="text"
            name="naziv"
            value={currentNaziv}
            onChange={({ target: { value } }) => setCurrentNaziv(value)}
            placeholder="naziv"
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
          <p>logo:</p>
          <input
            type="text"
            name="logo"
            value={currentLogo}
            onChange={({ target: { value } }) => setCurrentLogo(value)}
            placeholder="logo: https://..."
            className={`${style.updateInput} bottom-margine`}
          />
          <p>godinaOsnivanja:</p>
          <input
            type="text"
            name="godinaOsnivanja"
            value={currentGodina}
            onChange={({ target: { value } }) => setCurrentGodina(value)}
            placeholder="godinaOsnivanja"
            className={`${style.updateInput} bottom-margine`}
          />
          <p>Dodaj kao novu knjizaru: </p>
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
