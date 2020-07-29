const express = require('express');
const morgan = require('morgan');
const apps = require('./playstore.js');

const app = express();

app.use(morgan('common'));

app.get('/apps', (req, res) => {
    const { genres = "" , sort } = req.query

    //only search by title or rank
    if (sort) {
        if (!['Rating', 'App'].includes(sort)) {
          return res
            .status(400)
            .send('Sort must be one of Rating or App');
        }
      }

    //confirm one of six genres
    if (genres) {
        if (!['Action', 'action', 'Puzzle', 'puzzle', 'Strategy', 'strategy', 'Casual', 'casual', 'Arcade', 'arcade', 'Card', 'card'].includes(genres)) {
            return res 
                .status(400)
                .send('Genre must be one of Action, Puzzle, Strategy, Casual, Arcade, Card');       
        }
    }

    let results = apps
    .filter(appsResults => 
        appsResults
            .Genres
            .toLowerCase()
            .includes(genres.toLowerCase()));

    if (sort) {
        results
            .sort((a, b) => {
            return a[sort] > b[sort] ? -1 : a[sort] < b[sort] ? 1 : 0;
        });
        }

    res
        .json(results);
});

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
  });