// Create a Leaflet map
var map = L.map('graph3', { minZoom: 3 }).setView([20, 0], 2);

// Add OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Create a new XMLHttpRequest to fetch data from the server
var xhr = new XMLHttpRequest();
xhr.open('GET', '/api/chart3data', true);
xhr.onload = function () {
  if (xhr.status === 200) {
    var data = JSON.parse(xhr.responseText);
    createInteractiveMap(data);
  } else {
    console.error('Failed to fetch data. Status:', xhr.status);
  }
};
xhr.send();

// Function to create an interactive map based on the provided data
function createInteractiveMap(data) {
  const uniqueYears = [...new Set(data.map(item => item.year))];
  const yearDropdown3 = document.getElementById('yearDropdown3');


  // Populate the dropdown with options for each unique year
  uniqueYears.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.text = year;
    yearDropdown3.appendChild(option);
  });

// Add an event listener to the dropdown to update the map markers when the year changes
  yearDropdown3.addEventListener('change', function () {
    const selectedYear = parseInt(this.value);
    updateMapMarkers(data, selectedYear);
  });

  updateMapMarkers(data, uniqueYears[0]);
}

// Function to update map markers based on the selected year
function updateMapMarkers(data, selectedYear) {
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });
  
    // Filter data for the selected year
    const filteredData = data.filter(item => item.year === selectedYear);
  
    filteredData.forEach(location => {
      const marker = L.marker([location.latitude, location.longitude]).addTo(map);
  
       // Define popup content for each marker
      const popupContent = `<strong>${location["country"]}</strong><br>
                            Year: ${location.year}<br>
                            GDP per capita: ${location.gdp_per_capita}<br>
                            Suicides per 100K: ${location.Number_of_suicides_per_100K}`;
  
      marker.bindPopup(popupContent);
    });
  }