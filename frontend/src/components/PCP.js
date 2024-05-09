// import React, { useEffect, useRef, useState } from 'react';
// import * as d3 from 'd3';
// import './barplot.css'; // Assume CSS is extracted to this file
// import teamwiseData from "./teamwise_data.csv";
// import dataExtraction from "./dataFeaturing.js";
// // import dataExtraction from './dataFeaturing.js';
// import EuropeMap from './EuropeMap.js';


// function PCP(props) {
//     console.log("Func called")
//     // const barRef = useRef();

//     const [chart,setChart] = useState("");
//     let country =  props.CountrySelected;
//     console.log("Country Selected = ", country)


//     useEffect(() => {
//         const svgWidth = 1350;
//         const svgHeight = 650;
//         const margin = { top: 70, right: 20, bottom: 70, left: 50 };
//         const width = svgWidth - margin.left - margin.right;
//         const height = svgHeight - margin.top - margin.bottom;

//         const numDimensions = allLabels.length;

//         // console.log("Variable labels - ", allLabels)

//         // allLabels.forEach(dimension => {
//         //     console.log("Dimension - ", dimension)
//         // });
//         // Calculate extent of each dimension
//         const dimensionExtents = {};
//         allLabels.forEach(dimension => {
//             arr = []
//             X.forEach((row) => {
//                 arr.push(row[allLabels.indexOf(dimension)]);
//             });
//             const extent = d3.extent(arr);
//             // const extent = [Math.min(arr), Math.max(arr)]
//             dimensionExtents[dimension] = [extent[0]-0.1*(extent[0]+1), extent[1]+0.1*(extent[1]+1)];
//         });

//         console.log("Dimension Extents - ", dimensionExtents)

//         // Create scales
//         const xScale = d3.scalePoint()
//             .domain(allLabels)
//             .range([0, width]);


//         const yScales = {};
//         allLabels.forEach(dimension => {
//             yScales[dimension] = d3.scaleLinear()
//                 .domain(dimensionExtents[dimension])
//                 .range([height, 0]);
//         });

//         // console.log("Y Scales - ", yScales)

//         // Create color scale for cluster IDs
//         colorScale = d3.scaleOrdinal(d3.schemeCategory10)


//         // Remove existing plot
//         d3.select('#ParallelCoordinatesPlot').remove();

//         // Create container for the plot
//         const container = d3.select("#MDSPlots").append("div")
//             .attr("id", "ParallelCoordinatesPlot")
//             .attr("class", "bg-light m-1 col-11");

//         // Create SVG for the plot
//         const svg = container.append('svg')
//             .attr('width', svgWidth)
//             .attr('height', svgHeight)
//             .append('g')
//             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//         // Append axes to the SVG
//         // Append axes to the SVG
//         const axes = svg.selectAll(".axis")
//         .data(allLabels)
//         .enter()
//         .append("g")
//         .attr("class", "axis")
//         .attr("transform", (d, i) => "translate(" + xScale(d) + ",0)")
//         .each(function (d, i) {
//             // Append axis label
//             const offsetY = -10; // Alternate positioning up and down
//             const axisGroup = d3.select(this);
//             const axisYScale = yScales[d];
//             const axisYRange = axisYScale.range();
//             const labelYPosition = axisYRange[axisYRange.length - 1]; // Position at the top of the axis
//             axisGroup.call(d3.axisLeft(yScales[d]))
//                 .append("text")
//                 .attr("class", "axis-label")
//                 .attr("y", offsetY)
//                 .attr("x", -15) // Adjust the x position as needed
//                 .attr("dy", ".71em")
//                 .attr("transform", "rotate(45)")
//                 .attr("y", labelYPosition-5) // Position the label at the top of the axis
//                 .text(d)
//                 .style("text-anchor", "end") // Adjust text-anchor if needed
//                 .style("fill", "black");
//         });
        
//         // Define line function 
//         const line = d3.line()
//             .x((d, i) => xScale(allLabels[i]))
//             .y((d, i) => yScales[allLabels[i]](d));

