import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationHeader from "../components/NavigationHeader";
import "./Favourites.scss";

function Favourites() {
  const navigate = useNavigate();
  const [favouriteDogs, setFavouriteDogs] = useState([]);
  const [randomMatch, setRandomMatch] = useState(null);

  useEffect(() => {
    const favouriteIds = JSON.parse(localStorage.getItem("favouriteIds")) || [];
    if (favouriteIds.length > 0) {
      fetchFavouriteDogs(favouriteIds);
    }
  }, []);

  const fetchFavouriteDogs = async (favouriteIds) => {
    try {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/dogs",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(favouriteIds),
        }
      );
      if (response.status === 401) {
        navigate("/login");
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setFavouriteDogs(data);
      } else {
        console.error("Failed to fetch favourite dogs");
      }
    } catch (error) {
      console.error("Error fetching favourite dogs:", error);
    }
  };

  const selectRandomMatch = () => {
    if (favouriteDogs.length > 0) {
      const randomIndex = Math.floor(Math.random() * favouriteDogs.length);
      setRandomMatch(favouriteDogs[randomIndex]);
    }
  };

  return (
    <>
    <NavigationHeader />
    <div className="favourites-page">
      <h2>Your Favourite Dogs</h2>
      {favouriteDogs.length === 0 ? (
        <p>No favourites selected yet.</p>
      ) : (
        <>
          <button onClick={selectRandomMatch} className="match-button">
            Find a Match!
          </button>
          {randomMatch && (
            <div className="match-result">
              <h3>Your Match:</h3>
              <div className="dog-card">
                <img
                  src={randomMatch.img}
                  alt={randomMatch.name}
                  className="dog-image"
                />
                <div className="dog-details">
                  <p>
                    <strong>Name:</strong> {randomMatch.name}
                  </p>
                  <p>
                    <strong>Age:</strong> {randomMatch.age}
                  </p>
                  <p>
                    <strong>Breed:</strong> {randomMatch.breed}
                  </p>
                  <p>
                    <strong>Zip Code:</strong> {randomMatch.zip_code}
                  </p>
                </div>
              </div>
            </div>
          )}
          <h3>All Favourites:</h3>
          <div className="dog-container">
            {favouriteDogs.map((dog) => (
              <div key={dog.id} className="dog-card">
                <img src={dog.img} alt={dog.name} className="dog-image" />
                <div className="dog-details">
                  <p>
                    <strong>Name:</strong> {dog.name}
                  </p>
                  <p>
                    <strong>Age:</strong> {dog.age}
                  </p>
                  <p>
                    <strong>Breed:</strong> {dog.breed}
                  </p>
                  <p>
                    <strong>Zip Code:</strong> {dog.zip_code}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
    </>
  );
}

export default Favourites;
