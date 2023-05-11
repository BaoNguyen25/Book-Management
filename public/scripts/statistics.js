const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
};
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;


try {
    let data = fetch('/statistics/data', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(async data => {
            // set the dimensions and margins of the graph
        const margin = {
            top: 20,
            right: 30,
            bottom: 30,
            left: 60
        };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        const svg = d3.select("body")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // parse the date/time
        const parseTime = d3.timeFormat("%Y-%m-%d");

        // format the data
        data.combinedData.forEach(function(d) {
            d.date = parseTime(d.date);
            d.invoiceQuantity = +d.invoiceQuantity;
            d.importQuantity = +d.importQuantity;
            console.log(d);
        });

        // set the ranges
        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);

        // define the line
        const valueline1 = d3.line()
            .x(function(d) {
                return x(parseTime(d.date));
            })
            .y(function(d) {
                return y(d.invoiceQuantity);
            });

        const valueline2 = d3.line()
            .x(function(d) {
                return x(parseTime(d.date));
            })
            .y(function(d) {
                return y(d.importQuantity);
            });

        // scale the range of the data
        x.domain(d3.extent(data.combinedData, function(d) {
            return parseTime(d.date);
        }));
        y.domain([0, d3.max(data.combinedData, function(d) {
            return Math.max(d.invoiceQuantity, d.importQuantity);
        })]);

        // add the valueline paths
        svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "blue")
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

        // add the y axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // add the legend
        svg.append("rect")
            .attr("x", width - 120)
            .attr("y", 10)
            .attr("width", 12)
            .attr("height", 12)
            .style("fill", "blue");

        svg.append("rect")
            .attr("x", width - 120)
            .attr("y", 30)
            .attr("width", 12)
            .attr("height", 12)
            .style("fill", "red");

        svg.append("text")
            .attr("x", width - 100)
            .attr("y", 20)
            .text("Invoice Quantity");

        svg.append("text")
            .attr("x", width - 100)
            .attr("y", 40)
            .text("Import Quantity");
        }
    );
} catch (e) {
    console.log(e);
}
