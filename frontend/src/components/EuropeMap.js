import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './EuropeMap.css'; // Assume CSS is extracted to this file
import geojson from "./europe.geojson";
import teamwiseData from "./teamwise_data.csv";
import { Button } from '@mui/material';
import Box from '@mui/material/Box';

let CountrySelected = null

function EuropeMap(props) {
    const mapRef = useRef(); // Reference for the main map container
    const gRef = useRef(); // Reference for the SVG group element

    const tooltipCountryRef = useRef(null);
    const tooltipLeagueRef = useRef(null);

    let CountrySelected = props?.CountrySelected;


    useEffect(() => {
        const width = 400;
        const height = 300;

        const svg = d3.select(mapRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const g = svg.append("g")
            .attr("clip-path", "url(#map-clip)");

        gRef.current = g; // Assign the group ref for later manipulation

        svg.append("clipPath")
            .attr("id", "map-clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

        const projection = d3.geoMercator()
            .center([3, 49]) // Adjust as necessary to focus on Western Europe
            .scale(450)
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        const tooltipCountry = svg.append("text")
            .attr("x", 10)
            .attr("y", 30)
            .style("font-size", "16px")
            .style("font-family", "Arial, sans-serif")
            .style("visibility", "hidden");
        
        tooltipCountryRef.current = tooltipCountry;

        const tooltipLeague = svg.append("text")
            .attr("x", 10)
            .attr("y", 50)
            .style("font-size", "16px")
            .style("font-family", "Arial, sans-serif")
            .style("visibility", "hidden");

            tooltipLeagueRef.current = tooltipLeague;
            d3.json(geojson).then(function(europe) {
                console.log("europe - ", europe.features)
                gRef.current.selectAll("path")
                .data(europe.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function(d){
                    if(d.properties.name == "Germany" || d.properties.name == "Spain" || d.properties.name == "England" || d.properties.name == "Italy" || d.properties.name == "France"){
                        return "red";
                    }
                    else{
                        return "#ccc";
                    }
                })
                .style("stroke", "#000")
                .style("stroke-width", "0.5px")
                .on("click", clicked)
                .on("mouseover", (event, d) => {
                d3.select(event.currentTarget).style("fill", ["Germany", "Spain", "England", "Italy", "France"].includes(d.properties.name) ? "orange" : "#ccc");
                const league = { "Germany": "Bundesliga", "Spain": "La Liga", "England": "Premier League", "Italy": "Serie A", "France": "Ligue 1" }[d.properties.name] || "League not in Top 5";
                if (tooltipCountryRef.current && tooltipLeagueRef.current) {
                    tooltipCountryRef.current.text(d.properties.name).style("visibility", "visible");
                    tooltipLeagueRef.current.text(league).style("visibility", "visible");
                }
                })
                .on("mouseout", (event) => {
                    d3.select(event.currentTarget).style("fill", d => ["Germany", "Spain", "England", "Italy", "France"].includes(d.properties.name) ? "red" : "#ccc");
                    if (tooltipCountryRef.current && tooltipLeagueRef.current) {
                        tooltipCountryRef.current.style("visibility", "hidden");
                        tooltipLeagueRef.current.style("visibility", "hidden");
                    }
                });
            });

        return () => {
            svg.remove(); // Clean up the SVG element when the component unmounts
        };
        function clicked(event, d) {
            const bounds = path.bounds(d),
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
        
            gRef.current.transition()
                .duration(750)
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
            console.log(d.properties.name.toUpperCase())
            showcities(d.properties.name.toUpperCase());
            CountrySelected = d.properties.name
            props.setCountrySelected(CountrySelected);

        }
        
        function showcities(Country) {
            console.log("Country &&",Country);
            console.log("teamwiseData &&",teamwiseData);
            d3.csv(teamwiseData).then(function(data) {
                g.selectAll("circle").remove();
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
    }, []);

    const zoomToEurope = () => {
        if (gRef.current) {
            gRef.current.transition()
                .duration(750)
                .attr("transform", "translate(0,0)scale(1)");

            gRef.current.selectAll("circle").remove(); // Remove all circles
        }
        props.setCountrySelected("Europe");
    };

    return (
        <div>
            <div ref={mapRef} id="map"></div>
            <Box display="flex" justifyContent="space-around" p={1} m={1}>
                <Button onClick={zoomToEurope} variant="outlined"> Back to Europe </Button>
            </Box>
        </div>
    );
}

export default EuropeMap;
