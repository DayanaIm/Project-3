// Create a Leaflet map
var map = L.map('graph3', { minZoom: 3 }).setView([20, 0], 2);

// Add OpenStreetMap tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Define custom icons
var greenIcon = L.icon({
  iconUrl: 'green-icon.png',
  iconSize: [25, 25], // Adjust the size as needed
});

var yellowIcon = L.icon({
  iconUrl: 'yellow-icon.png',
  iconSize: [25, 25],
});

var redIcon = L.icon({
  iconUrl: 'red-icon.png',
  iconSize: [25, 25],
});

// Legend
var legend = L.control({ position: 'topright' });

legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.style.backgroundColor = 'rgba(115, 108, 237, 0.6)';  // Set the background color to more translucent #736CED
  div.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';  // Add a shadow with a transparency level
  div.innerHTML +=
    '<strong>Markers</strong><br>' +
    '<img src="green-icon.png"> <span>Less than 50 Suicides per 100K</span><br>' +
    '<img src="yellow-icon.png"> <span>50 to 75 Suicides per 100K</span><br>' +
    '<img src="red-icon.png"> <span>More than 75 Suicides per 100K</span>';
  return div;
};

legend.addTo(map);

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
    // Choose the icon based on the number of suicides
    let icon;
    if (location.Number_of_suicides_per_100K < 50) {
      icon = greenIcon;
    } else if (location.Number_of_suicides_per_100K >= 50 && location.Number_of_suicides_per_100K < 75) {
      icon = yellowIcon;
    } else {
      icon = redIcon;
    }

    const marker = L.marker([location.latitude, location.longitude], { icon: icon }).addTo(map);

    // Define popup content for each marker
    const popupContent = `<strong>${location["country"]}</strong><br>
                          Year: ${location.year}<br>
                          GDP per capita: ${location.gdp_per_capita}<br>
                          Suicides per 100K: ${location.Number_of_suicides_per_100K}`;

    marker.bindPopup(popupContent);
  });
}