//         // Draw polylines for each data point
//         const polylines = svg.selectAll(".polyline")
//             .data(X)
//             .enter()
//             .append("path")
//             .attr("class", "polyline")
//             // Constructing the path using the line generator and data for each point
//             .attr("d", (d, i) => line(allLabels.map(dim => d[allLabels.indexOf(dim)])))
//             // Set fill to none to ensure only the stroke is visible
//             .style("fill", "none")
//             // Set stroke color based on cluster ID
//             .style("stroke", (_,i) => colorScale(clusterIDs[i]))
//             .style("stroke-width", 2)
//             // Set opacity to 0.5
//             .style("opacity", 0.2);

//         svg.append('text')
//             .attr('x', width / 2)
//             .attr('y', height +55)
//             .attr('text-anchor', 'middle')
//             .text('PARALLEL COORDINATES PLOT')
//             .attr("font-size", "25px");

//         d3.select("#ParallelCoordinatesPlot").style("border", "3px solid black");



        
//         // polylines.on("mouseover", function (d, i) {
//         //     d3.select(this)
//         //         // .style("stroke", colorScale(clusterIDs[i]))
//         //         .style("stroke-width", 4)
//         //         .style("opacity", 1);

            
//         // })
//         // .on("mouseout", function (d, i) {
//         //     d3.select(this)
//         //         .style("stroke-width", 2)
//         //         .style("opacity", 0.1);
//         // });

//         polylines.on("mouseover", function (d, i) {
//             d3.select(this)
//                 .style("stroke-width", 2)
//                 .style("opacity", 0.6);

//             polylines.each(function (polyline, j) {
//                 if (clusterIDs[j] == clusterIDs[i]) {
//                     d3.select(this)
//                         .style("stroke-width", 2)
//                         .style("opacity", 0.6);
//                 }
//                 else{
//                     d3.select(this)
//                         .style("stroke-width", 2)
//                         .style("opacity", 0.0);
//                 }
//             });
//         })
//         .on("mouseout", function (d, i) {
//             d3.select(this)
//                 .style("stroke-width", 2)
//                 .style("opacity", 0.2);

//             polylines.each(function (polyline, j) {
//                 if ((clusterIDs[j]) == (clusterIDs[i])) {
//                     d3.select(this)
//                         .style("stroke-width", 2)
//                         .style("opacity", 0.2);
//                 }
//                 else{
//                     d3.select(this)
//                         .style("stroke-width", 2)
//                         .style("opacity", 0.2);
//                 }
//             });
//         });

//         let dimensions = [...allLabels]
//         // Add interaction to reorder axes
//         axes.on("click", function (d) {
//             // dimensions = allLabels;   
//             index = dimensions.indexOf(d);
//             dimensions.splice(index, 1);
//             dimensions.unshift(d);
//             xScale.domain(dimensions);

//             // Reorder data based on new dimensions order
//             const reorderedX = X.map(dataPoint => {
//                 const reorderedDataPoint = {};
//                 dimensions.forEach(dim => {
//                     reorderedDataPoint[dim] = dataPoint[dimensions.indexOf(dim)];
//                 });
//                 return reorderedDataPoint;
//             });

//             // console.log("variables plot - ", allLabels)
//             // console.log("MP in original at - ", allLabels.indexOf('MP'))
//             XX = []
//             X.forEach((row) => {
//                 arr = []
//                 dimensions.forEach((dimension) => {
//                     arr.push(row[allLabels.indexOf(dimension)]);
//                 }); 
//                 XX.push(arr);
//             });

//             // console.log("Reordered Xx - ", XX)
//             // console.log("Reordered Dimensions - ", dimensions)

//             // Define new yScales based on reordered dimensions
//             const newYScales = {};
//             dimensions.forEach(dimension => {
//                 newYScales[dimension] = d3.scaleLinear()
//                     .domain(dimensionExtents[dimension])
//                     .range([height, 0]);
//             });

//             const newxScale = d3.scalePoint()
//                 .domain(dimensions)
//                 .range([0, width]);

//             // Define new line function 
//             const newline = d3.line()
//                 .x((_, i) => newxScale(dimensions[i]))
//                 .y((d, i) => newYScales[dimensions[i]](d));

//             svg.selectAll(".axis")
//                 .transition()
//                 .duration(500)
//                 .attr("transform", (d, i) => "translate(" + xScale(d) + ",0)");
            

