document.addEventListener("DOMContentLoaded", () => {
    google.charts.load("current", { packages: ["corechart"] });
});

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
        valueInput.oninput = checkTotalValue; // Add event listener to check total value dynamically

        // Append elements to the container
        sectorInputs.appendChild(nameLabel);
        sectorInputs.appendChild(nameInput);
        sectorInputs.appendChild(valueLabel);
        sectorInputs.appendChild(valueInput);
    }

    // Create div for "Others" input, initially hidden
    let othersContainer = document.createElement("div");
    othersContainer.id = "othersContainer";
    othersContainer.style.display = "none";

    let othersLabel = document.createElement("label");
    othersLabel.textContent = "Name for Remaining Category:";
    othersLabel.setAttribute("for", "othersName");

    let othersInput = document.createElement("input");
    othersInput.type = "text";
    othersInput.id = "othersName";
    othersInput.placeholder = "Enter name for remaining category";

    othersContainer.appendChild(othersLabel);
    othersContainer.appendChild(othersInput);
    sectorInputs.appendChild(othersContainer);
}

// Function to check total value and show/hide "Others" field
function checkTotalValue() {
    let numSectors = document.getElementById("numSectors").value;
    let totalValue = 0;
    
    for (let i = 1; i <= numSectors; i++) {
        totalValue += parseFloat(document.getElementById(`sector${i}`).value) || 0;
    }

    let othersContainer = document.getElementById("othersContainer");
    if (totalValue >= 100) {
        othersContainer.style.display = "none"; // Hide if total is 100 or more
    } else {
        othersContainer.style.display = "block"; // Show if total is less than 100
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
    let othersContainer = document.getElementById("othersContainer");

    let data = [["Sector", "Value"]];
    let totalValue = 0;

    for (let i = 1; i <= numSectors; i++) {
        let sectorName = document.getElementById(`sectorName${i}`).value || `Sector ${i}`;
        let sectorValue = parseFloat(document.getElementById(`sector${i}`).value) || 0;

        if (sectorValue < 0) {
            alert("Values for sectors must be non-negative.");
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

        // If total value is less than 100, add user-defined "Others" category
        if (totalValue < 100 && othersContainer.style.display !== "none") {
            let othersName = document.getElementById("othersName").value || "Others"; // Default name
            let remaining = 100 - totalValue;
            data.push([othersName, remaining]);
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

