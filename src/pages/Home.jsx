import style from "../style/main.module.css";
import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { Link } from "react-router-dom";
//import useUser from "../context/useUser.jsx";

export const Home = () => {
  const [storeList, setStoreList] = useState([]);
  const [searchText, setSearchText] = useState(""); // input value

  const storesCollection = collection(db, "knjizare");

  //const { userId, setUserId } = useUser();

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

  return (
    <div className="body center">
      <h1 className="center txt-center bg top-padding bottom-padding">
        Lista svih knjizara:
      </h1>
      <div className="center bottom-padding">
        <input
          type="text"
          placeholder="Pretraži po nazivu..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={`${style.nazivKnjige} bottom-margine`}
        />
      </div>
      <div className={style.designList}>
        {filteredStores.map((store) => (
          <Link
            key={store.id}
            to="/BookStores"
            state={{ storeId: store.id }}
            className={style.designItem}
          >
            <h1>{store.naziv}</h1>
            <p>{store.adresa}</p>
            <img
              className={style.designImg}
              src={store.logo}
              alt="slika"
              width={100}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
