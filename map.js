// Set up SVG dimensions
var width = 600;
var height = 600;

// Create SVG element
var svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Define a clip path with the same dimensions as the SVG
svg.append("clipPath")
    .attr("id", "map-clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

// Create a group element and apply the clip path
var g = svg.append("g")
    .attr("clip-path", "url(#map-clip)");

// Button for resetting the zoom
var resetButton = d3.select("#resetButton")
    .on("click", zoomToEurope);

// Define projection for Europe
var projection = d3.geoMercator()
    .center([3, 49]) // Adjust as necessary to focus on Western Europe
    .scale(900)
    .translate([width / 2, height / 2]);

// Define path generator
var path = d3.geoPath()
    .projection(projection);

// Tooltip for country name
var tooltipCountry = svg.append("text")
    .attr("x", 10) // Position where you want the tooltip
    .attr("y", 30)
    .style("font-size", "16px")
    .style("font-family", "Arial, sans-serif")
    .style("visibility", "hidden");

// Tooltip for League name
var tooltipLeague = svg.append("text")
    .attr("x", 10) // Position where you want the tooltip
    .attr("y", 50)
    .style("font-size", "16px")
    .style("font-family", "Arial, sans-serif")
    .style("visibility", "hidden");

// Load GeoJSON data for Europe
d3.json("europe.geojson").then(function(europe) {
    // Draw countries
    g.selectAll("path")
        .data(europe.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function(d){
            if(d.properties.NAME == "Germany" || d.properties.NAME == "Spain" || d.properties.NAME == "England" || d.properties.NAME == "Italy" || d.properties.NAME == "France"){
                return "red";
            }
            else{
                return "#ccc";
            }
        })
        .style("stroke", "#000")
        .style("stroke-width", "0.5px")
        .on("click", clicked)
        .on("mouseover", function(event, d) {
            d3.select(this).style("fill", function(d){
                if(d.properties.NAME == "Germany" || d.properties.NAME == "Spain" || d.properties.NAME == "England" || d.properties.NAME == "Italy" || d.properties.NAME == "France"){
                    return "orange";
                }
                else{
                    return "#ccc";
                }
            });
            league = NaN
            if(d.properties.NAME == "Germany") league = "Bundesliga"
            else if(d.properties.NAME == "Spain") league = "La Liga"
            else if(d.properties.NAME == "England") league = "Premier League"
            else if(d.properties.NAME == "Italy") league = "Serie A"
            else if(d.properties.NAME == "France") league = "Ligue 1"
            else league = "League not in Top 5"

            if(d.properties.NAME == "Germany" || d.properties.NAME == "Spain" || d.properties.NAME == "England" || d.properties.NAME == "Italy" || d.properties.NAME == "France"){
                tooltipCountry.text(d.properties.NAME) // Use the property that has the country name
                .style("visibility", "visible");
                tooltipLeague.text(league) // Use the property that has the country name
                .style("visibility", "visible")
            }
            else{
                
            }
            
            
        })
        .on("mouseout", function() {
            d3.select(this).style("fill", function(d){
                if(d.properties.NAME == "Germany" || d.properties.NAME == "Spain" || d.properties.NAME == "England" || d.properties.NAME == "Italy"|| d.properties.NAME == "France"){
                    return "red";
                }
                else{
                    return "#ccc";
                }
            });
            tooltipCountry.style("visibility", "hidden");
            tooltipLeague.style("visibility", "hidden");
        });
});

// Function to zoom on click
function clicked(event, d) {
    var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

    // Limit the translation to keep the map viewable
    translate[0] = Math.min(translate[0], 0);
    translate[1] = Math.min(translate[1], 0);
    translate[0] = Math.max(translate[0], width - width * scale);
    translate[1] = Math.max(translate[1], height - height * scale);

    g.transition()
        .duration(750)
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
    console.log(d.properties.NAME.toUpperCase())
    showcities(d.properties.NAME.toUpperCase());
}

function zoomToEurope(){
    g.transition()
        .duration(750)
        .attr("transform", "translate(0,0)scale(1)");
    
    g.selectAll("circle").remove();
}

// Load city data from a CSV file

function showcities(Country) {
    d3.csv("teamwise_data.csv").then(function(data) {
        g.selectAll("circle")
            .data(data.filter(function(d) {
                return d.Country === Country;
            }))
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                // Add random jitter to the longitude
                var jitteredLongitude = +d.Longitude + (Math.random() - 0.5) * 0.5;
                return projection([jitteredLongitude, +d.Latitude])[0];
            })
            .attr("cy", function(d) {
                // Add random jitter to the latitude
                var jitteredLatitude = +d.Latitude + (Math.random() - 0.5) * 0.5;
                return projection([+d.Longitude, jitteredLatitude])[1];
            })
            .attr("r", 2) // Radius of the circle
            .style("fill", "blue")
            .on("mouseover", function(event, d) {
                tooltipCountry.text(d.Squad) // Update tooltip with city and country
                    .style("visibility", "visible");
                tooltipLeague.text(d.City + ", " + d.Country).style("visibility", "visible");
            })
            .on("mouseout", function() {
                tooltipCountry.style("visibility", "hidden");
                tooltipLeague.style("visibility", "hidden");
            });
    });

}





