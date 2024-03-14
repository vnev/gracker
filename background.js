chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.storage.local.set({ db: { movies: {}, shows: {} } }).then(() => {
      console.log("Initialized database.");
      // todo: Debug, remove
      chrome.storage.local.get(["db"]).then((data) => {
        console.log(data);
      });
    });
  }
});

chrome.webRequest.onCompleted.addListener(
  (completedRequest) => {
    let url = completedRequest.url;

    // lets get the current session ID from cookies
    loadSessionToken();
    // we now have the latest session ID
    // store episode information in local storage
    // if this is the first time watching show/movie,
    // store it as a new object
    // else, update object if the timestamp surpasses our saved timestamp
    // and also season/episode if its a serie

    // let video = document.getElementsByClassName("jw-video")[0] should give us the video player
    // `video.currentTime` should give us the current timestamp of the video
    // we can also set the time: `video.currentTime = <time>` to seek
    let params = url.split("?")[1];
    params = new URLSearchParams(params);
  },
  {
    urls: ["*://*.gramaton.io/movies/getMovieLink*"],
  },
);

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
    console.log("time: " + message.timestamp);
    port.postMessage({ status: "received" });
  });
});

chrome.webRequest.onCompleted.addListener(
  (completedRequest) => {
    let url = completedRequest.url;
    //console.log(completedRequest);
    // lets get the current session ID from cookies
    console.log("completed request");
    console.log(completedRequest);
  },
  {
    urls: ["*://*.gramaton.io/series/getTvLink*"],
  },
);

// inject our tracker script when media is streaming
chrome.webRequest.onResponseStarted.addListener(
  (completedRequest) => {
    let url = completedRequest.url;
    chrome.scripting
      .executeScript({
        target: { tabId: completedRequest.tabId },
        files: ["tracker.js"],
      })
      .then(() => {
        console.log("sending current data to ");
      });
  },
  {
    urls: ["*://sv2.gramaton.io/tv/*", "*://sv2.gramaton.io/mv/*"],
  },
);

async function loadSessionToken() {
  const cookie = await chrome.cookies.get({
    url: "https://gramaton.io",
    name: "PHPSESSID",
  });

  if (cookie !== null) {
    chrome.storage.local.set({ db: { cookie: cookie } }).then(() => {
      console.log("saved " + cookie + " to localstorage");
    });
    console.log(cookie);
  } else {
    console.log("no cookie found!");
  }
}
