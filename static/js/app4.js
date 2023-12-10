
var map = L.map('graph4', { minZoom: 3 }).setView([55, -115], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

var xhr = new XMLHttpRequest();
xhr.open('GET', '/api/province_data', true);
xhr.onload = function () {
  if (xhr.status === 200) {
    var data = JSON.parse(xhr.responseText);
    createInteractiveMap(data);
  } else {
    console.error('Failed to fetch data. Status:', xhr.status);
  }
};
xhr.send();

function createInteractiveMap(data) {
  const uniqueYears = [...new Set(data.map(item => item.Year))];
  const yearDropdown = document.getElementById('yearDropdown');

  uniqueYears.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.text = year;
    yearDropdown.appendChild(option);
  });

  yearDropdown.addEventListener('change', function () {
    const selectedYear = parseInt(this.value);
    updateMapMarkers(data, selectedYear);
  });

  updateMapMarkers(data, uniqueYears[0]);
}

function updateMapMarkers(data, selectedYear) {
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });

  const filteredData = data.filter(item => item.Year === selectedYear);

  filteredData.forEach(location => {
    const marker = L.marker([location.Latitude, location.Longitude]).addTo(map);

    const popupContent = `<strong>${location["Provinces/Territories"]}</strong><br>
                          Hospital Count: ${location.Hospital_count}<br>
                          Suicides: ${location.Number_of_suicides}<br>
                          Suicides per 100K: ${location.Number_of_suicides_per_100K}`;

    marker.bindPopup(popupContent);
  });
}