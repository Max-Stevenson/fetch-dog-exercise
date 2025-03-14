import React,  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MultiSelectDropdown from "../components/MultiSelectDropdown";
import "./Dashboard.scss";

function Dashboard() {
    const navigate = useNavigate()
    const [dogs, setDogs] = useState([]);
    const [breedsData, setBreeds] = useState([]);
    const [selectedBreeds, setSelectedBreeds] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        fetchBreeds();
        fetchDogs();
    }, [sortOrder]);

  const buildInitialUrl = () => {
    const params = new URLSearchParams();
    if (selectedBreeds && selectedBreeds.length > 0) {
      selectedBreeds.forEach((breed) => params.append("breeds", breed));
    }
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
        setNextPageUrl(searchData.next);
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
          body: JSON.stringify(resultIds)
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


  return (
    <>
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the protected dashboard!</p>
    </div>
    <h3>Find your purrfect match!</h3>
    <div>
      <MultiSelectDropdown
        options={breedsData}
        selectedOptions={selectedBreeds}
        onChange={setSelectedBreeds}
        placeholder="Select breeds..."
      />
    </div>
    <div>
    <button onClick={fetchDogs} className="search-button">
  Search
</button>
    </div>
    <div className="dog-container">
    {dogs.map((dog) => (
      <div key={dog.id} className="dog-card">
        <img src={dog.img} alt={dog.name} className="dog-image" />
        <div className="dog-details">
          <p><strong>Name:</strong> {dog.name}</p>
          <p><strong>Age:</strong> {dog.age}</p>
          <p><strong>Breed:</strong> {dog.breed}</p>
          <p><strong>Zip Code:</strong> {dog.zip_code}</p>
        </div>
      </div>
    ))}
  </div>
  <div className="pagination">
        {nextPageUrl && (
          <button onClick={() => fetchDogs(nextPageUrl)} className="search-button">
            Next Page
          </button>
        )}
      </div>
    </>
  );
}

export default Dashboard;
