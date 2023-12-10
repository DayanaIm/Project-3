document.addEventListener("DOMContentLoaded", function () {
    let chart22; 

    // Fetch data from Flask API
    fetch('/api/pie_chart')
        .then(response => response.json())
        .then(data => {
            // Extract unique countries and years
            const countries = [...new Set(data.map(item => item.country))];
            const years = getAvailableYears(data, countries[0]); // Initial selection

            // Create dropdowns for country and year
            createDropdown('countryDropdown2', countries, updateYearDropdown, 'dropdown2');
            createDropdown('yearDropdown2', years, updateChart, 'dropdown2');

            // Initial rendering of the chart with all data
            renderChart(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    // Fetch data based on selected country and year
    function updateChart() {
        console.log('Updating chart...');
        const selectedCountry = document.getElementById('countryDropdown2').value;
        const selectedYear = document.getElementById('yearDropdown2').value;

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

    // Update the year dropdown based on the selected country
    function updateYearDropdown() {
        const selectedCountry = document.getElementById('countryDropdown2').value;

        fetch(`/api/pie_chart?country=${selectedCountry}`)
            .then(response => response.json())
            .then(data => {
                const years = getAvailableYears(data, selectedCountry);
                updateDropdownOptions('yearDropdown2', years);
                updateChart();
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Helper function to get available years for a selected country
    function getAvailableYears(data, selectedCountry) {
        const countryData = data.filter(item => item.country === selectedCountry);
        return [...new Set(countryData.map(item => item.year))];
    }

    // Helper function to update dropdown options
    function updateDropdownOptions(dropdownId, options) {
        const dropdown = document.getElementById(dropdownId);
        dropdown.innerHTML = ''; // Clear existing options

        options.forEach(option => {
            const optionElement = new Option(option, option);
            dropdown.add(optionElement);
        });
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

    // Render a pie chart with total for male and female
    function renderChart(data) {
        console.log('Received data:', data);

        const filteredData = data.filter(item =>
            typeof item.male_suicides === 'number' && !isNaN(item.male_suicides) &&
            typeof item.female_suicides === 'number' && !isNaN(item.female_suicides)
        );

        console.log('Filtered data:', filteredData);

        const selectedCountry = document.getElementById('countryDropdown2').value;
        const selectedYear = document.getElementById('yearDropdown2').value;

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
                colors: ['#775DD0', '#FEB019'],

                legend: {
                    position: 'bottom',
                    fontSize: '14px',
                    
                },
                fill: {
                    type: 'gradient',
                    colors: ['#775DD0', '#FEB019']
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

            const chartContainer = document.getElementById('chart22'); 

            if (chartContainer) {
                if (chart22) { 
                    chart22.destroy(); 
                }
                chart22 = new ApexCharts(chartContainer, options); 
                chart22.render(); 
            } else {
                console.error('Chart container element not found. Make sure you have an element with ID "chart22" in your HTML.'); // Change variable name to chart22
            }
        } else {
            console.error('No data available for the selected country and year.');
        }
    }
});
