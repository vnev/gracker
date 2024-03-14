console.log("script injected...");
console.log(document.querySelector("video.jw-video"));
var port = chrome.runtime.connect({ name: "gracker" });

var video = document.querySelector("video.jw-video");
var currentTime = 0.0; // TODO: get this initial value from background
var currentVolume = parseFloat(0.5).toFixed(1); // TODO: get this initial value from background
if (video) {
  video.volume = currentVolume;
  video.addEventListener("playing", (_) => {
    // TODO: player has started, seek to currentTime
  });

  video.addEventListener(
    "timeupdate",
    (_) => (currentTime = video.currentTime),
  );

  // TODO: can also track volume and send info back to background
  //video.addEventListener("volumechange", ()=>{});

  window.addEventListener("beforeunload", (_) => {
    console.log("user unloading page, send back latest timestamp");
    port.postMessage({ timestamp: currentTime });
  });

  video.addEventListener("pause", (_) => console.log("paused."));
} else {
  console.log("Could not find video element!");
}
