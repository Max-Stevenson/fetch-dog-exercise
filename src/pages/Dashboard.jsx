import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MultiSelectDropdown from "../components/MultiSelectDropdown";
import NavigationHeader from "../components/NavigationHeader";
import "./Dashboard.scss";

function Dashboard() {
  const navigate = useNavigate();
  const [dogs, setDogs] = useState([]);
  const [breedsData, setBreeds] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [favouriteIds, setFavouriteIds] = useState(() => {
    const saved = localStorage.getItem("favouriteIds");
    return saved ? JSON.parse(saved) : [];
  });
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [zipCodes, setZipCodes] = useState([]);
  const [zipInput, setZipInput] = useState("");

  useEffect(() => {
    fetchBreeds();
  }, []);

  useEffect(() => {
    fetchDogs();
  }, [selectedBreeds, sortOrder]);

  const buildInitialUrl = () => {
    const params = new URLSearchParams();
    if (selectedBreeds && selectedBreeds.length > 0) {
      selectedBreeds.forEach((breed) => params.append("breeds", breed));
    }
    if (ageMin) {
      params.append("ageMin", ageMin);
    }
    if (ageMax) {
      params.append("ageMax", ageMax);
    }
    if (zipCodes && zipCodes.length > 0) {
      zipCodes.forEach((zip) => params.append("zipCodes", zip));
    }
    params.append("sort", `breed:${sortOrder}`);
    return `https://frontend-take-home-service.fetch.com/dogs/search?${params.toString()}`;
  };

  const fetchBreeds = async () => {
    try {
      const response = await fetch(
        "https://frontend-take-home-service.fetch.com/dogs/breeds",
        { credentials: "include" }
      );

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (response.status === 200) {
        const breedsData = await response.json();
        setBreeds(breedsData);
      } else {
        console.error("Failed to fetch breeds");
      }
    } catch (error) {
      console.error("Error fetching breeds:", error);
    }
  };

  const fetchDogs = async (url = null) => {
    try {
      const fetchUrl = url
        ? `https://frontend-take-home-service.fetch.com${url}`
        : buildInitialUrl();

      const searchResponse = await fetch(fetchUrl, { credentials: "include" });

      if (searchResponse.status === 401) {
        navigate("/login");
        return;
      }

      let resultIds, total;
      if (searchResponse.status === 200) {
        const searchData = await searchResponse.json();
        ({ resultIds, total } = searchData);
        setNextPageUrl(searchData.next || null);
        setPrevPageUrl(searchData.prev || null);
      } else {
        console.error("Failed to fetch dogs");
        return;
      }

      const detailsResponse = await fetch(
        "https://frontend-take-home-service.fetch.com/dogs",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resultIds),
        }
      );

      if (detailsResponse.status === 401) {
        navigate("/login");
        return;
      }

      if (detailsResponse.status === 200) {
        const detailsData = await detailsResponse.json();
        setDogs(detailsData);
      } else {
        console.error("Failed to fetch dog details");
      }
    } catch (error) {
      console.error("Error fetching dog data:", error);
    }
  };

  const toggleFavourite = (dogId) => {
    setFavouriteIds((prev) => {
      const updated = prev.includes(dogId)
        ? prev.filter((id) => id !== dogId)
        : [...prev, dogId];
      localStorage.setItem("favouriteIds", JSON.stringify(updated));
      return updated;
    });
  };

  const addZipCode = () => {
    const trimmed = zipInput.trim();
    if (trimmed && !zipCodes.includes(trimmed)) {
      setZipCodes([...zipCodes, trimmed]);
    }
    setZipInput("");
  };

  const removeZipCode = (zip) => {
    setZipCodes(zipCodes.filter((z) => z !== zip));
  };

  return (
    <>
      <NavigationHeader />
      {/* Header Section */}
      <header className="dashboard-header">
        <h1>Available Dogs</h1>
        <h3>Find your purrfect match!</h3>
      </header>

      {/* Search Controls Section */}
      <section className="search-controls">
        {/* Breed Dropdown */}
        <div className="dropdown-section">
          <MultiSelectDropdown
            options={breedsData}
            selectedOptions={selectedBreeds}
            onChange={setSelectedBreeds}
            placeholder="Select breeds..."
          />
        </div>

        {/* Zip Code Search */}
        <div className="zip-search-section">
          <div className="zip-code-search">
            <label>
              Zip Codes:
              <input
                type="text"
                placeholder="Enter zip code"
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addZipCode();
                  }
                }}
              />
            </label>
            <button onClick={addZipCode} className="add-zip-button">
              Add
            </button>
          </div>
          <div className="zip-code-chips">
            {zipCodes.map((zip) => (
              <span key={zip} className="chip">
                {zip} <button onClick={() => removeZipCode(zip)}>×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Age Filters */}
        <div className="age-filters">
          <label>
            Minimum Age:
            <input
              type="number"
              value={ageMin}
              onChange={(e) => setAgeMin(e.target.value)}
              placeholder="e.g. 1"
            />
          </label>
          <label>
            Maximum Age:
            <input
              type="number"
              value={ageMax}
              onChange={(e) => setAgeMax(e.target.value)}
              placeholder="e.g. 10"
            />
          </label>
        </div>

        {/* Search and Sort Actions */}
        <div className="action-controls">
          <button onClick={() => fetchDogs()} className="search-button">
            Search
          </button>
        </div>
      </section>

      {/* Results Section */}
      <section className="results">
      <div className="sort-controls">
            <button
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="sort-button"
            >
              Sort by: breed (
              {sortOrder === "asc" ? "Ascending" : "Descending"})
            </button>
          </div>
        <div className="dog-container">
          {dogs.map((dog) => (
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
              <button
                onClick={() => toggleFavourite(dog.id)}
                className={`favourite-button ${
                  favouriteIds.includes(dog.id) ? "active" : ""
                }`}
              >
                {favouriteIds.includes(dog.id) ? "❤️" : "🤍"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Pagination Section */}
      <footer className="pagination-controls">
        {prevPageUrl && (
          <button
            onClick={() => fetchDogs(prevPageUrl)}
            className="pagination-button"
          >
            Previous Page
          </button>
        )}
        {nextPageUrl && (
          <button
            onClick={() => fetchDogs(nextPageUrl)}
            className="pagination-button"
          >
            Next Page
          </button>
        )}
      </footer>
    </>
  );
}

export default Dashboard;
