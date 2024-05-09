import React from 'react';
import './Dashboard.css'; // Make sure to import the CSS file
import EuropeMap from './EuropeMap';
import * as d3 from 'd3'; // Import the d3 library
import RadarPlot from './radarplot';
import ScatterPlotMatrix from './ScatterplotMatrix';
import Barplot from './Barplot.js';
import { Box } from '@mui/material';

const Dashboard = () => {
    const [CountrySelected, setCountrySelected] = React.useState("Europe");
    const [plotData,setPlotData] = React.useState(null);
    return (
        <div className="dashboard">
            <div className="map"><EuropeMap CountrySelected = {CountrySelected} setCountrySelected = {setCountrySelected}/></div>
            {/* <div className="empty"></div> */}
            <div className="scatterPlot">
                <ScatterPlotMatrix
                    CountrySelected={CountrySelected}
                    plotData = {plotData}
                    // setPlotData = {setPlotData}
                />
            </div>
            <div className="graph">
                <Barplot
                    CountrySelected={CountrySelected}
                    // plotData = {plotData}
                    setPlotData = {setPlotData}
                />
            </div>
            <div className="parallelCoordinatesPlot">
                {/* Radar Plot
                <div className="legend">Legend</div> */}
                <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '61%', // Adjust the width as needed
                        // height: '20%', // Adjust the height as needed
                        backgroundColor: 'primary.main', // Optional: change the background color
                        color: 'white', // Optional: change the text color
                        padding: 2 // Optional: add padding inside the box
                        }}>
                        <h1>CSE 564  :  Visualisation  European Football Performance Dashboard </h1>
                        <p></p>
                    </Box>
            </div>
            <div className="radarPlot"><RadarPlot /></div>
        </div>
    );
};

export default Dashboard;
