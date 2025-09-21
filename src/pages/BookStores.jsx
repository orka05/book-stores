import { collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { BrownBook } from "../components/BrownBook";
import { db } from "../config/firebase";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import style from "../style/main.module.css";

export const BookStores = () => {
  const [storeList, setStoreList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedStoreId, setSelectedStoreId] = useState(
    searchParams.get("storeId")
  );

  const storesCollection = collection(db, "knjizare");

  const [bookList, setBookList] = useState([]);
  const booksCollection = collection(db, "knjige");

  useEffect(() => {
    const handleChangeStore = () => {
      setSearchParams({ storeId: selectedStoreId });
    };
    handleChangeStore();
  }, [selectedStoreId]);

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

  return (
    <div className="body">
      <BrownBook />
      <div className={`${style.select} top-padding bottom-padding`}>
        <p>izaberite knjizaru:</p>
        <select
          name="knjizara"
          value={selectedStoreId}
          onChange={(e) => setSelectedStoreId(e.target.value)}
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

      {storeList.map((store) =>
        store.id == selectedStoreId ? (
          <div key={store.id} className={style.container}>
            <h1>{store.naziv}</h1>
            <p className="bottom-padding">since {store.godinaOsnivanja}</p>
            <img
              src={store.logo}
              alt="slika"
              width={200}
              className={`${style.slika} ${style.logo}`}
            />
            <h2 className="bottom-padding">{store.adresa}</h2>
            <p>{store.email}</p>
            <p className="bottom-padding">{store.kontaktTelefon}</p>

            <h2 className="center top-margine bottom-margine">
              Lista dostupnih knjiga:
            </h2>
            <div className={`${style.designList} bottom-margine`}>
              {bookList.map((book) =>
                book.knjigeId == store.knjige ? (
                  <Link
                    to="/books"
                    key={book.id}
                    state={book.naziv}
                    className={style.designItem}
                  >
                    <h2>{book.naziv}</h2>
                    <p>{book.autor}</p>
                    <img
                      src={book.slike[0]}
                      alt="slika"
                      width={60}
                      className={style.designImg}
                    />
                  </Link>
                ) : null
              )}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};
