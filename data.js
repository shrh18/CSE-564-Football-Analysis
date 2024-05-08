const fs = require('fs');
const csv = require('csv-parser');

const data = [];

fs.createReadStream('path/to/your/csv/file.csv')
    .pipe(csv())
    .on('data', (row) => {
        data.push(row);
    })
    .on('end', () => {
        console.log('Data extracted successfully:', data);
        // You can use the 'data' variable here for further processing
    });