import React,  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.scss";

function Dashboard() {
    const navigate = useNavigate()
    const [dogs, setDogs] = useState([]);
    const [breedFilter, setBreedFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        fetchDogs();
    }, [breedFilter, sortOrder]);

    const fetchDogs = async () => {
        try {
          const params = new URLSearchParams();
            // params.append("breeds", breedFilter);
            // params.append("zipCodes", zipCodes);
            // params.append("ageMin", ageMin);
            // params.append("ageMax", ageMax);
            // params.append("size", resultsPerPage);
    
    const searchResponse = await fetch(
        `https://frontend-take-home-service.fetch.com/dogs/search?${params.toString()}`,
        { credentials: "include" }
      );
  
      if (searchResponse.status === 401) {
        navigate("/login");
        return;
      }
  
      let resultIds, total;
      if (searchResponse.status === 200) {
        const searchData = await searchResponse.json();
        ({ resultIds, total } = searchData);
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
    </>
  );
}

export default Dashboard;
