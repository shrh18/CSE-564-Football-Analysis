import React from 'react';
import './Dashboard.css'; // Make sure to import the CSS file
import EuropeMap from './EuropeMap';
import * as d3 from 'd3'; // Import the d3 library
import playerData from "./player_data.csv";
import RadarPlot from './radarplot';
import Barplot from './Barplot.js'

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div className="map"><EuropeMap /></div>
            {/* <div className="empty"></div> */}
            <div className="scatterPlot">Scatter Plot Matrix</div>
            <div className="graph">
                <Barplot />
            </div>
            <div className="parallelCoordinatesPlot">
                {/* Radar Plot
                <div className="legend">Legend</div> */}
            </div>
            <div className="radarPlot"><RadarPlot /></div>
        </div>
    );
};

export default Dashboard;
