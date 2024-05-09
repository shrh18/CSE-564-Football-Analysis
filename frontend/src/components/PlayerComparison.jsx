import React, { useState } from 'react';
import { Select, MenuItem, Button, TextField } from '@material-ui/core';

const PlayerComparison = () => {
    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');
    const [searchInput1, setSearchInput1] = useState('');
    const [searchInput2, setSearchInput2] = useState('');

    // Function to handle player selection
    const handlePlayerSelection = (event, setPlayer, setSearchInput) => {
        setPlayer(event.target.value);
        setSearchInput('');
    };

    // Function to handle search input change
    const handleSearchInputChange = (event, setSearchInput) => {
        setSearchInput(event.target.value);
    };

    // Function to compare players
    const comparePlayers = () => {
        if (player1 && player2) {
            // Logic to compare player stats
            console.log('Comparing Player 1:', player1);
            console.log('Comparing Player 2:', player2);
        } else {
            alert('Please select two players to compare.');
        }
    };

    // Dummy player data (replace with actual data)
    const players = [
        { id: 1, name: 'Player 1' },
        { id: 2, name: 'Player 2' },
        { id: 3, name: 'Player 3' },
        // Add more players as needed
    ];

    return (
        <div>
            <div>
                <Select
                    value={player1}
                    onChange={(event) => handlePlayerSelection(event, setPlayer1, setSearchInput1)}
                >
                    <MenuItem value="">Select Player 1</MenuItem>
                    {players.map((player) => (
                        <MenuItem key={player.id} value={player.name}>
                            {player.name}
                        </MenuItem>
                    ))}
                </Select>
                <TextField
                    value={searchInput1}
                    onChange={(event) => handleSearchInputChange(event, setSearchInput1)}
                    placeholder="Search Player 1"
                />
            </div>
            <div>
                <Select
                    value={player2}
                    onChange={(event) => handlePlayerSelection(event, setPlayer2, setSearchInput2)}
                >
                    <MenuItem value="">Select Player 2</MenuItem>
                    {players.map((player) => (
                        <MenuItem key={player.id} value={player.name}>
                            {player.name}
                        </MenuItem>
                    ))}
                </Select>
                <TextField
                    value={searchInput2}
                    onChange={(event) => handleSearchInputChange(event, setSearchInput2)}
                    placeholder="Search Player 2"
                />
            </div>
            <Button onClick={comparePlayers}>Compare Players</Button>
        </div>
    );
};

export default PlayerComparison;
