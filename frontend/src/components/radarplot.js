import React, { useEffect, useState }  from 'react';
import * as d3 from 'd3'; // Import the d3 library
import playerData from "./player_data.csv";
import "./radarplot.css";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
// import "./radarChart";
// import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';



var margin = {top: 100, right: 100, bottom: 100, left: 100},
				width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
				height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);
					


var color = d3.scaleOrdinal()
    .range(["#EDC951","#CC333F","#00A0B0"]);
    


function RadarChart(id, data, options) {

    // console.log(data)

    var newData = [];
    data.forEach(function(d) {
        newData.push([
            {axis:"Goals",value:parseFloat(d["GoalsPer90s"])},
            {axis:"Shots",value:parseFloat(d["Shots"]) / 10},
            {axis:"Touches",value:parseFloat(d["Touches"]) / 100},
            {axis:"Dribbles",value:parseFloat(d["DriSucc"]) / 10},
            {axis:"Aerials Won",value:parseFloat(d["AerWon"])},
            {axis:"Tackles Won",value:parseFloat(d["TklWon"])},
            {axis:"Defensive Passes",value:parseFloat(d["TB"])},
            {axis:"Assists",value:parseFloat(d["AssistsPer90"])},
        ]);
    });

    console.log("newdata - ",newData);
    data = newData

    var cfg = {
        w: 400,				//Width of the circle
        h: 400,				//Height of the circle
        margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
        levels: 3,				//How many levels or inner circles should there be drawn
        maxValue: 0, 			//What is the value that the biggest circle will represent
        labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
        wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
        opacityArea: 0.35, 	//The opacity of the area of the blob
        dotRadius: 4, 			//The size of the colored circles of each blog
        opacityCircles: 0.1, 	//The opacity of the circles of each blob
        strokeWidth: 2, 		//The width of the stroke around each blob
        roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
        color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
    };
    
    // Merging supplied configuration options
    if (typeof options !== 'undefined') {
        for (var i in options) {
            if (typeof options[i] !== 'undefined') { cfg[i] = options[i]; }
        }
    }
    
    //If the supplied maxValue is smaller than the actual one, replace by the max in the data
    var maxValue = Math.max(cfg.maxValue, d3.max(newData, function(i) { return d3.max(i.map(function(o) { return o.value; })); }));

    var allAxis = newData[0].map(function(i) { return i.axis; }),
        total = allAxis.length,
        radius = Math.min(cfg.w / 2, cfg.h / 2),
        angleSlice = Math.PI * 2 / total;

    var rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);
        
    /////////////////////////////////////////////////////////
    //////////// Create the container SVG and g /////////////
    /////////////////////////////////////////////////////////

    //Remove whatever chart with the same id/class was present before
    d3.select(id).select("svg").remove();
    
    //Initiate the radar chart SVG
    var svg = d3.select(id).append("svg")
            .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
            .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
            .attr("class", "radar"+id);
    //Append a g element		
    var g = svg.append("g")
            .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
    
    /////////////////////////////////////////////////////////
    ////////// Glow filter for some extra pizzazz ///////////
    /////////////////////////////////////////////////////////
    
    //Filter for the outside glow
    var filter = g.append('defs').append('filter').attr('id','glow'),
        feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
        feMerge = filter.append('feMerge'),
        feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
        feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

    /////////////////////////////////////////////////////////
    /////////////// Draw the Circular grid //////////////////
    /////////////////////////////////////////////////////////
    
    //Wrapper for the grid & axes
    var axisGrid = g.append("g").attr("class", "axisWrapper");
    
    //Draw the background circles
    axisGrid.selectAll(".levels")
        .data(d3.range(1,(cfg.levels+1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function(d, i){return radius/cfg.levels*d;})
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter" , "url(#glow)");

    //Text indicating at what % each level is
    axisGrid.selectAll(".axisLabel")
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter().append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", function(d) { return -d * radius / cfg.levels; })
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(function(d) { return Math.round(maxValue * d / cfg.levels); }); 

    /////////////////////////////////////////////////////////
    //////////////////// Draw the axes //////////////////////
    /////////////////////////////////////////////////////////
    
    //Create the straight lines radiating outward from the center
    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
    //Append the lines
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

    //Append the labels at each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "15px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
        .text(function(d){return d})
        .call(wrap, cfg.wrapWidth);

    /////////////////////////////////////////////////////////
    ///////////// Draw the radar chart blobs ////////////////
    /////////////////////////////////////////////////////////
    
    //The radial line function
    var radarLine = d3.lineRadial()    
        .curve(d3.curveLinearClosed)
        .radius(function(d) { return rScale(d.value); })
        .angle(function(d,i) { return i*angleSlice; });
    if(cfg.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed);
    }
                
    //Create a wrapper for the blobs	
    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");
            
    //Append the backgrounds	
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("fill", function(d,i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function (d,i){
            //Dim all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", 0.1); 
            //Bring back the hovered over blob
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", 0.7);	
        })
        .on('mouseout', function(){
            //Bring back all blobs
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", cfg.opacityArea);
        });
        
    //Create the outlines	
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d,i) { return radarLine(d); })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function(d,i) { return cfg.color(i); })
        .style("fill", "none")
        .style("filter" , "url(#glow)");		
    
    //Append the circles
    blobWrapper.selectAll(".radarCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", function(d,i,j) { return cfg.color(j); })
        .style("fill-opacity", 0.8);

    /////////////////////////////////////////////////////////
    //////// Append invisible circles for tooltip ///////////
    /////////////////////////////////////////////////////////
    
    //Wrapper for the invisible circles on top
    let newX = null;
    let newY = null;
    var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");
        
    //Append a set of invisible circles on top for the mouseover pop-up
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function(d,i) { return d; })
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius*1.5)
        .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
        .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function(d,i) {
            newX =  parseFloat(d3.select(this).attr('cx')) - 10;
            newY =  parseFloat(d3.select(this).attr('cy')) - 10;
                    
            tooltip
                .attr('x', newX)
                .attr('y', newY)
                .text(d.value)
                .transition().duration(200)
                .style('opacity', 1);
        })
        .on("mouseout", function(){
            tooltip.transition().duration(200)
                .style("opacity", 0);
        });
        
    //Set up the small tooltip for when you hover over a circle
    var tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
    /////////////////////////////////////////////////////////
    /////////////////// Helper Function /////////////////////
    /////////////////////////////////////////////////////////

    //Taken from http://bl.ocks.org/mbostock/7555321
    //Wraps SVG text	
    function wrap(text, width) {
        text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.4, // ems
            y = text.attr("y"),
            x = text.attr("x"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
            
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
        });
    }//wrap	
    
}//RadarChart

