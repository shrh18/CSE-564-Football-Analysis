import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './scatterplot.css';
import playerData from "./player_data.csv";
import Papa from 'papaparse';

const ScatterPlotMatrix = () => {

    const scatterRef = useRef(null);
    const width = 1000;
    const size = 200; // Size of each mini plot
    const padding = 30; // Padding between plots
    const colormap = ["red", "blue", "green", "yellow"];

    useEffect(() => {
        // Load and parse the CSV data
        Papa.parse(playerData, {
            download: true,
            header: true,
            complete: function(results) {
                const data = results.data;
                drawScatterPlotMatrix(data);
            }
        });
    }, [playerData]);

    const drawScatterPlotMatrix = (data) => {
        // Extract the columns from data which are specified in the task
        const columns = ["GoalsScored", "TotalAssists", "PasTotCmp"]; // Example columns
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

            cell.selectAll("circle")
                .data(data)
                .enter().append("circle")
                .attr("cx", d => xScale(d[p.x]))
                .attr("cy", d => yScale(d[p.y]))
                .attr("r", 4)
                .style("fill", d => colormap[columns.indexOf(p.x) % 4]);
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
    };

    return (
        <div >
            <h2><u>ScatterPlot Matrix</u></h2>
            <svg ref={scatterRef}></svg>
        </div>
    );
};

export default ScatterPlotMatrix;
