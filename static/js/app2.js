// Function to display a Leaflet map
function chart4() {
    // Create a map centered at a specific location
    var map = L.map('graph4').setView([55, -115], 5);

    // Add a tile layer to the map (using OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // // Add a marker to the map at a specific location
    // L.marker([markerLatitude, markerLongitude]).addTo(map)
    //     .bindPopup('Your Marker Here'); // You can customize the popup content
}

// Call the function to initialize the map when the page loads
document.addEventListener('DOMContentLoaded', function () {
    chart4();
});