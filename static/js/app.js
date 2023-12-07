
//first chart

document.addEventListener("DOMContentLoaded", function () {
    var options = {
        series: [{
                name: 'PRODUCT A',
                data: [44, 55, 41, 67, 22, 43]
            },
            {
                name: 'PRODUCT B',
                data: [13, 23, 20, 8, 13, 27]
            },
            {
                name: 'PRODUCT C',
                data: [11, 17, 15, 15, 21, 14]
            },
            {
                name: 'PRODUCT D',
                data: [21, 7, 25, 13, 22, 8]
            }
        ],
        chart: {
            type: 'bar',
            height: 350,
            // other chart options...
        },
        // other options...
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();

 // Create the first chart
 var chart1 = new ApexCharts(document.querySelector("#chart1"), {
    ...options,
    series: dataForChart1
});
chart1.render();

});

