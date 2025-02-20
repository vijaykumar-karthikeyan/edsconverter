import { useState } from 'react';

// Functional component that creates a grid of clickable wells
export default function WellPlate({ rows = 8, cols = 12 }) {
  // State to track selected wells using a Set for efficient lookups
  const [selectedWells, setSelectedWells] = useState(new Set());

  // Handle well click events
  const handleWellClick = (wellId) => {
    setSelectedWells(prev => {
      const newSelection = new Set(prev);
      // Toggle selection state
      newSelection.has(wellId) ? newSelection.delete(wellId) : newSelection.add(wellId);
      return newSelection;
    });
  };

  // Generate the grid of wells
  const generateWells = () => {
    const wells = [];
    // Create rows and columns
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Create well ID (e.g., "A1", "B2")
        const wellId = `${String.fromCharCode(65 + row)}${col + 1}`;
        wells.push(
          <div
            key={wellId}
            className={`well ${selectedWells.has(wellId) ? 'selected' : ''}`}
            onClick={() => handleWellClick(wellId)}
          >
            {wellId}
          </div>
        );
      }
    }
    return wells;
  };

  return (
    <div 
      className="grid-container"
      // Dynamic grid layout based on column count
      style={{ gridTemplateColumns: `repeat(${cols}, 35px)` }}
    >
      {generateWells()}
    </div>
  );
}