function RadarPlot() {

    const [players, setPlayers] = useState([]);
    const [selectedPlayer1, setSelectedPlayer1] = useState(null); 

    const [selectedPlayer2, setSelectedPlayer2] = useState(null); 


    
    // Compare selected players on radarplot
    const [playerDataVar, setPlayerData] = useState([]);

    function comparePlayer() {
        var playerNames = [selectedPlayer1.label,selectedPlayer2.label];
        console.log("player Nmaes &&",playerNames)
        if (playerNames.length > 1) {
            var radarData = [];
            d3.csv(playerData).then(function(data) {
                data.forEach(function(d) {
                    if (playerNames.includes(d.Player)) {
                        radarData.push(d);
                    }
                });
                console.log("radardata - ",radarData)
                // createRadarChart(radarData);
                setPlayerData(radarData);
                // RadarChart(".radarChart", radarData, radarChartOptions);
            });
        }
    }
    console.log("paydafra - ", playerDataVar)
    useEffect(()=>{
        var radarChartOptions = { 
            w: width,
            h: height,
            margin: margin,
            maxValue: 0.5,
            levels: 5,
            roundStrokes: true,
            color: color
        };
        
        console.log("playerDataVar 1 - ",playerDataVar)
        if( playerDataVar.length > 1){
            console.log("playerDataVar - ",playerDataVar)
            RadarChart(".radarChart", playerDataVar, radarChartOptions);
        }
        // RadarChart(".radarChart", playerDataVar, radarChartOptions);
    },[playerDataVar])


    useEffect(() => {
        // Load and parse the CSV data
        Papa.parse(playerData, {
          download: true,
          header: true,
          complete: function(results) {
            const data = results.data;
            // Transform the data into the required format for the component
            const transformedData = data.map(player => ({
              label: player.Player,
              Squad: player.Squad // Assuming there's a 'Year' column in your CSV
            }));
            const uniqueData = removeDuplicates(transformedData, 'label');
            setPlayers(uniqueData);
            console.log("Data from CSV - ", typeof uniqueData);
          }
        });
      }, [playerData]);

      console.log("player && ",players);
      const filteredPlayers1 = players.filter(player => player.label !== selectedPlayer2?.label);
      const filteredPlayers2 = players.filter(player => player.label !== selectedPlayer1?.label);

      function removeDuplicates(array, key) {
        return array.filter((obj, index, self) =>
          index === self.findIndex((el) => (
            el[key] === obj[key]
          ))
        );
      }
    

    return (
        <div>
            <div className="radarPlot">
                Radar Plot
                <Box display="flex" justifyContent="space-around" p={1} m={1}>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={filteredPlayers1}
                    getOptionLabel={(option) => option.label}
                    sx={{ width: 200 }}
                    renderInput={(params) => <TextField {...params} label="Choose 1st player" />}
                    value={selectedPlayer1}
                    onChange={(event, newValue) => {
                    setSelectedPlayer1(newValue);
                    }}
                    />

                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={filteredPlayers2}
                    getOptionLabel={(option) => option.label}
                    sx={{ width: 200 }}
                    renderInput={(params) => <TextField {...params} label="Choose 2nd player" />}
                    value={selectedPlayer2}
                    onChange={(event, newValue) => {
                    setSelectedPlayer2(newValue);
                    }}
                    />
                    </Box>
                <div>
                    <div>
                        <Button onClick={comparePlayer} variant="outlined">Compare Players</Button>
                    </div>

                    <div className='radarChart'></div>

                </div>
            </div>
        </div>
    );
}

export default RadarPlot;