import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './barplot.css'; // Assume CSS is extracted to this file
import teamwiseData from "./teamwise_data.csv";
import dataExtraction from "./dataFeaturing.js";
// import dataExtraction from './dataFeaturing.js';
import EuropeMap from './EuropeMap.js';


function Barplot(props) {
    console.log("Func called")
    // const barRef = useRef();

    const [chart,setChart] = useState("");
    let country =  props.CountrySelected;
    console.log("Country Selected = ", country)


    useEffect(() => {
        updateChart("Goals");
        
        console.log("Chart 2",chart);
        if( chart != ""){
        var margin = {top: 30, right: 30, bottom: 70, left: 60},
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        
        var xx = d3.select('#barplot').append("div").attr("id", "barPlotChartDiv")
        var svg = d3.select("#barPlotChartDiv")
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
                props.setPlotData(extractedData)
                // Process the extracted data here
            } catch (error) {
                console.error('Error extracting data:', error);
            }
            console.log("Extracted data - ", extractedData)
            // console.log(data)

            let xAxisVar;
            let yAxisVar;

            if(country == "Europe"){
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

                xAxisVar = leagues
                yAxisVar = data

            }
            else{
                
                let league;
                if(country == 'Germany'){
                    league = 'Bundesliga'
                }
                else if(country == 'England'){
                    league = 'Premier League'
                }
                else if(country == 'Spain'){
                    league = 'La Liga'
                }
                else if(country == 'Italy'){
                    league = 'Serie A'
                }
                else if(country == 'France'){
                    league = 'Ligue 1'
                }

                let selectedLeagueStats = extractedData.allTeamsStats.find(obj => league in obj)[league];
                console.log("selectedLeagueStats : ", selectedLeagueStats)

                // Extract goals for each team in the selected league
                let selectedLeagueGoals = Object.values(selectedLeagueStats).map(team => team.goals);
                console.log("selectedLeagueGoals",selectedLeagueGoals);

                let selectedLeagueAges = Object.values(selectedLeagueStats).map(team => team.avgAge);
                let selectedLeaguePasses = Object.values(selectedLeagueStats).map(team => team.sucPass);
                let selectedLeagueFouls = Object.values(selectedLeagueStats).map(team => team.fouls);

                let selectedLeagueKeys = Object.keys(selectedLeagueStats);

                if(selectedVar == 'Goals'){
                    data = selectedLeagueGoals
                }else if (selectedVar == "Avg Age"){
                    data = selectedLeagueAges
                }else if (selectedVar == "Passes"){
                    data = selectedLeaguePasses
                }else{
                    data = selectedLeagueFouls
                }

                xAxisVar = selectedLeagueKeys
                yAxisVar = data

            }


            // X axis
            x.domain(xAxisVar)
            xAxis.transition().duration(1000).call(d3.axisBottom(x)).selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.9em")
                .attr("dy", "-7px")
                .attr("transform", "rotate(-90)");

            // Add Y axis
            y.domain([0, d3.max(yAxisVar, function(d) { return d }) ]);
            yAxis.transition().duration(1000).call(d3.axisLeft(y));

            // variable u: map data to existing bars
            var u = svg.selectAll("rect")
            .data(yAxisVar)

            // update bars
            u
            .enter()
            .append("rect")
            .merge(u)
            .transition()
            .duration(1000)
                .attr("x", function(d, i) { return x(xAxisVar[i]); })
                .attr("y", function(d) { return y(d); })
                .attr("width", x.bandwidth())
                .attr("height", function(d) { return height - y(d); })
                .attr("fill", "#69b3a2")
        }

        // // Initialize plot
        update(chart)
    }else{
        updateChart("Goals");
        

    }

    }, [chart,props.CountrySelected]);

    // useEffect(()=>{
    //     updateChart("Goals");
    // },[props.CountrySelected])

    const updateChart = ((val) =>{
        d3.select("#barPlotChartDiv").remove();
        setChart(val)
    });
    

    return (
        <div>
            <div id="barplot"></div>
            <p>Country Selected: {country}</p>
            <button onClick={() => updateChart("Goals")}>Goals</button>
            <button onClick={() => updateChart('Fouls')}>Fouls</button>
            <button onClick={() => updateChart('Passes')}>Passes</button>
        </div>
    );
}
// barplot()
export default Barplot;

