import React from 'react';
import './Dashboard.css'; // Make sure to import the CSS file
import EuropeMap from './EuropeMap';
import * as d3 from 'd3'; // Import the d3 library
import RadarPlot from './radarplot';
import ScatterPlotMatrix from './ScatterplotMatrix';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div className="map"><EuropeMap /></div>
            {/* <div className="empty"></div> */}
            <div className="scatterPlot">Scatter Plot Matrix</div>
            <div className="graph">
                <div className="tabs">
                    <button>Tab 1</button>
                    <button>Tab 2</button>
                    <button>Tab 3</button>
                </div>
                <ScatterPlotMatrix />
                <div className="graphContent">Graph Area</div>
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
