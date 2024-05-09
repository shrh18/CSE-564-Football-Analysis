import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './scatterplot.css';
import dataExtraction from './dataFeaturing';

const ScatterPlotMatrix = (props) => {

    const scatterRef = useRef(null);
    let country = props.CountrySelected;
    const width = 800;
    const size = 200; // Size of each mini plot
    const padding = 20; // Padding between plots
    const colormap = ["red", "blue", "green"];

    const [data,setData] = useState(null);

    useEffect(() =>{

        let extractedData = null;


        async function extractData() {
            let info;
            try {
                info = await dataExtraction();
                // console.log('Extracted data && :', extractedData);
                // let data= JSON.parse(extractedData);
                setData(info)
                console.log('Extracted data && 2 :',data)
                // Process the extracted data here
            } catch (error) {
                console.error('Error extracting data && :', error);
            }
        
            return info;
        }
        extractData();
        extractedData = data;

        console.log("Extracted data  && wefnwefheiwhfi:", extractedData);
        console.log("data 123 &&",data);
        // drawScatterPlotMatrix(data);

        if(data != null){

        let team, goals,fouls,passes, selectedLeagueKeys, mapdata;
        // let league;

        if(country == "Europe"){
            let league = extractedData.leagues
            // goals = [extractedData.sumGoalsPremierLeague, extractedData.sumGoalsLigue1, extractedData.sumGoalsBundesliga, extractedData.sumGoalsSerieA, extractedData.sumGoalsLaLiga] 
            // fouls = [extractedData.sumFoulsPremierLeague, extractedData.sumFoulsLigue1, extractedData.sumFoulsBundesliga, extractedData.sumFoulsSerieA, extractedData.sumFoulsLaLiga]
            // passes = [extractedData.sumPassesPremierLeague/1000, extractedData.sumPassesLigue1/1000, extractedData.sumPassesBundesliga/1000, extractedData.sumPassesSerieA/1000, extractedData.sumPassesLaLiga/1000]


            let allTeamsStats = extractedData.allTeamsStats;
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
                            console.log(team)
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
            

            // extractedData.leagues.forEach(league => {
            //     allTeamsStats.league.forEach(team => {
            //         mapdata.push({
            //             teamName: team.name,
            //             fouls: team.fouls,
            //             passes: team.passes,
            //             goals: team.goals
            //         });
            //     });
            // });

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
        if( typeof map !== "undefined")
            drawScatterPlotMatrix(mapdata);
        // let { allTeamsStats } = data;
        // console.log("allTeamsStats &&", allTeamsStats);
        // allTeamsStats?.forEach((league) => {
        //     console.log(league);
        // })
    }

    }, [props.CountrySelected]);

    

    function drawScatterPlotMatrix(data){
       

        // Extract the columns from data which are specified in the task
        if(data != null){

            console.log("data is not null - ", data)
            const columns = ["goals", "fouls", "passes"]; // Example columns
            const domainByTrait = {};

            columns.forEach(function(trait) {
                domainByTrait[trait] = d3.extent(data, function(d) { return +d[trait]; });
            });

            const svg = d3.select(scatterRef.current)
                .attr('width', size * columns.length + padding)
                .attr('height', size * columns.length + padding)
                .append('g')
                .attr('transform', 'translate(' + padding + ',' + padding / 2 + ')');

            const xScale = d3.scaleLinear()
                .range([padding / 2, size - padding / 2]);

            const yScale = d3.scaleLinear()
                .range([size - padding / 2, padding / 2]);

            const xAxis = d3.axisBottom(xScale).ticks(6);
            const yAxis = d3.axisLeft(yScale).ticks(6);

            svg.selectAll(".x.axis")
                .data(columns)
                .enter().append("g")
                .attr("class", "x axis")
                .attr("transform", (d, i) => `translate(${i * size},0)`)
                .each(function(d) { xScale.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

            svg.selectAll(".y.axis")
                .data(columns)
                .enter().append("g")
                .attr("class", "y axis")
                .attr("transform", (d, i) => `translate(0,${i * size})`)
                .each(function(d) { yScale.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

            const cell = svg.selectAll(".cell")
                .data(cross(columns, columns))
                .enter().append("g")
                .attr("class", "cell")
                .attr("transform", d => `translate(${columns.indexOf(d.x) * size},${columns.indexOf(d.y) * size})`)
                .each(plot);

            // Plot function for each cell
            function plot(p) {
                const cell = d3.select(this);
            
                xScale.domain(domainByTrait[p.x]);
                yScale.domain(domainByTrait[p.y]);
            
                cell.append("rect")
                    .attr("class", "frame")
                    .attr("x", padding / 2)
                    .attr("y", padding / 2)
                    .attr("width", size - padding)
                    .attr("height", size - padding)
                    .style("fill", "lightblue");
            
                if (p.x !== p.y) {
                    // If the row and column are different, plot circles
                    cell.selectAll("circle")
                        .data(data)
                        .enter().append("circle")
                        .attr("cx", d => xScale(d[p.x]))
                        .attr("cy", d => yScale(d[p.y]))
                        .attr("r", 4)
                        .style("fill", d => colormap[columns.indexOf(p.x) % 4]);
                } else {
                    // If the row and column are the same, put the variable name in the cell
                    cell.append("text")
                        .attr("x", size / 2)
                        .attr("y", size / 2)
                        .attr("text-anchor", "middle")
                        .attr("dominant-baseline", "middle")
                        .text(p.x);
                }
            }

            function cross(a, b) {
                const c = [];
                for (let i = 0; i < a.length; i++) {
                    for (let j = 0; j < b.length; j++) {
                        c.push({ x: a[i], y: b[j] });
                    }
                }
                return c;
            }
        }
        
    };



    return (
        <div >
            <h2><u>ScatterPlot Matrix</u></h2>
            <svg ref={scatterRef}></svg>
        </div>
    );
};

export default ScatterPlotMatrix;
