
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
       // set the dimensions and margins of the graph
        const margin = {top: 20, right: 50, bottom: 30, left: 50};
        var width = 900;
        var height = 500;
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom ;
        // parse the date / time
        const parseTime = d3.timeParse("%m/%d/%Y");

        // set the ranges
        const x = d3.scaleTime().range([0, width]);
        const y0 = d3.scaleLinear().range([height, 0]);
        const y1 = d3.scaleLinear().range([height, 0]);

        // define the 1st line
        const valueline1 = d3.line()
        .x(d => x(d.date))
        .y(d => y0(d.invoiceQuantity));

        // define the 2nd line
        const valueline2 = d3.line()
        .x(d => x(d.date))
        .y(d => y1(d.importQuantity));

        // append the svg object to the body of the 

        const svg = d3.select(".statistics").append("svg")
        .attr("width", width + 250)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        // Get the data

        
        d3.csv(`../resources/data.csv`).then(function(data) {


        // format the data
        data.forEach(function(d) {
        d.date = parseTime(d.Date);
        d.invoiceQuantity = +d['Invoice Quantity'];
        d.importQuantity = +d['Import Quantity'];
        });

        // scale the range of the data
        x.domain(d3.extent(data, d => d.date));
        y0.domain([0, d3.max(data, d => d.invoiceQuantity)]);
        y1.domain([0, d3.max(data, d => d.importQuantity)]);

        // Add the valueline1 path
        svg.append("g")
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", valueline1);
  

        // Add the valueline2 path
        svg.append("g")
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", valueline2);
        // Add the X Axis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add the Y Axis (left)
        svg.append("g")
        .call(d3.axisLeft(y0));

        // add the y1 axis
        svg.append("g")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(y1));

        svg.append("text")
        .attr("transform", `rotate(-90) translate(${-margin.top - innerHeight / 2}, 0)`)
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", "-2em")
        .style("text-anchor", "middle")
        .text("Invoice Quantity");

        svg.append("text")
        .attr("transform", `rotate(90) translate(220, -900)`)
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", "-2em")
        .style("text-anchor", "middle")
        .text("Import Quantity");

        // Tạo một hình vuông màu đỏ cho chú thích import quantity
        svg.append("rect")
        .attr("x", 970)  // x position of the rectangle
        .attr("y", 10)  // y position of the rectangle
        .attr("width", 20)  // width of the rectangle
        .attr("height", 20)  // height of the rectangle
        .style("fill", "red");  // set the fill color to red

        // Thêm một văn bản mô tả cho chú thích import quantity
        svg.append("text")
        .attr("x", 1000)  // x position of the text
        .attr("y", 25)  // y position of the text
        .text("Import quantity")  // set the text
        .style("font-size", "14px");  // set the font size

        // Tạo một hình vuông màu xanh cho chú thích invoice quantity
        svg.append("rect")
        .attr("x", 970)  // x position of the rectangle
        .attr("y", 40)  // y position of the rectangle
        .attr("width", 20)  // width of the rectangle
        .attr("height", 20)  // height of the rectangle
        .style("fill", "steelblue");  // set the fill color to blue

        // Thêm một văn bản mô tả cho chú thích invoice quantity
        svg.append("text")
        .attr("x", 1000)  // x position of the text
        .attr("y", 55)  // y position of the text
        .text("Invoice quantity")  // set the text
        .style("font-size", "14px");  // set the font size


        }).catch(function(err) { console.log(err); });
    
        }
    ).catch(err => console.log(err));
} catch (e) {
    console.log(e);
}
