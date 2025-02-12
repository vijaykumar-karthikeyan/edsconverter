let selectedColor = null;
let tags = [];
let wellTags = {};

function showProcessPage() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="process-page">
            <h2>Process Data</h2>
            <button class="upload-button" onclick="downloadProcessedData()">Download Processed Data</button>
            <button class="upload-button" onclick="showMainPage()">Back to Home</button>
        </div>
    `;
}

function showConfigureTags() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="configure-tags">
            <h2>Configure Tags</h2>
            <textarea class="excel-input" placeholder="Paste your tag names here (one per line)"></textarea>
            <div class="tag-colors"></div>
            <button class="upload-button" onclick="applyTags()">Apply Tags</button>
            <button class="upload-button" onclick="showMainPage()">Back to Home</button>
        </div>
    `;

    // Create color picker options
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', 
                   '#FFA500', '#800080', '#008000', '#FFC0CB', '#A52A2A', '#808080'];
    const tagColors = document.querySelector('.tag-colors');
    
    colors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.className = 'tag-color';
        colorDiv.style.backgroundColor = color;
        colorDiv.onclick = () => selectColor(color);
        tagColors.appendChild(colorDiv);
    });
}

function selectColor(color) {
    selectedColor = color;
    document.querySelectorAll('.tag-color').forEach(div => {
        div.classList.remove('selected');
        if (div.style.backgroundColor === color) {
            div.classList.add('selected');
        }
    });
}

function applyTags() {
    const input = document.querySelector('.excel-input').value;
    tags = input.split('\n').filter(tag => tag.trim());
    showMainPage();
}

function showMainPage() {
    // Restore the main page content
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="wells-section">
            <h3>Choose Wells</h3>
            <div class="tag-buttons">
                ${tags.map((tag, index) => `
                    <button class="tag-button" style="background-color: ${colors[index % colors.length]}"
                            onclick="selectTagForWells('${tag}', '${colors[index % colors.length]}')">
                        ${tag}
                    </button>
                `).join('')}
            </div>
            <div class="plate-container">
                <div class="row-labels"></div>
                <div class="wells-grid"></div>
            </div>
        </div>
    `;
    populateWellsGrid();
}

function selectTagForWells(tag, color) {
    selectedTag = { name: tag, color: color };
    // Enable well selection mode
    const wells = document.querySelectorAll('.well');
    wells.forEach(well => {
        well.addEventListener('mousedown', startWellSelection);
        well.addEventListener('mouseover', continueWellSelection);
    });
    document.addEventListener('mouseup', endWellSelection);
}

let isSelecting = false;
let selectedWells = new Set();

function startWellSelection(e) {
    isSelecting = true;
    selectedWells.clear();
    const well = e.target;
    selectedWells.add(well);
    well.style.backgroundColor = selectedTag.color;
    wellTags[well.dataset.position] = selectedTag;
}

function continueWellSelection(e) {
    if (!isSelecting) return;
    const well = e.target;
    selectedWells.add(well);
    well.style.backgroundColor = selectedTag.color;
    wellTags[well.dataset.position] = selectedTag;
}

function endWellSelection() {
    isSelecting = false;
}

function downloadProcessedData() {
    // Create CSV content based on well tags
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Get all tagged positions
    const positions = Object.keys(wellTags).sort((a, b) => {
        const [rowA, colA] = a.split('-').map(Number);
        const [rowB, colB] = b.split('-').map(Number);
        return rowA === rowB ? colA - colB : rowA - rowB;
    });

    // Create headers
    csvContent += "Position,Tag\n";
    
    // Add data rows
    positions.forEach(pos => {
        csvContent += `${pos},${wellTags[pos].name}\n`;
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "processed_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
