require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
app.get("/", (request, response) => {
  response.render("home");
});

app.get("/artist-search-results", (request, response) => {
  const artist = request.query.term;
  console.log(artist);
  spotifyApi.searchArtists(artist)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      response.render("artist-search-results",{artist: data.body.artists.items});
    })
    .catch((err) => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (request, response) => {
  const artistId = request.params
  console.log(artistId)
  response.render("album");
  // spotifyApi.getArtistAlbums(albums)
  //   .then((data) => {
  //     console.log("The received data from the API: ", data.body);
  //     response.render("albums/artistId",{artist: data.body});
  //   })
  //   .catch((err) => {
  //     console.log("The error while searching artists occurred: ", err);
  //   });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
