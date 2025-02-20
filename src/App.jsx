import React, { useState } from 'react';

const App = () => {
  const [fileName, setFileName] = useState('');
  const [selectedWells, setSelectedWells] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  const handleWellClick = (well) => {
    setSelectedWells((prevSelected) => {
      if (prevSelected.includes(well)) {
        return prevSelected.filter((selected) => selected !== well);
      } else {
        return [...prevSelected, well];
      }
    });
  };

  const handleProcessData = async () => {
    if (!fileName) {
      alert('Please upload a file first!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', fileInput.files[0]);
      formData.append('selectedWells', JSON.stringify(selectedWells));

      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        alert('File processed successfully!');
      } else {
        alert('Error processing file.');
      }
    } catch (error) {
      alert('An error occurred while processing.');
    }
  };

  const createWells = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];  // 16 rows
    const wells = [];

    for (const row of rows) {
      for (let i = 1; i <= 24; i++) {
        const well = `${row}${i}`;
        wells.push(
          <div
            key={well}
            className={`well ${selectedWells.includes(well) ? 'selected' : ''}`}
            onClick={() => handleWellClick(well)}
          >
            <span className="well-label">{well}</span>
          </div>
        );
      }
    }

    return wells;
  };

  return (
    <div className="container">
      <h1>EDS Converter</h1>

      <div className="upload-section">
        <p>{fileName || 'Drag or Upload Your EDS or CSV File'}</p>
        <label className="upload-button">
          Upload
          <input
            type="file"
            id="fileInput"
            accept=".eds,.csv,text/csv"
            hidden
            onChange={handleFileChange}
          />
        </label>
      </div>

      <div className="wells-section">
        <h3>Choose Wells</h3>
        <div className="plate-container">
          <div className="wells-grid">
            {createWells()}
          </div>
        </div>
      </div>

      <button className="process-button" onClick={handleProcessData}>
        Process Data
      </button>
    </div>
  );
};

export default App;