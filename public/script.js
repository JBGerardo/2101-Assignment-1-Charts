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
        let label = document.createElement("label");
        label.textContent = `Sector ${i}:`;
        label.setAttribute("for", `sector${i}`);

        let input = document.createElement("input");
        input.type = "number";
        input.id = `sector${i}`;
        input.placeholder = `Enter value for Sector ${i}`;
        input.min = "0";

        sectorInputs.appendChild(label);
        sectorInputs.appendChild(input);
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
    
    let data = [["Category", "Value"]];
    let totalValue = 0;
    
    for (let i = 1; i <= numSectors; i++) {
        let sectorValue = parseFloat(document.getElementById(`sector${i}`).value) || 0;
        
        if (sectorValue < 0) {
            alert("Values for sectors must be non-negative.");
            return;
        }
        
        totalValue += sectorValue;
        data.push([`Sector ${i}`, sectorValue]);
    }

    if (chartType === "pie") {
        if (totalValue > 100) {
            alert("The total value of all sectors cannot exceed 100%.");
            return;
        }

        // Add remaining "Others" sector if total is less than 100
        if (totalValue < 100) {
            let remaining = 100 - totalValue;
            data.push([`Others (${remaining}%)`, remaining]);
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
            vAxis: { title: "Values" },
            bars: "vertical",
        };

        let chart = new google.visualization.BarChart(document.getElementById("chart_div"));
        chart.draw(google.visualization.arrayToDataTable(data), options);
    }
}
