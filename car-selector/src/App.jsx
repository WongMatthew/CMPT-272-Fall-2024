import React, { useState } from "react";
import "./App.css";
import Empty from "./Empty.png";
import BMW from "./bmw.png";
import Mercedes from "./merc.png";
import Audi from "./audi.png";
const App = () => {
  const [selectedCar, setCar] = useState("Empty");
  const [imageSrc, setImage] = useState(Empty);
  const changeCar = (event) => {
    setCar(event.target.value);
  };
  const switchButton = () => {
    switch (selectedCar) {
      case "BMW":
        setImage(BMW);
        break;
      case "Mercedes":
        setImage(Mercedes);
        break;
      case "Audi":
        setImage(Audi);
        break;
      default:
        setImage(Empty);
        break;
    }
  };
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {" "}
      <h1>Car Selector</h1>{" "}
      <select value={selectedCar} onChange={changeCar}>
        {" "}
        <option value="Empty">-- Select a Car --</option>{" "}
        <option value="BMW">BMW</option>{" "}
        <option value="Mercedes">Mercedes</option>{" "}
        <option value="Audi">Audi</option>{" "}
      </select>{" "}
      <button onClick={switchButton} style={{ marginLeft: "10px" }}>
        {" "}
        Show Car{" "}
      </button>{" "}
      <div style={{ marginTop: "20px" }}>
        {" "}
        <img
          src={imageSrc}
          alt={selectedCar}
          style={{ width: "320px", height: "240px" }}
        />{" "}
      </div>{" "}
    </div>
  );
};
export default App;
