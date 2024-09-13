const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Render home page with form
app.get('/', (req, res) => {
    res.render('index', { joke: null, name: null });
});

// Handle form submission and fetch a joke
app.post('/joke', async (req, res) => {
    const name = req.body.name || 'Anonymous';
    
    try {
        // Fetch a joke from JokeAPI
        const response = await axios.get('https://v2.jokeapi.dev/joke/Any', {
            params: {
                type: 'single', // Get a single joke
                blacklistFlags: 'nsfw,religious,political,racist,sexist,explicit'
            }
        });

        // Personalize the joke by including the name
        const joke = response.data.joke || 'Sorry, no joke available!';
        const personalizedJoke = joke.replace('Chuck Norris', name); // Example replacement
        res.render('index', { joke: personalizedJoke, name: name });

    } catch (error) {
        res.render('index', { joke: 'Failed to fetch a joke!', name: name });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
