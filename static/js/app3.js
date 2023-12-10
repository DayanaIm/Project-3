// Function to display a Leaflet map
function chart3() {
    // Create a map centered at a specific location
    var map = L.map('graph3', {
        center: [0, 0], // Centered at the world map
        zoom: 3, // Initial zoom level
        minZoom: 3, // Minimum zoom level
        maxZoom: 4 // Maximum zoom level
    });

    // Add a tile layer to the map (using OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Fetch data from chart3data.csv
    d3.csv('/Project-3/Resources/chart3data.csv').then(function (chartData) {
        console.log('Data:', chartData);
        console.log('Number of Records:', chartData.length);

        // Extract unique years from the dataset
        var uniqueYears = [...new Set(chartData.map(data => data.year))];

        // Populate the dropdown with the unique years
        var yearDropdown = document.getElementById('yearDropdown');
        uniqueYears.forEach(function (year) {
            var option = document.createElement('option');
            option.value = year;
            option.text = year;
            yearDropdown.add(option);
        });

        // Set up an event listener for the dropdown change event
        yearDropdown.addEventListener('change', function () {
            // Get the selected year from the dropdown
            var selectedYear = yearDropdown.value;

            // Filter the data based on the selected year
            var filteredData = chartData.filter(data => data.year === selectedYear);

            // Clear the existing markers on the map
            map.eachLayer(function (layer) {
                if (layer instanceof L.Circle) {
                    map.removeLayer(layer);
                }
            });

            // Loop through the filtered data and add circles to the map
            filteredData.forEach(function (data) {
                var color = getColorBasedOnSuicides(data['suicides/100k pop']);

                // Fixed radius for all circles
                var circle = L.circle([data.latitude, data.longitude], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.7,
                    radius: 120000 // Fixed radius value
                });

                // Add popup with information
                circle.bindPopup(`<b>${data.country}</b><br> Suicides/100K: ${data['suicides/100k pop']}`);

                // Add the circle marker to the map
                map.addLayer(circle);
            });
        });

        // Initial rendering based on the first year in the dataset
        var initialYear = uniqueYears[0];
        yearDropdown.value = initialYear;
        yearDropdown.dispatchEvent(new Event('change'));
    });
}

// Function to determine circle color based on the number of suicides per 100K
function getColorBasedOnSuicides(suicidesPer100k) {
    if (suicidesPer100k < 50) {
        return 'green';
    } else if (suicidesPer100k < 75) {
        return 'yellow';
    } else {
        return 'red';
    }
}

// Call the function to initialize the map when the page loads
document.addEventListener('DOMContentLoaded', function () {
    chart3();
});
