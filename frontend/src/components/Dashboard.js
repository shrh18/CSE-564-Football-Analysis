import React from 'react';
import './Dashboard.css'; // Make sure to import the CSS file

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div className="map">Map</div>
            {/* <div className="empty"></div> */}
            <div className="scatterPlot">Scatter Plot Matrix</div>
            <div className="graph">
                <div className="tabs">
                    <button>Tab 1</button>
                    <button>Tab 2</button>
                    <button>Tab 3</button>
                </div>
                <div className="graphContent">Graph Area</div>
            </div>
            <div className="parallelCoordinatesPlot">
                {/* Radar Plot
                <div className="legend">Legend</div> */}
            </div>
            <div className="radarPlot">
                Radar Plot
                <div className="legend">Legend</div>
            </div>
        </div>
    );
};

export default Dashboard;
