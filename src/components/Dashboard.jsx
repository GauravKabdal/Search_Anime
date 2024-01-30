import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import menu from "../assets/menu_button.svg";
import Modal from "./Modal";
import Error from "./Error";
import Loader from "./Loader";
const Dashboard = () => {
  useEffect(() => {
    getData();
  }, []);

  const [movie, setMovie] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [genre, setGenre] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "327169c73dmshe43c2b04a360f50p1aec84jsnbea5c55f33e0",
      "X-RapidAPI-Host": "anime-db.p.rapidapi.com",
    },
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu); // toggles the value of showMenu state
  };

  const getData = () => {
    let url =
      "https://anime-db.p.rapidapi.com/anime?page=1&size=16&sortBy=ranking&sortOrder=asc";

    let cacheKey = JSON.stringify(url, options);
    setIsLoading(true);
    setIsError(false);
    if (localStorage.getItem(cacheKey)) {
      setMovie(JSON.parse(localStorage.getItem(cacheKey)));
      console.log("Loaded from local storage");
      setIsLoading(false);
    } else
      fetch(url, options)
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          let initialData = response.data;
          setMovie(initialData);
          setIsLoading(false);
          localStorage.setItem(cacheKey, JSON.stringify(initialData));
          console.log("Data loaded from Api");
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
          setIsError(true);
        });
  };
  const handleSearch = () => {
    fetch(
      `https://anime-db.p.rapidapi.com/anime?page=1&size=10&search=${searchItem}`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setMovie(response.data);
      })
      .catch((err) => console.error(err));
  };

  const handleMenuClick = (value) => {
    setGenre(value);
    console.log(genre);

    fetch(
      `https://anime-db.p.rapidapi.com/anime?page=1&size=16&genres=${genre}`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setMovie(response.data);
      })
      .catch((err) => console.error(err));
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
    fetch(
      `https://anime-db.p.rapidapi.com/anime?page=${
        currentPage - 1
      }&size=16&sortBy=ranking&sortOrder=asc`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setMovie(response.data);

        console.log(currentPage);
      })
      .catch((err) => console.error(err));
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    fetch(
      `https://anime-db.p.rapidapi.com/anime?page=${
        currentPage + 1
      }&size=16&sortBy=ranking&sortOrder=asc`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setMovie(response.data);

        console.log(currentPage);
      })
      .catch((err) => console.error(err));
  };

  if (isError) return <Error />;
  if (isLoading)
    return (
      <Modal open={true}>
        <Loader />
      </Modal>
    );
  return (
    <>
      <header>
        <h1 id="applogo">
          Search<span style={{ color: "rgb(85, 85, 211)" }}>Anime</span>
        </h1>
        <div className="search_container">
          <input
            type="text"
            className="search_box"
            placeholder="Search by movie titles...."
            value={searchItem}
            onChange={(event) => {
              setSearchItem(event.target.value);
            }}
          />
          <button onClick={handleSearch} id="search_button">
            Search
          </button>
        </div>
        <button onClick={toggleMenu} className="menu_button">
          <img src={menu} alt="" />
        </button>
      </header>
      <main>
        <div className="grid_container">
          {movie.map((item) => (
            <div key={item.id} className="grid_item">
              <div
                className="movie-image"
                style={{ backgroundImage: `url(${item.image})` }}
              ></div>
              {/* {item.image ? (
                <img
                  src={item.image}
                  alt="Image not available"
                  className="movie-image"
                />
              ) : (
                <p>Image not available</p>
              )} */}
              <h3>{item.title}</h3>
              <p>Rank : {item.ranking}</p>
              <p>Episodes : {item.episodes}</p>
              <a href={item.link}>More Info</a>
            </div>
          ))}
        </div>
        <section className="page_nav">
          {currentPage - 1 > 0 && (
            <button onClick={handlePrevPage} className="page_button">
              Previous Page {"<"}
            </button>
          )}
          {currentPage + 1 < 5 && (
            <button onClick={handleNextPage} className="page_button">
              Next Page {">"}
            </button>
          )}
        </section>
        <Modal
          open={showMenu}
          onClose={() => setShowMenu(false)}
          center={false}
        >
          <div className="menu_section">
            <h1>Genres</h1>
            <button
              className="genre_button"
              onClick={() => handleMenuClick("Action")}
            >
              Action
            </button>
            <button
              className="genre_button"
              onClick={() => handleMenuClick("Drama")}
            >
              Drama
            </button>
            <button
              className="genre_button"
              onClick={() => handleMenuClick("Romance")}
            >
              Romance
            </button>
            <button
              className="genre_button"
              onClick={() => handleMenuClick("Comedy")}
            >
              Comedy
            </button>
            <button
              className="genre_button"
              onClick={() => handleMenuClick("Horror")}
            >
              Horror
            </button>
            <button
              className="genre_button"
              onClick={() => handleMenuClick("Adventure")}
            >
              Adventure
            </button>
          </div>
        </Modal>
      </main>
    </>
  );
};

export default Dashboard;
