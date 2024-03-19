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
  },
  {
    urls: ["*://*.gramaton.io/movies/getMovieLink*"],
  },
);

chrome.runtime.onConnect.addListener((port) => {
  chrome.storage.local.get(["db"]).then((result) => {
    console.log("sending db");
    port.postMessage(result["db"]);
  });

  port.onMessage.addListener((message) => {
    console.log("time: " + message.timestamp);
    port.postMessage({ status: "received" });
  });
});

chrome.webRequest.onCompleted.addListener(
  (completedRequest) => {
    let url = completedRequest.url;
    // lets get the current session ID from cookies
    console.log("completed request");
    console.log(completedRequest);

    let params = new URLSearchParams(url);
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
        console.log("sending current data to worker");
      });
  },
  {
    urls: ["*://sv2.gramaton.io/tv/*", "*://sv2.gramaton.io/mv/*"],
  },
);
