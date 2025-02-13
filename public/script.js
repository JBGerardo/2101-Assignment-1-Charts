document.addEventListener("DOMContentLoaded", () => {
    google.charts.load("current", { packages: ["corechart"] });
    document.getElementById("chartType").addEventListener("change", () => {
        toggleGridlineInput();
        toggleOthersLabelInput();
    });
    toggleOthersLabelInput(); // Ensure it runs on page load
});

// Function to toggle the rename 'Others' input field based on chart type selection
function toggleOthersLabelInput() {
    let chartType = document.getElementById("chartType").value;
    let othersLabelDiv = document.getElementById("othersLabelDiv");
    if (chartType === "pie") {
        othersLabelDiv.style.display = "block";
    } else {
        othersLabelDiv.style.display = "none";
    }
}

// Function to generate input fields based on the selected number of sectors
function generateInputs() {
    let numSectors = document.getElementById("numSectors").value;
    let sectorInputs = document.getElementById("sectorInputs");

    // Clear previous inputs
    sectorInputs.innerHTML = "";

    for (let i = 1; i <= numSectors; i++) {
        let nameLabel = document.createElement("label");
        nameLabel.textContent = `Sector ${i} Name:`;
        nameLabel.setAttribute("for", `sectorName${i}`);

        let nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.id = `sectorName${i}`;
        nameInput.placeholder = `Enter name for Sector ${i}`;

        let valueLabel = document.createElement("label");
        valueLabel.textContent = `Sector ${i} Value:`;
        valueLabel.setAttribute("for", `sector${i}`);

        let valueInput = document.createElement("input");
        valueInput.type = "number";
        valueInput.id = `sector${i}`;
        valueInput.placeholder = `Enter value for Sector ${i}`;
        valueInput.min = "0";

        sectorInputs.appendChild(nameLabel);
        sectorInputs.appendChild(nameInput);
        sectorInputs.appendChild(valueLabel);
        sectorInputs.appendChild(valueInput);
    }
}

// Function to generate the chart
function generateChart() {
    google.charts.setOnLoadCallback(drawChart);
}

// Function to draw the chart
function drawChart() {
    let chartTitle = document.getElementById("chartTitle").value || "Generated Chart";
    let chartType = document.getElementById("chartType").value;
    let numSectors = document.getElementById("numSectors").value;
    
    let data = [["Sector", "Value"]];
    let totalValue = 0;
    
    let gridInterval = 50;
    if (chartType === "bar") {
        gridInterval = parseInt(document.getElementById("gridInterval").value) || 50;
    }

    for (let i = 1; i <= numSectors; i++) {
        let sectorName = document.getElementById(`sectorName${i}`).value || `Sector ${i}`;
        let sectorValue = parseFloat(document.getElementById(`sector${i}`).value) || 0;
        
        if (chartType === "bar" && (sectorValue < 0 || sectorValue > 400)) {
            alert("Bar values must be between 0 and 400.");
            return; 
        }

        totalValue += sectorValue;
        data.push([sectorName, sectorValue]);
    }

    if (chartType === "pie") {
        if (totalValue > 100) {
            alert("The total value of all sectors cannot exceed 100%.");
            return;
        }

        if (totalValue < 100) {
            let remaining = 100 - totalValue;
            let othersLabel = document.getElementById("othersLabelInput") ? document.getElementById("othersLabelInput").value : "Others";
            data.push([othersLabel || "Others", remaining]);
        }

        let options = {
            title: chartTitle,
            width: 500,
            height: 400,
            pieHole: 0.3,
        };

        let chart = new google.visualization.PieChart(document.getElementById("chart_div"));
        chart.draw(google.visualization.arrayToDataTable(data), options);
    } else {
        let options = {
            title: chartTitle,
            width: 500,
            height: 400,
            hAxis: { title: "Categories" },
            vAxis: {
                title: "Values",
                gridlines: { interval: gridInterval }
            },
            bars: "vertical",
        };

        let chart = new google.visualization.BarChart(document.getElementById("chart_div"));
        chart.draw(google.visualization.arrayToDataTable(data), options);
    }
}