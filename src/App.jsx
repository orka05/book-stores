import { Routes, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { BookStores } from "./pages/BookStores";
import { Books } from "./pages/Books";
import { CRUD } from "./pages/CRUD";
import { BookStoresCRUD } from "./pages/BookStoresCRUD";
import { BooksCRUD } from "./pages/BooksCRUD";
import { UsersCRUD } from "./pages/UsersCRUD";

import { Header } from "./components/Header";

export const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bookstores" element={<BookStores />} />
        <Route path="/books" element={<Books />} />
        <Route path="/crud" element={<CRUD />} />
        <Route path="/book-stores-crud" element={<BookStoresCRUD />} />
        <Route path="/books-crud" element={<BooksCRUD />} />
        <Route path="/users-crud" element={<UsersCRUD />} />
      </Routes>
    </>
  );
};
