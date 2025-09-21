import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { BrownBook } from "../components/BrownBook";
import { db } from "../config/firebase";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import style from "../style/main.module.css";

export const Books = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [bookList, setBookList] = useState([]);
  const [storeList, setStoreList] = useState([]);

  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [searchGenre, setSearchGenre] = useState("");

  const booksCollection = collection(db, "knjige");
  const storesCollection = collection(db, "knjizare");

  useEffect(() => {
    if (location.state) {
      setSearchTitle(location.state); // uzmi vrednost
      navigate("/books", { replace: true, state: null }); // odmah obriši state
    }
  }, [location.state, navigate]);

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

  const handleTitleChange = (e) => setSearchTitle(e.target.value);
  const handleAuthorChange = (e) => setSearchAuthor(e.target.value);
  const handleGenreChange = (e) => setSearchGenre(e.target.value);

  // filtriranje knjiga
  const filteredBooks = bookList.filter((book) => {
    return (
      (searchTitle === "" ||
        book.naziv.toLowerCase().includes(searchTitle.toLowerCase())) &&
      (searchAuthor === "" ||
        book.autor.toLowerCase().includes(searchAuthor.toLowerCase())) &&
      (searchGenre === "" ||
        book.zanr.toLowerCase().includes(searchGenre.toLowerCase()))
    );
  });

  // unique vrednosti za datalist
  const uniqueTitles = [...new Set(filteredBooks.map((book) => book.naziv))];
  const uniqueAuthors = [...new Set(filteredBooks.map((book) => book.autor))];
  const uniqueGenres = [...new Set(filteredBooks.map((book) => book.zanr))];

  const highlightText = (text, keywords) => {
    if (!keywords || keywords.length === 0) return text;

    // pravim regex od svih kljucnih reci
    const regex = new RegExp(`(${keywords.join("|")})`, "gi");

    const parts = text.split(regex);

    return parts.map((part, i) =>
      keywords.some((kw) => kw.toLowerCase() === part.toLowerCase()) ? (
        <span key={i} className="highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="body">
      <BrownBook />

      <div className={`${style.select} top-padding bottom-padding`}>
        <p>Pretraga po nazivu:</p>
        <input
          list="titles"
          value={searchTitle}
          onChange={handleTitleChange}
          className={style.wideSelect}
        />
        <datalist id="titles">
          {uniqueTitles.map((title, i) => (
            <option key={i} value={title} />
          ))}
        </datalist>
      </div>

      <div className={`${style.select} top-padding bottom-padding`}>
        <p>Pretraga po autoru:</p>
        <input
          list="authors"
          value={searchAuthor}
          onChange={handleAuthorChange}
          className={style.wideSelect}
        />
        <datalist id="authors">
          {uniqueAuthors.map((author, i) => (
            <option key={i} value={author} />
          ))}
        </datalist>
      </div>

      <div className={`${style.select} top-padding bottom-padding`}>
        <p>Pretraga po žanru:</p>
        <input
          list="genres"
          value={searchGenre}
          onChange={handleGenreChange}
          className={style.wideSelect}
        />
        <datalist id="genres">
          {uniqueGenres.map((genre, i) => (
            <option key={i} value={genre} />
          ))}
        </datalist>
      </div>

      {filteredBooks.length === 0 ? (
        <p className="center">Nema rezultata za zadate kriterijume.</p>
      ) : (
        filteredBooks.map((book) => (
          <>
            <hr className="bottom-margine top-margine" />
            <div key={book.id} className={style.containerInfo}>
              <div className={style.container}>
                <h1>{highlightText(book.naziv, [searchTitle])}</h1>
                <p className="bottom-padding">
                  {highlightText(book.autor, [searchAuthor])}
                </p>
                <img
                  src={book.slike[0]}
                  alt="slika"
                  className={`${style.slika} ${style.slikaKnjige}`}
                />
                <h3 className="bottom-padding">{book.cena} din.</h3>
              </div>
              <div className={style.container}>
                <h1 className="bottom-margine">
                  Osnovne informacije o knjizi:
                </h1>
                <p>dostupno u:</p>
                {storeList.map((store) =>
                  store.knjige === book.knjigeId ? (
                    <div key={store.id}>
                      <Link to="/BookStores" state={{ storeId: store.id }}>
                        <h1 className={style.storeLink}>{store.naziv}</h1>
                        <p className="bottom-margine">{store.adresa}</p>
                      </Link>
                    </div>
                  ) : null
                )}
                <p>
                  Format: <span className={style.opisFont}>{book.format}</span>
                </p>
                <p>
                  Žanr:{" "}
                  <span className={style.opisFont}>
                    {highlightText(book.zanr, [searchGenre])}
                  </span>
                </p>
                <p className="bottom-padding">
                  Broj strana:{" "}
                  <span className={style.opisFont}>{book.brojStrana}</span>
                </p>
                <h3>Opis:</h3>
                <p
                  className={`bottom-padding ${style.opis} ${style.opisFont} bottom-margine`}
                >
                  {book.opis}
                </p>
              </div>
            </div>
          </>
        ))
      )}
    </div>
  );
};
