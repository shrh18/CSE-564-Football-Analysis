import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './barplot.css'; // Assume CSS is extracted to this file
import teamwiseData from "./teamwise_data.csv";
import dataExtraction from "./dataFeaturing.js";
// import dataExtraction from './dataFeaturing.js';


function barplot() {

    // const barRef = useRef();

    // useEffect(() => {
        var margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#my_dataviz")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Initialize the X axis
        var x = d3.scaleBand()
        .range([ 0, width ])
        .padding(0.2);
        var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")

        // Initialize the Y axis
        var y = d3.scaleLinear()
        .range([ height, 0]);
        var yAxis = svg.append("g")
        .attr("class", "myYaxis")


        // A function that create / update the plot for a given variable:
        async function update(selectedVar) {
        // Parse the Data
            let extractedData = null
            let data = null
            try {
                extractedData = await dataExtraction();
                console.log('Extracted data:', extractedData);
                // Process the extracted data here
            } catch (error) {
                console.error('Error extracting data:', error);
            }
            console.log("Extracted data - ", extractedData)
            // console.log(data)

            let leagues = extractedData.leagues
            let goals = [extractedData.sumGoalsPremierLeague, extractedData.sumGoalsLigue1, extractedData.sumGoalsBundesliga, extractedData.sumGoalsSerieA, extractedData.sumGoalsLaLiga] 
            let fouls = [extractedData.sumFoulsPremierLeague, extractedData.sumFoulsLigue1, extractedData.sumFoulsBundesliga, extractedData.sumFoulsSerieA, extractedData.sumFoulsLaLiga]
            let passes = [extractedData.sumPassesPremierLeague/1000, extractedData.sumPassesLigue1/1000, extractedData.sumPassesBundesliga/1000, extractedData.sumPassesSerieA/1000, extractedData.sumPassesLaLiga/1000]
            if(selectedVar == 'Goals'){
                data = goals
            }
            else if(selectedVar == 'Fouls'){
                data = fouls
            }
            else if(selectedVar == 'Passes'){
                data = passes
            }

            // X axis
            x.domain(leagues)
            xAxis.transition().duration(1000).call(d3.axisBottom(x))

            // Add Y axis
            y.domain([0, d3.max(data, function(d) { return d }) ]);
            yAxis.transition().duration(1000).call(d3.axisLeft(y));

            // variable u: map data to existing bars
            var u = svg.selectAll("rect")
            .data(data)

            // update bars
            u
            .enter()
            .append("rect")
            .merge(u)
            .transition()
            .duration(1000)
                .attr("x", function(leagues, i) { return x(leagues[i]); })
                .attr("y", function(d) { return y(d); })
                .attr("width", x.bandwidth())
                .attr("height", function(d) { return height - y(d[selectedVar]); })
                .attr("fill", "#69b3a2")
        }

        // // Initialize plot
        // update('var1')
        
    // }, []);

    return (
        <div>
            <div id="barplot"></div>
            <button onClick={() => update('Goals')}>Goals</button>
            <button onClick={() => update('Fouls')}>Fouls</button>
            <button onClick={() => update('Passes')}>Passes</button>
        </div>
    );
}

export default barplot;

