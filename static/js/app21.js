document.addEventListener("DOMContentLoaded", function() {
    let chart; // Chart variable to keep track of the chart instance

    // Fetch data from Flask API
    fetch('/api/pie_chart')
        .then(response => response.json())
        .then(data => {
            // Extract unique countries and years
            const countries = [...new Set(data.map(item => item.country))];
            const years = [...new Set(data.map(item => item.year))];

            // Create dropdowns for country and year
            createDropdown('countryDropdown', countries, updateChart, 'graph2');
            createDropdown('yearDropdown', years, updateChart, 'graph2');

            // Initial rendering of the chart with all data
            renderChart(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    // Fetch data based on selected country and year
    function updateChart() {
        console.log('Updating chart...');
        const selectedCountry = document.getElementById('countryDropdown').value;
        const selectedYear = document.getElementById('yearDropdown').value;

        fetch(`/api/pie_chart?country=${selectedCountry}&year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    renderChart(data);
                } else {
                    console.error('No data available for the selected filters.');
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Render a pie chart with total for male and female
    function renderChart(data) {
        console.log('Received data:', data);

        const filteredData = data.filter(item =>
            typeof item.male_suicides === 'number' && !isNaN(item.male_suicides) &&
            typeof item.female_suicides === 'number' && !isNaN(item.female_suicides)
        );

        console.log('Filtered data:', filteredData);

        const selectedCountry = document.getElementById('countryDropdown').value;
        const selectedYear = document.getElementById('yearDropdown').value;

        const countryYearData = filteredData.filter(item => item.country === selectedCountry && item.year === parseInt(selectedYear, 10));

        if (countryYearData.length > 0) {
            const maleSuicides = countryYearData.map(item => item.male_suicides);
            const femaleSuicides = countryYearData.map(item => item.female_suicides);

            const options = {
                series: [...maleSuicides, ...femaleSuicides],
                chart: {
                    width: 500, // Increase the width
                    type: 'pie',
                },
                labels: ['Male Suicides', 'Female Suicides'],
                legend: {
                    position: 'bottom',
                    fontSize: '14px',
                },
                responsive: [
                    {
                        breakpoint: 768,
                        options: {
                            chart: {
                                width: 400,
                            },
                            legend: {
                                position: 'right',
                            },
                        },
                    },
                    {
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 300,
                            },
                            legend: {
                                position: 'bottom',
                            },
                        },
                    },
                ],
            };

            const chartContainer = document.getElementById('chart2');

            if (chartContainer) {
                if (chart) {
                    chart.destroy();
                }
                chart = new ApexCharts(chartContainer, options);
                chart.render();
            } else {
                console.error('Chart container element not found. Make sure you have an element with ID "chart2" in your HTML.');
            }
        } else {
            console.error('No data available for the selected country and year.');
        }
    }

    // Helper function to create a dropdown
    function createDropdown(id, options, onChange, containerId) {
        const dropdown = document.createElement('select');
        dropdown.id = id;
        dropdown.addEventListener('change', onChange);

        options.forEach(option => {
            const optionElement = new Option(option, option);
            dropdown.add(optionElement);
        });

        const container = document.getElementById(containerId);

        if (container) {
            container.appendChild(dropdown);
        } else {
            console.error(`Container element with ID "${containerId}" not found.`);
        }
    }
});

