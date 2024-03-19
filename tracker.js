var port = chrome.runtime.connect({ name: "gracker" });
var video = document.querySelector("video.jw-video");
var params = new URLSearchParams(document.URL);
console.log("url params");
console.log(params);
var currentTime = 0.0; // TODO: get this initial value from background
var currentVolume = parseFloat(0.5).toFixed(1); // TODO: get this initial value from background

if (video) {
  // this event is first triggered when video starts playing
  video.addEventListener("playing", (_) => {
    // TODO: player has started, seek to currentTime
    console.log("playing!");
    if (video.volume != currentVolume) {
      video.volume = currentVolume;
    }

    if (video.currentTime < currentTime) {
    }
  });

  // this event is triggered when user hits play
  video.addEventListener("play", (_) => console.log("play"));

  video.addEventListener(
    "timeupdate",
    (_) => (currentTime = video.currentTime),
  );

  port.onMessage.addListener((message) => {
    console.log("received message from background");
    console.log(message);

    if (params.get("season")) {
      if (!message["shows"]) {
        message["shows"] = [];
      }

      var shows = message["shows"];

      if (shows.length > 0) {
        for (var i = 0; i < shows.length; ++i) {
          if (shows[i].url == document.URL) {
            // do checks to find out if we are on the latest episode
          }
        }
      } else {
        shows.push({
          title: document.querySelector("div.movie-info h1").innerText,
          currSeason: params.get("season"),
          currEpisode: params.get("episode"),
          url: document.URL,
          timestamp: currentTime,
          volume: currentVolume,
        });
      }
    } else {
      if (!message["movies"]) {
        message["movies"] = [];
      }

      var movies = message["movies"];

      if (movies.length > 0) {
        for (var i = 0; i < movies.length; ++i) {
          if (movies[i].url == document.URL) {
            // record found
            // do the necessary updates
          }
        }
      } else {
        movies.push({
          title: document.querySelector("div.movie-info h1").innerText,
          timestamp: currentTime,
          volume: currentVolume,
          url: document.URL,
        });
      }
    }

    console.log(message);
  });

  // TODO: can also track volume and send info back to background
  //video.addEventListener("volumechange", ()=>{});

  // user is exiting, send data to background
  window.addEventListener("beforeunload", (_) => {
    console.log("user unloading page, send back latest timestamp");
    port.postMessage({ timestamp: currentTime });
  });

  // this event is triggered when user pauses
  video.addEventListener("pause", (_) => console.log("paused."));
} else {
  console.log("Could not find video element!");
}
