The app [is **live** on Heroku!](http://stormy-beach-93992.herokuapp.com/)

Welcome to this lightweight **Single Page Application**. Most of the work is handled in the frontend by **Javascript** and **jQuery**; a **Sinatra** server exists purely for hiding API keys by relaying 3rd-party API **ajax** calls while injecting the appropriate access token. Enjoy the fantastic pictures!

### Notable Quirks... *ahem* Features

  - Uses a modified mapbox SDK that reroutes all API calls via local server (mapbox.2.3.0.js:32)
  - The server is purely for hiding API keys... ok, and rendering partials
  - Almost all data is rendered client-side
  - The entire app is <1MB
  - My first JS project, woohoo!!

### Technology

  - JavaScript
  - jQuery
  - ajax
  - Sinatra
  - 500px API
  - mapbox SDK
  - Bulma CSS framework
  - CSS::flexbox
  - Heroku PaaS
  - PostgreSQL
  - Emmet
  - Atom::vim
