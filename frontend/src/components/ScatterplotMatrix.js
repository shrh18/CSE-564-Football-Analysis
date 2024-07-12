import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './scatterplot.css';
import dataExtraction from './dataFeaturing';

const ScatterPlotMatrix = (props) => {

    const scatterRef = useRef(null);
    // let country = props.CountrySelected;
    const width = 600;
    const size = 200; // Size of each mini plot
    const padding = 20; // Padding between plots
    const colormap = ["red", "blue", "green"];

    // const [data,setData] = useState(null);

    function drawScatterPlotMatrix(data) {
        // Extract the columns from data which are specified in the task
        if (data != null) {
            console.log("data is not null - ", data)
            const columns = ["goals", "fouls", "passes"]; // Example columns
            const domainByTrait = {};
            const width = size * columns.length + padding;
            const height = size * columns.length + padding;
    
            columns.forEach(function (trait) {
                domainByTrait[trait] = d3.extent(data, function (d) { return +d[trait]; });
            });
    
            d3.select("#scatterPlotChartDiv").remove(); // Remove existing chart
    
            const svg = d3.select(scatterRef.current)
                .attr('width', size * columns.length + padding)
                .attr('height', size * columns.length + padding)
                .append('g')
                .attr('id', 'scatterPlotChartDiv') // Add an id to the container for easy removal
                .attr('transform', 'translate(' + padding + ',' + padding / 2 + ')');
    
            const xScale = d3.scaleLinear()
                .range([padding /0.9, size - padding/0.9 ]);
    
            const yScale = d3.scaleLinear()
                .range([size - padding / .9, padding / .9]);
    
            const xAxis = d3.axisBottom(xScale).ticks(10);
            const yAxis = d3.axisLeft(yScale).ticks(10);
    
            svg.selectAll(".cell").remove(); // Remove existing cells
    
            columns.forEach((xTrait, i) => {
                columns.forEach((yTrait, j) => {
                    const cell = svg.append("g")
                        .attr("class", "cell")
                        .attr("transform", `translate(${i * size}, ${j * size})`);
    
                    xScale.domain(domainByTrait[xTrait]);
                    yScale.domain(domainByTrait[yTrait]);
    
                    cell.append("rect")
                        .attr("class", "frame")
                        .attr("x", padding / 2)
                        .attr("y", padding / 2)
                        .attr("width", size - padding)
                        .attr("height", size - padding)
                        .style("fill", "lightblue");
    
                    if (i === j) {
                        cell.append("text")
                            .attr("x", size / 2)
                            .attr("y", size / 2)
                            .attr("text-anchor", "middle")
                            .attr("dominant-baseline", "middle")
                            .text(xTrait);
                    } else {
                        // Plot the data points
                        cell.selectAll("circle")
                            .data(data)
                            .enter().append("circle")
                            .attr("cx", d => xScale(+d[xTrait]))
                            .attr("cy", d => yScale(+d[yTrait]))
                            .attr("r", 4)
                            .style("fill", d => colormap[columns.indexOf(xTrait) % 4]);
                    }
    
                    // Add x-axis to the bottom of each row
                    if (j === columns.length - 1) {
                        cell.append("g")
                            .attr("class", "axis x-axis")
                            .attr("transform", `translate(0, ${size - padding / 2})`)
                            .call(xAxis);
                    }
    
                    // Add y-axis to the left of each column
                    if (i === 0) {
                        cell.append("g")
                            .attr("class", "axis y-axis")
                            .call(yAxis);
                    }
                });
            });
        }
    }
    

    useEffect(() =>{

        // let extractedData = null;

        // extractedData = props?.plotData;

        // console.log("Extracted data  && wefnwefheiwhfi:", extractedData);
        // console.log("data 123 &&",data);
        // drawScatterPlotMatrix(data);

        if(props.plotData != null && props.CountrySelected !== ""){

        let team, goals,fouls,passes, selectedLeagueKeys, mapdata;
        // let league;

        if(props.CountrySelected === "Europe"){
            // let league = props?.plotData?.leagues
            let allTeamsStats = props?.plotData?.allTeamsStats;
            console.log("allTeamsStats - ", allTeamsStats)
            let allGoals = [];
            let allFouls = [];
            let allPasses = [];

            mapdata = [];
            if (allTeamsStats) {
                allTeamsStats.forEach(league => {
                    // console.log(league)
                    Object.values(league).forEach(teams => {
                        Object.entries(teams).forEach(team =>{
                            // console.log(team)
                            mapdata.push({
                                teamName: team[0],
                                fouls: team[1]['fouls'],
                                passes: team[1]['sucPass'],
                                goals: team[1]['goals']
                            });
                        })
                        
                    });
                   
                });
            }


            goals = allGoals;
            fouls = allFouls;
            passes = allPasses;
        }
        else{
            
            let league;
            if(props.CountrySelected === 'Germany'){
                league = 'Bundesliga'
            }
            else if(props.CountrySelected === 'England'){
                league = 'Premier League'
            }
            else if(props.CountrySelected === 'Spain'){
                league = 'La Liga'
            }
            else if(props.CountrySelected === 'Italy'){
                league = 'Serie A'
            }
            else if(props.CountrySelected === 'France'){
                league = 'Ligue 1'
            }

            let selectedLeagueStats = props?.plotData?.allTeamsStats.find(obj => league in obj)[league];
            console.log("selectedLeagueStats : ", selectedLeagueStats)

            // Extract goals for each team in the selected league
            goals = Object.values(selectedLeagueStats).map(team => team.goals);
            console.log("selectedLeagueGoals",goals);

            let selectedLeagueAges = Object.values(selectedLeagueStats).map(team => team.avgAge);
            passes = Object.values(selectedLeagueStats).map(team => team.sucPass);
            fouls = Object.values(selectedLeagueStats).map(team => team.fouls);

            selectedLeagueKeys = Object.keys(selectedLeagueStats);
            mapdata = selectedLeagueKeys?.map((name, index) => ({
                teamName: name,
                fouls: fouls[index],
                passes: passes[index],
                goals: goals[index]
            }));


        }
        

        console.log("mapdata: ", mapdata)
        if( typeof map !== "undefined"){
            d3.select("scatterRef").remove();
            drawScatterPlotMatrix(mapdata);
        }
            
        // let { allTeamsStats } = data;
        // console.log("allTeamsStats &&", allTeamsStats);
        // allTeamsStats?.forEach((league) => {
        //     console.log(league);
        // })
    }

    }, [props.plotData]);

    



    return (
        <div>
            <h2><u>ScatterPlot Matrix</u></h2>
            <div id="scatterPlotDiv"></div>
            <div style={{padding: "0px 20px"}}>    
            <svg ref={scatterRef}></svg></div>

        
        </div>
    );
};

export default ScatterPlotMatrix;
