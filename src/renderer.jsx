import React, { useState } from "react";
import "./App.css"; // Make sure styles are defined here

const WellPlate = () => {
  const [selectedWells, setSelectedWells] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && !file.name.endsWith(".eds")) {
      alert("Only .EDS files are allowed!");
      event.target.value = "";
    } else if (file) {
      setFileName(file.name);
    }
  };

  const handleWellClick = (well) => {
    setSelectedWells((prevSelected) =>
      prevSelected.includes(well)
        ? prevSelected.filter((w) => w !== well) // Deselect
        : [...prevSelected, well] // Select
    );
  };

  const createWells = () => {
    const rows = 8;
    const cols = 12;
    const wells = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const well = `${String.fromCharCode(65 + row)}${col + 1}`;
        wells.push(
          <div
            key={well}
            className={`well ${selectedWells.includes(well) ? "selected" : ""}`}
            onClick={() => handleWellClick(well)}
          >
            {well}
          </div>
        );
      }
    }

    return wells;
  };

  return (
    <div className="container">
      <h1>EDS File Upload</h1>

      <div className="upload-section">
        <p>{fileName || "Drag or Upload Your EDS File"}</p>
        <label className="upload-button">
          Upload
          <input type="file" accept=".eds" hidden onChange={handleFileChange} />
        </label>
      </div>

      <div className="well-container">{createWells()}</div>
    </div>
  );
};

export default WellPlate;
