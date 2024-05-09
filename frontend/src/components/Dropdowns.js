import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Button } from '@material-ui/core';

const PlayerDropdown = () => {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const handleChangePlayer1 = (event) => {
    setPlayer1(event.target.value);
  };

  const handleChangePlayer2 = (event) => {
    setPlayer2(event.target.value);
  };

  const handleSubmit = () => {
    console.log('Selected Players:', player1, player2);
    // Add your logic here to handle the selected players
  };

  return (
    <div>
      <FormControl>
        <InputLabel id="player1-select-label">Player 1</InputLabel>
        <Select
          labelId="player1-select-label"
          id="player1-select"
          value={player1}
          onChange={handleChangePlayer1}
        >
          <MenuItem value="player1">Player 1</MenuItem>
          {/* Add other player options here */}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="player2-select-label">Player 2</InputLabel>
        <Select
          labelId="player2-select-label"
          id="player2-select"
          value={player2}
          onChange={handleChangePlayer2}
        >
          <MenuItem value="player2">Player 2</MenuItem>
          {/* Add other player options here */}
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default PlayerDropdown;
