function createInteractiveMap(data) {
    var map = L.map('graph4',
    {minZoom:3}
    ).setView([55, -115], 5);
        

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    data.forEach(function (location) {
        var marker = L.marker([location.Latitude, location.Longitude]).addTo(map);

        var popupContent = `<strong>${location["Provinces/Territories"]}</strong><br>
                            Hospital Count: ${location.Hospital_count}<br>
                            Suicides: ${location.Number_of_suicides}<br>
                            Suicides per 100K: ${location.Number_of_suicides_per_100K}`;

        marker.bindPopup(popupContent);
    });
}

var xhr = new XMLHttpRequest();
xhr.open('GET', '/api/province_data', true);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var data = JSON.parse(xhr.responseText);
        createInteractiveMap(data);
    }
};
xhr.send();