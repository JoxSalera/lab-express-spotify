require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
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

// Functions
async function searchArtists(request, response, next) {
  let { q } = request.query;

  try {
    data = await spotifyApi.searchArtists(q);
    console.log(
      "Received data from the API: ",
      data.body.artists.items[0].images[0]
    );
    const artists = data.body.artists.items;
    response.render("artist-search-results.hbs", { artists });
  } catch (error) {
    console.log("Error while searching artists occurred: ", error);
  }
}

async function getArtistAlbums(request, response, next) {
  let id = request.params.artistId;
  console.log(id);

  try {
    data = await spotifyApi.getArtistAlbums(id);
    console.log("Album info", data.body.items);
    const albums = data.body.items;
    response.render("albums.hbs", { albums });
  } catch (error) {
    console.log("Error while searching artists occurred: ", error);
  }
}

async function getAlbumsTracks(request, response, next) {
  let id = request.params.albumId;
  console.log(id);

  try {
    data = await spotifyApi.getAlbumTracks(id);
    console.log("Tracks info", data.body.items);
    const tracks = data.body.items;
    response.render("tracks.hbs", { tracks });
  } catch (error) {
    console.log("The error while searching artists occurred: ", error);
  }
}

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/artist-search", searchArtists);
app.get("/albums/:artistId", getArtistAlbums);
app.get("/tracks/:albumId", getAlbumsTracks);

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
