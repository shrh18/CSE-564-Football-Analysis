import React from 'react';
import './Dashboard.css'; // Make sure to import the CSS file
import EuropeMap from './EuropeMap';
import * as d3 from 'd3'; // Import the d3 library
import RadarPlot from './radarplot';
import ScatterPlotMatrix from './ScatterplotMatrix';
import Barplot from './Barplot.js';

const Dashboard = () => {
    const [CountrySelected, setCountrySelected] = React.useState("Europe");
    return (
        <div className="dashboard">
            <div className="map"><EuropeMap setCountrySelected = {setCountrySelected}/></div>
            {/* <div className="empty"></div> */}
            <div className="scatterPlot">
                <ScatterPlotMatrix />
            </div>
            <div className="graph">
                <Barplot CountrySelected={CountrySelected}/>
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
