// Function to display a Leaflet map with markers
function chart3(data) {
    // Create a map centered at a specific location
    var map = L.map('graph3').setView([20, 0], 2);

    // Add a tile layer to the map (using OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create a marker cluster group for better performance
    var markers = L.markerClusterGroup();

    // Extract unique years from the data for dropdown options
    var uniqueYears = [...new Set(data.map(item => item.year))];

    // Add a dropdown for selecting the year
    var yearDropdown = L.DomUtil.create('select', 'year-dropdown');
    yearDropdown.innerHTML = '<option value="">Select Year</option>';
    uniqueYears.forEach(year => {
        var option = L.DomUtil.create('option');
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    });

    // Add the dropdown to the map
    yearDropdown.onchange = function () {
        var selectedYear = this.value;
        updateMarkers(selectedYear);
    };
    map.getContainer().appendChild(yearDropdown);

    // Function to update markers based on the selected year
    function updateMarkers(selectedYear) {
        markers.clearLayers();

        data
            .filter(item => selectedYear === '' || item.year === selectedYear)
            .forEach(item => {
                // Set marker color based on the range of suicides per 100K
                var markerColor = item['suicides/100k pop'] > 15 ? 'red' :
                                  item['suicides/100k pop'] > 10 ? 'yellow' :
                                  'green';

                // Create a marker with a popup
                var marker = L.circleMarker([item.latitude, item.longitude], {
                    color: 'black',
                    fillColor: markerColor,
                    fillOpacity: 0.7,
                    radius: 10
                }).bindPopup(`
                    <b>${item.country}</b><br>
                    Year: ${item.year}<br>
                    Suicides/100K: ${item['suicides/100k pop']}<br>
                    GDP per Capita: ${item.gdp_per_capita}
                `);

                markers.addLayer(marker);
            });

        map.addLayer(markers);
    }

    // Call the function initially to display all markers
    updateMarkers('');
}

// Fetch data from the API endpoint
fetch('/api/chart3data')
    .then(response => response.json())
    .then(data => {
        // Call the function to initialize the map with the fetched data
        chart3(data);
    });
