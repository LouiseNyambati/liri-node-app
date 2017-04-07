var keys = require("./keys.js");
var fs = require('fs'); //file system
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');



//Creates a function for finding artist name from spotify
var getArtists = function(artist) {
  return artist.name;
};

//Function for finding songs on Spotify
var spotifyThis = function(songName) {
  // If theres no song then load The Sign by Ace of Base
  if (songName === undefined) {
    songName = 'The Sign';
  };

  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      console.log(err);
      return;
    }

    var songs = data.tracks.items;
    var data = []; //empty array to hold data

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
  var client = new twitter(keys.twitterKeys);

  var params = { screen_name: 'Louisemoraan', count: 20 };

  client.get('statuses/user_timeline', params, function(error, tweets, response) {

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

var getMeMovie = function(movieName) {

  if (movieName === undefined) {
    movieName = 'Mr Nobody';
  }

  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = [];
      var movieData = JSON.parse(body);

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

var pick = function(caseData, functionData) {
  switch (caseData) {
    case 'movie-this':
      getMeMovie(functionData);
      break;
    case 'my-tweets':
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

//run this on load of js file
var run = function(argOne, argTwo) {
  pick(argOne, argTwo);
};

run(process.argv[2], process.argv[3]);