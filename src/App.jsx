import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import WellPlate from './components/WellPlate';
import './styles/app.css';

const App = () => {
  const [file, setFile] = useState(null);
  const [selectedWells, setSelectedWells] = useState(new Set());
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.endsWith('.eds')) {
      alert('Only .EDS files are allowed!');
      return;
    }

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 100);

    // Store file in localStorage
    const reader = new FileReader();
    reader.onload = (e) => {
      localStorage.setItem('edsFile', e.target.result);
      setFile(uploadedFile);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 2000);
    };
    reader.readAsText(uploadedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.eds',
    multiple: false,
    noClick: false, // Allow clicking to upload file
  });

  const handleRemoveFile = () => {
    localStorage.removeItem('edsFile');
    setFile(null);
    setSelectedWells(new Set());
  };

  return (
    <div className="app-container">
      <h1 className="title">Kinetic Data Analyzer</h1>

      <div
        {...getRootProps()}
        className={`file-upload-section ${isDragActive ? 'dragover' : ''} ${file ? 'has-file' : ''}`}
      >
        <input {...getInputProps()} ref={fileInputRef} />

        {!file ? (
          <>
            <div className="custom-file-input">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Select EDS File
            </div>
            <p className="file-instructions">or drag and drop here</p>
          </>
        ) : (
          <div className="selected-file">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#4dabf7" stroke="currentColor">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>{file.name}</span>
            <button className="remove-file" onClick={handleRemoveFile}>
              &times;
            </button>
          </div>
        )}

        {uploadProgress > 0 && (
          <div className="upload-status">
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span>Uploading... {uploadProgress}%</span>
          </div>
        )}
      </div>

      <div className="wellplate-wrapper">
        <WellPlate
          rows={16}
          cols={24}
          selectedWells={selectedWells}
          setSelectedWells={setSelectedWells}
        />
      </div>
    </div>
  );
};

export default App;
