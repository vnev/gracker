# Gramaton Tracker

Chrome extension to track the progress of your current movies and TV shows on Gramaton.io

### Background Script Data Layout

The data communicated between the background and injected script has a particular layout. To start with, this is the layout used.

```
{
  db: {
    movies: [{
      title: "",
      timestamp: 0.0,
      volume: 0.0,
      url: "",
    }],

    shows: [{
      title: "",
      currSeason: 1,
      currEpisode: 1,
      url: "", <-- url to latest episode
      timestamp: 0.0,
      volume: 0.0,
      totalSeasons: 1,
      totalEpisodes: 1,
    }]
  }
}
```

Layout will probably change as I add more features.

### Things to note

A lot of event listeners and web request listeners in both the background and injected scripts rely on a particular URL layout that Gramaton uses, and if Gramaton were to change their base URL or one of their media URLs, things in the extension would need to be changed in order to continue accurate tracking.
