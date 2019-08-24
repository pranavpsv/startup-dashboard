function drawcirclePacking() {
  
  var circlePacksvg = d3.select("#circle_pack")
  margin = 20,
  diameter = +circlePacksvg.attr("width"),
  g1 = circlePacksvg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

var circlePackColor = d3.scaleOrdinal()
  .domain([-1, 5])
  .range(["#e3fdfd", "#cbf1f5", "#a6e3e9", "#71c9ce"])
var pack = d3.pack()
  .size([diameter - margin, diameter - margin])
  .padding(2);
d3.json("https://raw.githubusercontent.com/pranavpsv/Indian-startup-dashboard/master/public/circle_pack.json").then(function (root) {

  var nest = d3.nest()
    .key(function (d) {
      return d['IndustryVertical'];
    })
    .key(function (d) {
      return d["CityLocation"];
    })
    .key(function (d) {
      return d.StartupName
    })
    .entries(root);

  nest = {
    key: 'root',
    values: nest
  };
  var root = d3.hierarchy(nest, function (d) {
    return d.values;
  }).sum(function (d) {
    return d['value'] === undefined ? null : d['value'];
  });
  var focus = root,
    nodes = pack(root).descendants(),
    view;

  var circle = g1.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("class", function (d) {
      return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
    })
    .style("fill", function (d) {
      return d.children ? circlePackColor(d.depth) : null;
    })
    .on("click", function (d) {
      if (focus !== d) zoom(d), d3.event.stopPropagation();
    });

  var text = g1.selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("class", "label")
    .style("fill-opacity", function (d) {
      return d.parent === root ? 1 : 0;
    })
    .style("display", function (d) {
      return d.parent === root ? "inline" : "none";
    })
    .text(function (d) {
      return d.data.key || d.data.StartupName;
    })
    .style("font-size", function (d) {
      if ((d.height === 3)) {
        return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 12) + "px";
      } else if ((d.height == 2)) {
        return (0.75 * d.r) + "px";
      } else if (d.height === 1) {
        if (d.data.key.length > 8) {
          return (1 * d.r) + "px";
        } else {
          return (1.5 * d.r) + "px";
        }
      }
    })
    .attr("dy", ".3em");
  var node = g1.selectAll("circle,text");

  circlePacksvg
    .on("click", function () {
      zoom(root);
    });

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom(d) {
    var focus0 = focus;
    focus = d;

    var transition = d3.transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .tween("zoom", function (d) {
        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
        return function (t) {
          zoomTo(i(t));
        };
      });

    transition.selectAll("#circle_pack text")
      .filter(function (d) {
        return d.parent === focus || this.style.display === "inline";
      })
      .style("fill-opacity", function (d) {
        return d.parent === focus ? 1 : 0;
      })
      .on("start", function (d) {
        if (d.parent === focus) this.style.display = "inline";
      })
      .on("end", function (d) {
        if (d.parent !== focus) this.style.display = "none";
      });
  }

  function zoomTo(v) {
    var k = diameter / v[2];
    view = v;
    node.attr("transform", function (d) {
      return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });
    circle.attr("r", function (d) {
      return d.r * k;
    });
  }
}).catch(function (err) {
  console.log("There is an error");
  console.log(err);
});

}

drawcirclePacking();