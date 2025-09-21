import { Link } from "react-router-dom";
import { Book } from "../components/Book";
import { BookStore } from "../components/BookStore";
import { User } from "../components/User";
import style from "../style/crud.module.css";

export const CRUD = () => {
  return (
    <>
      <h1 className="center txt-center top-padding bottom-padding">
        Selektujte tabelu koju zelite da izmenite
      </h1>
      <div className={style.crudBody}>
        <Link to="/book-stores-crud" className={style.crudDiv}>
          <BookStore />
          <h3 className="bg txt-center">Izmena nad tabelom knjizara</h3>
          <p className="bg txt-center">
            Izmena pojedinacnog podatka o knjizari, dodavanje novih i brisanje
            vec postojecih knjizara iz baze podataka.
          </p>
        </Link>
        <Link to="/books-crud" className={style.crudDiv}>
          <Book />
          <h3 className="bg txt-center">Izmena nad tabelom knjiga</h3>
          <p className="bg txt-center">
            Izmena pojedinacnog podatka o knjizi, dodavanje nove i brisanje vec
            postojece knjige iz baze podataka.
          </p>
        </Link>
        <Link to="/users-crud" className={style.crudDiv}>
          <User />
          <h3 className="bg txt-center">Izmena nad tabelom korisnika</h3>
          <p className="bg txt-center">
            Izmena pojedinacnog podatka o korisniku, dodavanje novog i brisanje
            vec postojeceg korisnika iz baze podataka.
          </p>
        </Link>
      </div>
    </>
  );
};
