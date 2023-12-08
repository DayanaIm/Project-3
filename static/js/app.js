//--------------//
// First Visual //
//--------------//

//---------------------------------------------------------
// // Fetch data from Flask API and create a dropdown
//---------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    
    fetch('/api/suicides_data')
        .then(response => response.json())
        .then(data => {
            const countries = Array.from(new Set(data.map(item => item.country)));

            // Create a dropdown for the country filter
            const countryDropdown = document.createElement('select');
            countryDropdown.id = 'countryDropdown';
            countryDropdown.addEventListener('change', updateChart);

            // Populate the dropdown with country options
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.text = country;
                countryDropdown.add(option);
            });

            document.getElementById('graph1').appendChild(countryDropdown);

            // Initial rendering of the chart with all data
            renderChart(data);
        })
        .catch(error => console.error('Error fetching data:', error));
});

//---------------------------------------------------------
// Fetch data from Flask API based on the selected country
//---------------------------------------------------------
function updateChart() {
    const selectedCountry = document.getElementById('countryDropdown').value;

    fetch(`/api/suicides_data?country=${selectedCountry}`)
        .then(response => response.json())
        .then(data => {
            // Destroy existing chart if any
            if (chart) {
                chart.destroy();
            }

            // Render the new chart
            renderChart(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

//---------------------------------------------------------
// Render the chart
//---------------------------------------------------------

function renderChart(data) {
    const selectedCountry = document.getElementById('countryDropdown').value;

    // Filter data for the selected country
    const filteredData = data.filter(item => item.country === selectedCountry);

    // Extract unique years for the selected country
    const years = Array.from(new Set(filteredData.map(item => item.year)));

    // Prepare data for the chart
    const chartData = [];
    const ageCategories = Array.from(new Set(filteredData.map(item => item.age)));

    ageCategories.forEach(age => {
        const seriesData = years.map(year => {
            const yearData = filteredData.find(item => item.year === year && item.age === age);
            return yearData ? yearData['suicides/100k pop'] : 0;
        });

        chartData.push({
            name: age,
            data: seriesData
        });
    });

    // Create the chart
    const options = {
        series: chartData,
        chart: {
            type: 'bar',  
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 10,
            
            },
        },
        xaxis: {
            categories: years,
            labels: {
                rotate: -45
              },
        },
        legend: {
            position: 'top',
            offsetY: 0
        },
        fill: {
            opacity: 1.5


        }
    };

    chart = new ApexCharts(document.querySelector("#chart1"), options);
    chart.render();
}



//--------------//
// Second Visual//
//--------------//

document.addEventListener("DOMContentLoaded", function () {

    let chart2;

    fetch('/api/suicides_data')
        .then(response => response.json())
        .then(data => {
            const countries = Array.from(new Set(data.map(item => item.country)));
            const years = Array.from(new Set(data.map(item => item.year)));

            // Create a dropdown for the country filter
            const countryDropdown = createDropdown('countryDropdown', countries, updateChart);

            // Create a dropdown for the year filter
            const yearDropdown = createDropdown('yearDropdown', years, updateChart);

            document.getElementById('graph2').appendChild(countryDropdown);
            document.getElementById('graph2').appendChild(yearDropdown);

            // Initial rendering of the chart with all data
            renderChart2(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    //---------------------------------------------------------
    // Fetch data from Flask API based on the selected country
    //---------------------------------------------------------
    function updateChart() {
        const selectedCountry = document.getElementById('countryDropdown').value;
        const selectedYear = document.getElementById('yearDropdown').value;

        fetch(`/api/suicides_data?country=${selectedCountry}&year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                // Destroy existing chart if any
                if (chart2) {
                    chart2.destroy();
                }

                // Render the new chart
                renderChart2(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    //---------------------------------------------------------
    // Render a pie chart with total "suicides_no" for male and female
    //---------------------------------------------------------
    function renderChart2(data) {
        const maleData = data.filter(item => item.sex === 'male');
        const femaleData = data.filter(item => item.sex === 'female');

        const maleSuicides = maleData.reduce((total, item) => total + item.suicides_no, 0);
        const femaleSuicides = femaleData.reduce((total, item) => total + item.suicides_no, 0);

        const ctx = document.getElementById('chart2').getContext('2d');
        chart2 = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Male', 'Female'],
                datasets: [{
                    data: [maleSuicides, femaleSuicides],
                    backgroundColor: ['blue', 'pink'],
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Total Suicides by Gender'
                }
            }
        });
    }

    //---------------------------------------------------------
    // Helper function to create a dropdown
    //---------------------------------------------------------
    function createDropdown(id, options, onChange) {
        const dropdown = document.createElement('select');
        dropdown.id = id;
        dropdown.addEventListener('change', onChange);

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.text = option;
            dropdown.add(optionElement);
        });

        return dropdown;
    }
});