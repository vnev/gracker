console.log("script injected...");
console.log(document.querySelector("video.jw-video"));
var port = chrome.runtime.connect({ name: "gracker" });

var video = document.querySelector("video.jw-video");
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
