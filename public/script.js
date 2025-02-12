document.addEventListener("DOMContentLoaded", () => {
    google.charts.load("current", { packages: ["corechart"] });
});

// Function to generate input fields based on the selected number of sectors
function generateInputs() {
    let numSectors = document.getElementById("numSectors").value;
    let sectorInputs = document.getElementById("sectorInputs");

    // Clear previous inputs
    sectorInputs.innerHTML = "";

    for (let i = 1; i <= numSectors; i++) {
        // Create label for sector name
        let nameLabel = document.createElement("label");
        nameLabel.textContent = `Sector ${i} Name:`;
        nameLabel.setAttribute("for", `sectorName${i}`);

        // Create input for sector name
        let nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.id = `sectorName${i}`;
        nameInput.placeholder = `Enter name for Sector ${i}`;

        // Create label for sector value
        let valueLabel = document.createElement("label");
        valueLabel.textContent = `Sector ${i} Value:`;
        valueLabel.setAttribute("for", `sector${i}`);

        // Create input for sector value
        let valueInput = document.createElement("input");
        valueInput.type = "number";
        valueInput.id = `sector${i}`;
        valueInput.placeholder = `Enter value for Sector ${i}`;
        valueInput.min = "0";

        // Append elements to the container
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
    
    // Only get gridline interval if bar chart is selected
    let gridInterval = 50;
    if (chartType === "bar") {
        gridInterval = parseInt(document.getElementById("gridInterval").value) || 50;
    }

    for (let i = 1; i <= numSectors; i++) {
        let sectorName = document.getElementById(`sectorName${i}`).value || `Sector ${i}`;
        let sectorValue = parseFloat(document.getElementById(`sector${i}`).value) || 0;
        
        // ✅ Restrict bar chart values to max 400
        if (chartType === "bar" && (sectorValue < 0 || sectorValue > 400)) {
            alert("Bar values must be between 0 and 400.");
            return; // Stop execution if invalid input is found
        }

        totalValue += sectorValue;
        data.push([sectorName, sectorValue]);
    }

    if (chartType === "pie") {
        if (totalValue > 100) {
            alert("The total value of all sectors cannot exceed 100%.");
            return;
        }

        // Add remaining "Others" sector if total is less than 100
        if (totalValue < 100) {
            let remaining = 100 - totalValue;
            data.push(["Others", remaining]);
        }

        let options = {
            title: chartTitle,
            width: 500,
            height: 400,
            pieHole: 0.3, // Optional: for a donut chart effect
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
                gridlines: { interval: gridInterval } // ✅ Only applies to bar charts
            },
            bars: "vertical",
        };

        let chart = new google.visualization.BarChart(document.getElementById("chart_div"));
        chart.draw(google.visualization.arrayToDataTable(data), options);
    }
}
