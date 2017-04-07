// Link keys.js fiile
var keys = require("./keys.js");
// Require file system
var fs = require('fs');
// Require twitter npm
var twitter = require('twitter');
// Require spotify npm
var spotify = require('spotify');
// Require request npm
var request = require('request');


//Function for finding songs on Spotify
var spotifyThis = function(songName) {
  // If theres no song then run The Sign
  if (songName === undefined) {
    songName = 'The Sign';
  };

  spotify.search({ type: 'track', query: songName }, function(err, data) {
    // If there is an error
    if (err) {
      console.log(err);
    
    }
    //Function to find artist
var getArtists = function(artist) {
  return artist.name;
};

    var songs = data.tracks.items;
    // Holds my data
    var data = []; 
    // Pushes data to data array
    for (var i = 0; i < songs.length; i++) {
      data.push({
        Artist:  songs[i].artists.map(getArtists),
        Song: songs[i].name,
        Preview: songs[i].preview_url,
        Album: songs[i].album.name,
      });
    }
    console.log(data);
    
  });
};


var getTweets = function() {
// Creates a new twitter object
  	var client = new twitter(keys.twitterKeys);
// Paramaters
  	var params = { screen_name: 'Louisemoraan', count: 20 };

  	client.get('statuses/user_timeline', params, function(error, tweets, response) {
  	// If there's an error
  		if(error){
  		console.log("There's an error!");
  		console.log(error);
  		}
    	if (!error) {
      var data = []; //empty array to hold data
      for (var i = 0; i < tweets.length; i++) {
        data.push({
            'created at: ' : tweets[i].created_at,
            'Tweets: ' : tweets[i].text,
        });
      }
      console.log(data);
      
    }
  });
};
// Function to get the movie info
var getMyMovie = function(movieName) {

  if (movieName === undefined) {
    movieName = 'Mr Nobody';
  }
// Creating a new URL to get movie info
  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = [];
      var movieData = JSON.parse(body);
    // Pushing information into the empty data array
      data.push({
      Title : movieData.Title,
      Year:  movieData.Year,
      Rated: movieData.Rated,
      'IMDB Rating': movieData.imdbRating,
      Country: movieData.Country,
      Language: movieData.Language,
      Plot: movieData.Plot,
      Actors: movieData.Actors,
      'Rotten Tomatoes Rating': movieData.tomatoRating,
      'Rotton Tomatoes URL': movieData.tomatoURL,
  });
      console.log(data);
    
}
  });

}

var doWhatItSays = function() {
  // Getting infor from random.txt
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);
    var dataArray = data.split(',')

    if (dataArray.length == 2) {
      pick(dataArray[0], dataArray[1]);
    } else if (dataArray.length == 1) {
      pick(dataArray[0]);
    }

  });
}
// Which function to use
var choose = function(caseData, functionData) {
  switch (caseData) {
    case 'movie-this':
      getMyMovie(functionData);
      break;
    case 'my-tweets':
      console.log("running my tweets");
      getTweets();
      break;
      case 'do-what-it-says':
      doWhatItSays();
      break;
    case 'spotify-this-song':
      spotifyThis(functionData);
      break;
    default:
      console.log('LIRI doesn\'t know what that is');
  }
}

var run = function(argOne, argTwo) {
  choose(argOne, argTwo);
};

run(process.argv[2], process.argv[3]);