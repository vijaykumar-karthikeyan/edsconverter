import React, { useState } from 'react';
import WellPlate from './components/WellPlate';
import './styles/app.css';

const App = () => {
  const [fileName, setFileName] = useState('');
  const [selectedWells, setSelectedWells] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.endsWith('.eds')) {
      alert('Only .EDS files are allowed!');
      return;
    }
    setFileName(file ? file.name : '');
  };

  const handleProcessData = async () => {
    if (!fileName) {
      alert('Please upload a file first!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', document.getElementById('fileInput').files[0]);
      formData.append('selectedWells', JSON.stringify(selectedWells));

      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      alert(result.success ? 'File processed successfully!' : 'Error processing file.');
    } catch (error) {
      alert('An error occurred while processing.');
    }
  };

  return (
    <div className="container">
      <h1>Kinetic Data Processing</h1>

      <div className="upload-section">
        <p>{fileName || 'Drag or Upload Your EDS File'}</p>
        <label className="upload-button">
          Upload
          <input type="file" id="fileInput" accept=".eds" hidden onChange={handleFileChange} />
        </label>
      </div>

      <WellPlate selectedWells={selectedWells} setSelectedWells={setSelectedWells} />

      <button className="process-button" onClick={handleProcessData}>
        Process Data
      </button>
    </div>
  );
};

export default App;