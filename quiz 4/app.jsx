import React from "react";

const City = ({ name, population }) => {
  return (
    <span
      style={{
        fontSize: "18px",
        display: "block",
        marginBottom: "10px",
        position: "relative",
        cursor: "pointer",
      }}
      title={`Population: ${population}`}
    >
      {name}
    </span>
  );
};

const App = () => {
  const cities = [
    { name: "Tokyo", population: "37,468,000" },
    { name: "Delhi", population: "28,541,000" },
    { name: "Shanghai", population: "25,582,000" },
    { name: "São Paulo", population: "21,650,000" },
    { name: "Mexico City", population: "21,581,000" },
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Top 5 most populous cities</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {cities.map((city, index) => (
          <li key={index}>
            <City name={city.name} population={city.population} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
