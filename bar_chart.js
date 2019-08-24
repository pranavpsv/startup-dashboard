var slider = document.getElementById("slider");
var output = document.getElementById("slider-span");
var sliderValue = 5;
var dataset;
var svg1;
var programmedChange = false;
// Update the current slider value (each time you drag the slider handle)
slider.onchange = function () {
    output.innerHTML = this.value;
    sliderValue = this.value;
    d3.select(".barChart").remove();
    if (sliderValue == 0) {
        d3.select("#bar")
            .append("text")
            .text("Sorry, No results for that search. Adjust the Slider.")
            .attr("class", "h3")
            .attr("id", "no-results")
            .fill("black");
    } else {
        d3.select("#no-results").remove();
        draw();
    }
    $('select').val("All");
    citySelect.set("All");
    industrySelect.set("All");
    yearSelect.set("All");
    investmentTypeSelect.set("All");

}

function drawBars(svg1, dataset) {
    svg1.selectAll("mybar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x(d.StartupName);
        })
        .attr("y", function (d) {
            return y(d.AmountInUSD);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return height - y(d.AmountInUSD);
        })
        .attr("fill", function (d) {
            return colorScale(d.AmountInUSD)
        })
        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.StartupName + ": $" + Number(d.AmountInUSD).toLocaleString(undefined, {
                    maximumFractionDigits: 0
                }))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}

function dataFilter(data, config) {
    const keys = Object.keys(config);
    let filteredConfig = {}
    keys.forEach(key => {
        if (config[key] !== "All") {
            filteredConfig[key] = config[key];
        }
    });
    const filterKeys = Object.keys(filteredConfig);
    filterKeys.forEach(key => {
        if (key != "year") {
            data = data.filter(datum => datum[key] === filteredConfig[key]);
        } else {
            data = data.filter(datum => datum.Date.includes(filteredConfig[key]));
        }
    });
    return data;
}


function filterTopK(dataset) {
    dataset.sort(function (a, b) {
        return b.AmountInUSD - a.AmountInUSD;
    });
    dataset = dataset.slice(0, sliderValue);
    var startupNames = []
    dataset.forEach((datum) => {
        while (startupNames.includes(datum.StartupName)) {
            datum.StartupName += " ";
        }
        startupNames.push(datum.StartupName);
    });
    return dataset;
}

// append the svg object to the body of the page

function draw() {
    // append the svg object to the body of the page
    var margin = {
            top: 20,
            right: 30,
            bottom: 0,
            left: 150
        },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    svg1 = d3.select("#bar")
        // .classed("svg-container", true)
        .append("svg")
        // .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("class", "barChart")
        .attr("viewBox", "0 0 600 500")
   // Class to make it responsive.
        // .classed("svg-content-responsive", true)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    // Parse the Data

    d3.csv("https://raw.githubusercontent.com/pranavpsv/Indian-startup-dashboard/master/public/bar_chart_filters_data.csv").then(async function (data) {
        dataset = data;
        // sort data
        dataset = filterTopK(dataset);
        console.log(dataset);
        var colorScale = d3.scaleSequential(d3.interpolateGnBu)
            .domain([0, d3.max(dataset.map(function (d) {
                return Number(d.AmountInUSD);
            }))]);

        // X axis
        // var tooltip = d3.select("body").append("div").attr("class", "toolTip");
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        var fontSize = sliderValue >= 7 ? "7px" : "11px";
        var x = d3.scaleBand()
            .range([0, width])
            .domain(dataset.map(function (d) {
                return d.StartupName;
            }))
            .padding(0.2);
        svg1.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .attr("class", "xaxis")
            .selectAll("text")
            .attr("font-size", fontSize);
        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(dataset.map(d => Number(d.AmountInUSD)))])
            .range([height, 0]);
        svg1.append("g")
            .call(d3.axisLeft(y))
            .attr("class", "yaxis");

        // Bars
        svg1.selectAll("mybar")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return x(d.StartupName);
            })
            .attr("y", function (d) {
                return y(d.AmountInUSD);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d.AmountInUSD);
            })
            .attr("fill", function (d) {
                return colorScale(d.AmountInUSD)
            })
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d.StartupName + ": $" + Number(d.AmountInUSD).toLocaleString(undefined, {
                        maximumFractionDigits: 0
                    }))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("click", function (d, i) {
                var currRect = d3.select(this);
                console.log(d);
                var currRectFill = currRect.attr("fill");
                currRect.attr("fill", "black");
                setTimeout(function (d) {
                    currRect.attr("fill", currRectFill);
                }, 125);
            });
        d3.select("#slider")
            .on("input", function (d) {
                output.innerHTML = this.value;
                console.log(this.value);
                sliderValue = this.value;

            });
        d3.selectAll(".filter-data")
            .on("change", (d) => {
                var config = {
                    CityLocation: d3.select("#city-select").node().value,
                    IndustryVertical: d3.select("#industry-select").node().value,
                    InvestmentType: d3.select("#investment-type-select").node().value,
                    year: d3.select("#year-select").node().value
                }

                dataset = dataFilter(data, config);
                dataset = filterTopK(dataset);

                colorScale.domain([0, d3.max(dataset.map(d => Number(d.AmountInUSD)))]);
                y.domain([0, d3.max(dataset.map(d => Number(d.AmountInUSD)))]);
                x.domain(dataset.map(d => d.StartupName));
                var t = d3.transition()
                    .duration(750)
                svg1.select(".yaxis")
                    .transition(t)
                    .call(d3.axisLeft(y))
                svg1.select(".xaxis")
                    .transition(t)
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x))
                    .selectAll("text")
                    .style("font-size", fontSize);
                if (dataset.length < Number($("#slider")[0].value)) {
                    programmedChange = true;
                    // Programmatic change of slider value
                    $("#slider").val(dataset.length).change();
                }
                // Hacky way of updating bar chart when there are less number of bars to appear in the chart.
                if (programmedChange) {
                    setTimeout(() => {
                        $("#filter").trigger("click")
                        programmedChange = false;
                    }, 10);
                }
                d3.selectAll("rect")
                    .data(dataset)
                    .attr("fill", function (d) {
                        return colorScale(d.AmountInUSD)
                    })
                    .transition()
                    .delay((d, i) => i / dataset.length * 1000)
                    .duration(600)
                    .ease(d3.easeLinear)
                    .attr("y", d => y(d.AmountInUSD))
                    .attr("height", d => height - y(d.AmountInUSD));
            });
    }).catch(err => err);
};
draw();