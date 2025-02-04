document.addEventListener("DOMContentLoaded", () => {
    google.charts.load('current', {'packages':['corechart']});
});
function generateChart() {
    google.charts.setOnLoadCallback(drawChart);
}
function drawChart() {
    let chartTitle = document.getElementById("chartTitle").value;
    let sector1 = parseFloat(document.getElementById("sector1").value) || 0;
    let sector2 = parseFloat(document.getElementById("sector2").value) || 0;
    let chartType = document.getElementById("chartType").value;
    
    if (chartType === "pie") {
        if (sector1 < 0 || sector2 < 0) {
            alert("Values for sectors must be non-negative.");
            return;
        }
        let total = sector1 + sector2;
        if (total > 100) {
            alert("The total value of all sectors cannot exceed 100%.");
            return;
        }
        let data = [['Category', 'Value']];
        if (sector1 > 0) data.push([`Sector 1 (${sector1}%)`, sector1]);
        if (sector2 > 0) data.push([`Sector 2 (${sector2}%)`, sector2]);
        if (total < 100) {
            let others = 100 - total;
            data.push([`Others (${others}%)`, others]);
        }
        
        var options = { title: chartTitle };
        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(google.visualization.arrayToDataTable(data), options);
    } else {
        var data = google.visualization.arrayToDataTable([
            ['Category', 'Value'],
            ['Sector 1', sector1],
            ['Sector 2', sector2]
        ]);
        
        var options = { title: chartTitle };
        var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }
}
