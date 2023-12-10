// Function to display a Leaflet map
function chart3() {
    // Create a map centered at a specific location
    var map = L.map('graph3').setView([55, -115], 5);

    // Add a tile layer to the map (using OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Fetch data from suicides_data.csv
    d3.csv('/Project-3/Resources/suicides_data.csv').then(function (suicidesData) {
        // Fetch data from world_country_latitude_and_longitude.csv
        d3.csv('/Project-3/Resources/world_country_latitude_and_longitude.csv').then(function (geoData) {
            // Merge data based on country code or name
            var mergedData = mergeData(suicidesData, geoData);

            console.log('Merged Data:', mergedData);
            console.log('Number of Records after Merge:', mergedData.length);

            // Extract unique years from the dataset
            var uniqueYears = [...new Set(mergedData.map(data => data.year))];

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

                // Filter the merged data based on the selected year
                var filteredData = mergedData.filter(data => data.year === selectedYear);

                // Clear the existing markers on the map
                map.eachLayer(function (layer) {
                    if (layer instanceof L.Circle) {
                        map.removeLayer(layer);
                    }
                });

                // Loop through the filtered data and add circles to the map
                filteredData.forEach(function (data) {
                    var color = getColorBasedOnSuicides(data['suicides/100k pop']);

                    var circle = L.circle([data.latitude, data.longitude], {
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.7,
                        radius: calculateCircleRadius(data['suicides/100k pop'])
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
    });
}

// Function to merge data based on country code or name
function mergeData(suicidesData, geoData) {
    return suicidesData.map(function (suicide) {
        var matchingGeoData = geoData.find(function (geo) {
            return geo.country === suicide.country;
        });

        return { ...suicide, ...matchingGeoData };
    });
}

// Function to calculate circle radius based on the number of suicides per 100K
function calculateCircleRadius(suicidesPer100k) {
    // Adjust the multiplier as needed to control the circle size
    return Math.sqrt(suicidesPer100k) * 50000;
}

// Function to determine circle color based on the number of suicides per 100K
function getColorBasedOnSuicides(suicidesPer100k) {
    if (suicidesPer100k < 5) {
        return 'green';
    } else if (suicidesPer100k < 10) {
        return 'yellow';
    } else {
        return 'red';
    }
}

// Call the function to initialize the map when the page loads
document.addEventListener('DOMContentLoaded', function () {
    chart3();
});
