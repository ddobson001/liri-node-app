
let moment = require('moment');
moment().format();

// Required to log results to text
let filename = './logOutput.txt';
let log = require('simple-node-logger').createSimpleFileLogger( filename );
log.setLevel('all');

// DOTENV require

require("dotenv").config();

// Axios require

let axios = require("axios");

// FS require

let fs = require("fs");

// Spotify Request

const keys = require('./keys');

const Spotify = require('node-spotify-api')

let spotify = new Spotify(keys.spotify)

// Action requested from user

let command = process.argv[2];

let value = process.argv[3];

// Calls function to make app work
searchResults(command, value);
// General function for app to work
function searchResults(command, value) {
    // Switches up the first input from user to call different functions

    switch (command) {
        // Calls the Bands in Town function
        case "concert-this":

            getConcertInfo(value);

            break;
            
            
            // Calls the Spotify function
    case "spotify-this-song":

            getSpotifyInfo(value);

            break;
           
            // Calls the Axios OMDB function
        case "movie-this":

            getMovieInfo(value);

            break;
            
            // Calls the Do what it says function - which runs spotify function from the random.txt document
        case "do-what-it-says":

            getDoWhatItSays(value);

            break;
    }

}

// // Concert this Function (Calls bands in town API)

function getConcertInfo(value) {

  if (value === undefined) {

      artist = "";

      logOutput("------------------");

      logOutput("Please include artist to find concert results near you.")

      logOutput("------------------");

  } else {

      artist = value;

  }

  artist = value;

  let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

  axios.get(queryUrl)

      .then(function (response) {
       
          //change time format
        let time = moment( response.data[0].datetime).format('LLLL');
          // logOutputs concert data

          logOutput("------------------");

          logOutput("Upcoming Concert:")

          logOutput("Venue: " + response.data[0].venue.name);

          logOutput("Location: " + response.data[0].venue.country + response.data[0].venue.region + ", " + response.data[0].venue.city);

          logOutput("Date: " + time);

          logOutput("------------------");


      })

      .catch(function (error) {

          logOutput("Error occured getting BandsInTown data: " + error)

      })

};

// Spotify Function (spotify-this-song)

function getSpotifyInfo(value) {

  if (value === undefined) {

      songTitle = doWhatItSays;

  } else {

      songTitle = value;

  }

  spotify.search({

      type: 'track',

      query: songTitle

  }, function (err, data) {

      if (err) {

          return logOutput('Error occurred getting Spotify data: ' + err);

      }



      let artistsArray = data.tracks.items[0].album.artists;

      let artistsNames = [];



      for (let i = 0; i < artistsArray.length; i++) {

          artistsNames.push(artistsArray[i].name);

      }

      let artists = artistsNames.join(", ");



      // logOutputs Spotify Data

      logOutput("------------------");

      logOutput("Artist(s): " + artists);

      logOutput("Song: " + data.tracks.items[0].name);

      logOutput("Preview Link : " + data.tracks.items[0].preview_url)

      logOutput("Album: " + data.tracks.items[0].album.name);

      logOutput("------------------");

  });

};



// OMDB Function (concert-this)

function getMovieInfo(value) {



  if (value === undefined) {

      movieName = "Mr. Nobody";

  } else {

      movieName = value;

  }

  let queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plogOutput=short&tomatoes=True&apikey=trilogOutputy";



  axios.get(queryUrl)

      .then(function (response) {



          // logOutputs Movie data

          logOutput("------------------");

          logOutput("Title: " + response.data.Title);

          logOutput("Release Year: " + response.data.Year);

          logOutput("IMDB rating: " + response.data.imdbRating);

          logOutput("Rotten Tomatoes rating: " + response.data.Ratings[1].Value);

          logOutput("Country produced in: " + response.data.Country);

          logOutput("Languages: " + response.data.Language);

          logOutput("Plot: " + response.data.Plot);

          logOutput("Actors: " + response.data.Actors);

          logOutput("------------------");

      })



      .catch(function (error) {

          logOutput("Error occured getting OMDB data: " + error);

      });

}



function getDoWhatItSays() {

  fs.readFile("random.txt", "utf8", function(err, data) {

      if (err) {
  
        logOutput.error(err);
  
      } else {
  
  
  
        // Creates array with data.
  
        let randomArray = data.split(",");
  
  
  
        // Sets action to first item in array.
  
        command = randomArray[0];
  
  
  
        // Sets optional third argument to second item in array.
  
        value = randomArray[1];
  
  
  
        // Calls main controller to do something based on action and argument.
  
        searchResults(command, value);
  
      }
  
    });
  
  };

function logOutput(logText) {

	log.info(logText);

	console.log(logText);

}