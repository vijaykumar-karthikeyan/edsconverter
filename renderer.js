document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const wellContainer = document.getElementById("wellContainer");

    // File upload restriction
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file && !file.name.endsWith(".eds")) {
            alert("Only .EDS files are allowed!");
            fileInput.value = "";
        }
    });

    const rows = 8;
    const cols = 12;
    wellContainer.style.gridTemplateColumns = `repeat(${cols}, 35px)`;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const well = document.createElement("div");
            well.classList.add("well");
            well.textContent = `${String.fromCharCode(65 + row)}${col + 1}`;
            well.addEventListener("click", () => {
                well.classList.toggle("selected");
            });
            wellContainer.appendChild(well);
        }
    }
});