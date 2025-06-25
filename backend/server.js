// express: web framework for Node.js
// cors: enable CORS for cross-origin requests
// axios: easily fetch data from the weather API
// request: make HTTP requests to external APIs
// dotenv: secure load your API key from .env file

const express = require('express');
const cors = require('cors');
const app = express();
const request = require('request');
require('dotenv').config();

app.use(cors());

const PORT = process.env.PORT || 8000;


// Define a route to handle GET requests to the root URL
app.get('/weather', (req, res) => {
    const lat = req.query.lat;
    const lon = req.query.lon;
    // If  no latitude or longtitude is provided, return an error
    if(!lat || !lon) {
        return res.status(404).json({
            message: 'Latitude and longtitude are not found',
        })
    }

    const option = {
        url: `http://api.api-ninjas.com/v1/weather?lat=${lat}&lon=${lon}`,
        headers: {
            'X-Api-Key': process.env.API_KEY
        }
    }

    request.get(option, (error, response, body) => {
        if (error) {
            console.error('Request failed:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (response.statusCode !== 200) {
            console.error('Error:', response.statusCode, body);
            res.status(response.statusCode).json({ error: 'API Error' });
        } else {
            res.send(body); // or res.json(JSON.parse(body)) to return as an object
        }
    });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

