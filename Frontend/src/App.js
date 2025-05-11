import React from "react";
import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import NewBlogPost from "./views/new/New";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from "./views/login/LoginPage";
import RegisterPage from "./views/register/RegisterPage";
// import { useEffect } from "react";

function App() {
  //Fetch di prova per verificare il collegamento tra frontend e backend
  // const fetchAuthors = async () => {
  //   const res = await fetch (process.env.REACT_APP_APIURL + "/authors");
  //   const data = await res.json();
  //   console.log(data);
  // }

  // useEffect(() => {
  //   fetchAuthors();
  // }, [])

  return (

    <Router>
      <NavBar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" exact element={<LoginPage />} /> 
        <Route path="/register" exact element={<RegisterPage />} /> 
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/new" element={<NewBlogPost />} />
        <Route path="*" element={<h1>404 Not Found/</h1>} />
      </Routes>
      <Footer />
    </Router>
  
  );
}

export default App;
