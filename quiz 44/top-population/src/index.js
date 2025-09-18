import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const City = ({ name, population }) => {
  return <li title={`Population: ${population}`}>{name}</li>;
};

const App = () => {
  const cities = [
    { name: "Tokyo", population: "37,468,000" },
    { name: "Delhi", population: "28,514,000" },
    { name: "Shanghai", population: "25,582,000" },
    { name: "São Paulo", population: "21,650,000" },
    { name: "Mexico City", population: "21,581,000" },
  ];

  return (
    <div>
      <h1>Top 5 most populous cities</h1>
      <ul>
        {cities.map((city, index) => (
          <City key={index} name={city.name} population={city.population} />
        ))}
      </ul>
    </div>
  );
};

export default App;
