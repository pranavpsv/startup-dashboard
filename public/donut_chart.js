var totalDonutChartData = [{
    name: "Seed Funding",
    value: 1301
  },
  {
    name: "Private Equity",
    value: 1067
  },
  {
    name: "Crowd Funding",
    value: 2
  },
  {
    name: "Debt Funding",
    value: 1
  },
];
var text = "";
var pie = d3.pie()
  .value(function (d) {
    return d.value;
  }).sort(null)
var width = 250;
var height = 280;
var thickness = 30;
var duration = 750;

var radius = Math.min(width, height) / 2;
var donutColorScale = d3.scaleOrdinal()
  .domain(["Seed Funding", "Debt Funding", "Crowd Funding", "Private Equity"])
  .range(["#F21D44", "#ecfeff", "#a0cc78", "#37CC44"])

var arc = d3.arc()
  .innerRadius(radius - thickness)
  .outerRadius(radius);

function createDonut(donutChartData) {

  d3.selectAll(".pie").transition().duration(2000);
  d3.select(".pie").remove();
  var donutsvg = d3.select("#donut")
    .append('svg')
    .attr('class', 'pie')
    .attr('width', width)
    .attr('height', height);
  var g = donutsvg.append('g')
    .attr('transform', 'translate(' + ((width+70) / 2) + ',' + ((height+40) / 2) + ')');
  var keys = ["Private Equity", "Seed Funding"]


  // Add one dot in the legend for each name.
  donutsvg.selectAll("mydots")
    .data(keys)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => 15 + (i * 185))
    .attr("cy", function (d, i) {
      return 20
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", d => donutColorScale(d));

  donutsvg.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", (d, i) => 30 + (i * 185))
    .attr("y", (d, i) => 20)
    .attr("class", "name-text")
    .style("fill", d => donutColorScale(d))
    .text(d => d)
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
  var path = g.selectAll('path')
    .data(pie(donutChartData))
    .enter()
    .append("g")

    .on("mouseover", function (d) {
      let g = d3.select(this)
        .style("cursor", "pointer")
        .attr("fill", "black")
        .append("g")
        .attr("class", "text-group");

      g.append("text")
        .attr("class", "name-text")
        .text(`${d.data.name}`)
        .attr('text-anchor', 'middle')
        .style("fill", "white")
        .attr('dy', '-1.2em');

      g.append("text")
        .attr("class", "value-text")
        .text(`${Math.round(((d.endAngle - d.startAngle)/(2*Math.PI)*100)*100)/100}` + "% ")
        .attr('text-anchor', 'middle')
        .style("fill", "white")
        .attr('dy', '.6em');

    })
    .on("mouseout", function (d) {
      d3.select(this)
        .style("cursor", "none")
        .attr("fill", donutColorScale(d.data.name))
        .select(".text-group").remove();
    })
    .append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => donutColorScale(d.data.name))
    .on("mouseover", function (d) {
      d3.select(this)
        .style("cursor", "pointer")
        .attr("fill", "white");
    })
    .on("mouseout", function (d, i) {
      d3.select(this)
        .style("cursor", "none")
        .attr("fill", donutColorScale(d.data.name));
    });


  g.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '.35em')
    .text(text);

}

createDonut(totalDonutChartData);
var donutDataYear = {
  data2015: [{
      name: "Seed Funding",
      value: 499
    },
    {
      name: "Private Equity",
      value: 435
    },
    {
      name: "Crowd Funding",
      value: 2
    },
    {
      name: "Debt Funding",
      value: 0
    },
  ],
  data2016: [{
      name: "Seed Funding",
      value: 586
    },
    {
      name: "Private Equity",
      value: 406
    },
    {
      name: "Crowd Funding",
      value: 0
    },
    {
      name: "Debt Funding",
      value: 0
    },
  ],
  data2017: [{
      name: "Seed Funding",
      value: 226
    },
    {
      name: "Private Equity",
      value: 216
    },
    {
      name: "Crowd Funding",
      value: 0
    },
    {
      name: "Debt Funding",
      value: 1
    },
  ],
  dataTotal: totalDonutChartData
}
$(".yearInvestmentTypes").on("click", () => {
  let year = $("#yearInvestmentType")[0].innerHTML;
  year = String(year).includes("Total") ? 2018 : Number(year);
  year = year == 2015 ? "Total (2015 - 2017)" : (year - 1)
  $("#yearInvestmentType")[0].innerHTML = year;
  year = String(year).includes("Total") ? "Total" : year;
  updatedDonutData = donutDataYear["data" + year];
  createDonut(updatedDonutData);

});