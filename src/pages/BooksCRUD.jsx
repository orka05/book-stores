import { BrownBook } from "../components/BrownBook";
import style from "../style/main.module.css";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { validationError } from "./ValidationError";

export const BooksCRUD = () => {
  const [bookList, setBookList] = useState([]);
  const [searchText, setSearchText] = useState(""); // input value

  const booksCollection = collection(db, "knjige");

  const [currentKnjigeId, setCurrentKnjigeId] = useState("");

  const [currentId, setCurrentId] = useState("");
  const [currentAutor, setcurrentAutor] = useState("");
  const [currentBrojStrana, setcurrentBrojStrana] = useState("");
  const [currentCena, setcurrentCena] = useState("");
  const [currentFormat, setcurrentFormat] = useState("");
  const [currentNaziv, setCurrentNaziv] = useState("");
  const [currentOpis, setCurrentOpis] = useState("");
  const [currentSlike, setCurrentSlike] = useState([]);
  const [currentZanr, setcurrentZanr] = useState("");

  const [isNew, setIsNew] = useState(false);

  //za knjizare

  const [storeList, setStoreList] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [oldKnjigeId, setOldKnjigeId] = useState("");

  const storesCollection = collection(db, "knjizare");

  useEffect(() => {
    const getBookList = async () => {
      try {
        const querySnapshot = await getDocs(booksCollection);

        let allBooks = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          const booksArray = Object.entries(data).map(([id, book]) => ({
            id: id,
            ...book,
            knjigeId: doc.id,
          }));

          allBooks = [...allBooks, ...booksArray];
        });

        setBookList(allBooks);
      } catch (err) {
        console.error(err);
      }
    };
    getBookList();
  }, [booksCollection]);

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

  const filteredbooks = bookList.filter((book) =>
    book.naziv.toLowerCase().includes(searchText.toLowerCase())
  );

  const onSubmit = async () => {
    if (
      !currentId ||
      !currentAutor ||
      !currentBrojStrana ||
      !currentCena ||
      !currentFormat ||
      !currentNaziv ||
      !currentOpis ||
      !currentSlike ||
      !currentZanr ||
      !oldKnjigeId ||
      !currentKnjigeId ||
      // --- validacija broja strana (samo brojevi) ---
      /\D/.test(currentBrojStrana) ||
      // --- validacija cene (samo brojevi) ---
      /\D/.test(currentCena) ||
      // --- validacija slike ---
      !currentSlike[0].startsWith("https://")
    ) {
      validationError(`
        <p>U polju cena mogu da budu samo brojevi</p>
        <p>U polju broj strana mogu da budu samo brojevi</p>
        <p>Slika mora da pocinje sa "https://"</p>
        <button onclick="window.close()">Zatvori</button>
        `);
      return;
    }

    const newBookData = {
      autor: currentAutor,
      brojStrana: currentBrojStrana,
      cena: currentCena,
      format: currentFormat,
      naziv: currentNaziv,
      opis: currentOpis,
      slike: currentSlike,
      zanr: currentZanr,
    };
    const oldBookDoc = doc(db, "knjige", oldKnjigeId);
    const bookDoc = doc(db, "knjige", currentKnjigeId);
    const randomBookId = doc(collection(db, "dummy")).id;

    if (isNew) {
      await updateDoc(bookDoc, {
        [randomBookId]: newBookData,
      });
    } else {
      await updateDoc(oldBookDoc, {
        [currentId]: deleteField(),
      });
      await updateDoc(bookDoc, {
        [randomBookId]: newBookData,
      });
    }

    setCurrentId("");
    setCurrentKnjigeId("");
    setcurrentAutor("");
    setcurrentBrojStrana("");
    setcurrentCena("");
    setcurrentFormat("");
    setCurrentNaziv("");
    setCurrentOpis("");
    setCurrentSlike("");
    setcurrentZanr("");

    setIsNew(false);

    setSelectedStoreId("");
    setOldKnjigeId("");
  };

  const deleteBook = async (bookId, knjigeId) => {
    const bookDoc = doc(db, "knjige", knjigeId);
    await updateDoc(bookDoc, {
      [bookId]: deleteField(),
    });
    setCurrentId("");
    setCurrentKnjigeId("");
    setcurrentAutor("");
    setcurrentBrojStrana("");
    setcurrentCena("");
    setcurrentFormat("");
    setCurrentNaziv("");
    setCurrentOpis("");
    setCurrentSlike("");
    setcurrentZanr("");

    setSelectedStoreId("");
    setOldKnjigeId("");
  };

  return (
    <div className="body">
      <BrownBook />
      <h1 className="center txt-center bg top-padding bottom-padding">
        Lista svih knjiga:
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
          {filteredbooks.map((book) => (
            <div
              onClick={() => {
                setCurrentId(book.id);
                setCurrentKnjigeId(book.knjigeId);
                setcurrentAutor(book.autor);
                setcurrentBrojStrana(book.brojStrana);
                setcurrentCena(book.cena);
                setcurrentFormat(book.format);
                setCurrentNaziv(book.naziv);
                setCurrentOpis(book.opis);
                setCurrentSlike(book.slike);
                setcurrentZanr(book.zanr);
                setIsNew(false);
                setOldKnjigeId(book.knjigeId);
                storeList.map((store) =>
                  store.knjige == book.knjigeId
                    ? setSelectedStoreId(store.id)
                    : null
                );
              }}
              key={book.id}
              className={`${style.item} ${
                book.id == currentId ? style.selected : null
              }`}
            >
              <h2 className={`${style.atribut} ${style.main}`}>{book.naziv}</h2>
              <img
                className={`${style.atribut} ${style.slika}`}
                src={book.slike[0]}
                alt="slika"
                width={60}
              />
              <button
                onClick={() => {
                  deleteBook(book.id, book.knjigeId);
                }}
                className="x"
              >
                X
              </button>
            </div>
          ))}
        </div>
        <div className={`${style.form} bottom-padding`}>
          <h1 className="bottom-margine">Izmene u bazi:</h1>
          <p>naziv:</p>
          <input
            type="text"
            name="naziv"
            value={currentNaziv}
            onChange={({ target: { value } }) => setCurrentNaziv(value)}
            placeholder="naziv"
            className={`${style.updateInput} bottom-margine`}
          />
          <p>autor:</p>
          <input
            type="text"
            name="autor"
            value={currentAutor}
            onChange={({ target: { value } }) => setcurrentAutor(value)}
            placeholder="autor"
            className={`${style.updateInput} bottom-margine`}
          />
          <div className={`${style.select} top-padding bottom-padding`}>
            <p>izaberite knjizaru:</p>
            <select
              name="knjizara"
              value={selectedStoreId}
              onChange={({ target: { value } }) => {
                const id = value;
                setSelectedStoreId(id);
                storeList.map((store) =>
                  store.id == id ? setCurrentKnjigeId(store.knjige) : null
                );
              }}
            >
              <option value="" className="txt-center">
                meni
              </option>
              {storeList.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.naziv}
                </option>
              ))}
            </select>
          </div>
          <p>broj strana:</p>
          <input
            type="number"
            name="brojStrana"
            value={currentBrojStrana}
            onChange={({ target: { value } }) => setcurrentBrojStrana(value)}
            placeholder="broj strana"
            className={`${style.updateInput} bottom-margine`}
          />
          <p>cena:</p>
          <input
            type="number"
            name="cena"
            value={currentCena}
            onChange={({ target: { value } }) => setcurrentCena(value)}
            placeholder="cena"
            className={`${style.updateInput} bottom-margine`}
          />
          <p>format:</p>
          <input
            type="text"
            name="format"
            value={currentFormat}
            onChange={({ target: { value } }) => setcurrentFormat(value)}
            placeholder="format"
            className={`${style.updateInput} bottom-margine`}
          />
          <p>opis:</p>
          <textarea
            type="text"
            name="opis"
            value={currentOpis}
            onChange={({ target: { value } }) => setCurrentOpis(value)}
            placeholder="opis"
            className={`${style.updateInput} bottom-margine`}
          />
          <p>slika korice:</p>
          <input
            type="text"
            name="slika"
            value={currentSlike}
            onChange={({ target: { value } }) => setCurrentSlike(value)}
            placeholder="slika: https://..."
            className={`${style.updateInput} bottom-margine`}
          />
          <p>zanr:</p>
          <input
            type="text"
            name="zanr"
            value={currentZanr}
            onChange={({ target: { value } }) => setcurrentZanr(value)}
            placeholder="zanr"
            className={`${style.updateInput} bottom-margine`}
          />
          <p>Dodaj kao novu knjigu: </p>
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