//             svg.selectAll(".polyline")
//                 .data(XX)
//                 .transition()
//                 .duration(500)
//                 .attr("d", d => {
//                     // const reorderedData = dimensions.map(dim => d[dim]);
//                     // console.log("Reordered Data - ", reorderedData)
//                     return newline(d);
//                 })
//                 .style("fill", "none")
//                 .style("stroke", (_,i) => colorScale(clusterIDs[i]))
//                 .style("opacity", 0.2);
//         });


//         KK = []
//         const drag = d3.drag()
//         .on("start", dragstart)
//         .on("drag", dragmove)
//         .on("end", dragend);

//         axes.call(drag);

//         function dragstart(d) {
//             d3.select(this).raise().classed("active", true);
//         }

//         function dragmove(d) {
//             const x = d3.event.x;
//             const newX = Math.max(0, Math.min(width, x)); // Restrict movement within xScale range
//             d3.select(this).attr("transform", `translate(${newX}, 0)`);

//             // Update axes positions
//             svg.selectAll(".axis")
//             .attr("transform", function(axisDimension) {
//                 if (axisDimension === d) return `translate(${newX},0)`;
//                 return d3.select(this).attr("transform");
//             });

//             // // Update polylines
//             // svg.selectAll(".polyline")
//             //     .attr("d", function(dataPoint) {
//             //         return line(dimensions.map(dim => dataPoint[dimensions.indexOf(dim)]));
//             // });
//         }

//         function dragend(d) {
//             const newX = d3.event.x;
        
//             // Find the nearest index where the dragged axis should be placed
//             let newIndex = 0;
//             let minDistance = Math.abs(newX - xScale(dimensions[0])); // Initial minimum distance
        
//             dimensions.forEach((dim, index) => {
//                 const distance = Math.abs(newX - xScale(dim));
//                 if (distance < minDistance) {
//                     minDistance = distance;
//                     newIndex = index;
//                 }
//             });
        
//             // Remove the dragged dimension from its current position
//             const currentIndex = dimensions.indexOf(d);
//             dimensions.splice(currentIndex, 1);
        
//             // Insert the dragged dimension at the new position
//             dimensions.splice(newIndex, 0, d);
//             xScale.domain(dimensions); // Update xScale with new dimensions
            

//             console.log("Rerodered dim afetr dragging - ", dimensions)

//             KK = []      
//             X.forEach((row) => {
//                 arr = []
//                 dimensions.forEach((dimension) => {
//                     arr.push(row[allLabels.indexOf(dimension)]);
//                 }); 
//                 KK.push(arr);
//             });
//             console.log("KK - ", KK)

//             svg.selectAll(".axis")
//                 .transition()
//                 .duration(500)
//                 .attr("transform", (d, i) => "translate(" + xScale(d) + ",0)");
            
//             // Update axes positions
//             const newYScales = {};
//             dimensions.forEach(dimension => {
//                 newYScales[dimension] = d3.scaleLinear()
//                     .domain(dimensionExtents[dimension])
//                     .range([height, 0]);
//             });

//             const newxScale = d3.scalePoint()
//                 .domain(dimensions)
//                 .range([0, width]);

//             // Define new line function 
//             const newline = d3.line()
//                 .x((_, i) => newxScale(dimensions[i]))
//                 .y((d, i) => newYScales[dimensions[i]](d));


//             svg.selectAll(".polyline")
//                 .data(KK)
//                 .transition()
//                 .duration(500)
//                 .attr("d", d => {
//                     return newline(d);
//                 })
//                 .style("fill", "none")
//                 .style("stroke", (_,i) => colorScale(clusterIDs[i]))
//                 .style("opacity", 0.2);
                
//             d3.select(this).classed("active", false);
//         }
    
//     }else{
//         updateChart("Goals");
        
//     })

//     }, [chart,props.CountrySelected]);

//     // useEffect(()=>{
//     //     updateChart("Goals");
//     // },[props.CountrySelected])

//     const updateChart = ((val) =>{
//         d3.select("#barPlotChartDiv").remove();
//         setChart(val)
//     });
    

//     return (
//         <div>
//             <div id="pcp"></div>
//         </div>
//     );
// }
// // barplot()
// export default PCP;

