
try {
    let data = fetch('/statistics/data', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(async res => {
                    // set the dimensions and margins of the graph
        var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        // parse the date / time
        var parseTime = d3.timeParse("%Y-%m-%d");

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y0 = d3.scaleLinear().range([height, 0]);
        var y1 = d3.scaleLinear().range([height, 0]);

        // define the line
        var valueline1 = d3.line()
        .x(function(d) { return x(d.Date); })
        .y(function(d) { return y0(d['Invoice Quantity']); });

        var valueline2 = d3.line()
        .x(function(d) { return x(d.Date); })
        .y(function(d) { return y1(d['Import Quantity']); });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        // load the data
        d3.csv(`../resources/data.csv`, function(error, data) {
        if (error) throw error;

        console.log(data);

        // format the data
        data.forEach(function(d) {
        d.Date = parseTime(d.Date);
        d['Invoice Quantity'] = +d['Invoice Quantity'];
        d['Import Quantity'] = +d['Import Quantity'];
        });

        // sort the data by date
        data.sort(function(a, b) {
        return a.Date - b.Date;
        });

        // set the domains of the scales
        x.domain(d3.extent(data, function(d) { return d.Date; }));
        y0.domain([0, d3.max(data, function(d) { return d['Invoice Quantity']; })]);
        y1.domain([0, d3.max(data, function(d) { return d['Import Quantity']; })]);

        // add the valueline paths
        svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "steelblue")
        .attr("d", valueline1);

        svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", valueline2);

        // add the x axis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // add the y0 axis
        svg.append("g")
        .call(d3.axisLeft(y0));

        // add the y1 axis
        svg.append("g")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(y1));
        });
        
        }
    ).catch(err => console.log(err));
} catch (e) {
    console.log(e);
}
