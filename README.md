# brawl-stars

Node.js client for working with brawl stars API.

## Usage

Install the package using:

```bash
npm install brawl-stars
```

Use the package as:

```js
import { Client } from 'brawl-stars';
// OR
const { Client } = require('brawl-stars');

// token can be obtained from https://developers.brawlstars.com/
const client = new Client({ token: 'token-from-dev-portal' });

client.player('YJ0LVRQQ')
  .then((player) => {
   console.log(`${player.name} - ${player.tag}`);
  })
  .catch((err) => console.log(err));
```

The above example is just a basic example. You can do lot more with the package.

## Available Methods

- `Client`**.player(playerTag)**
  - Get information about specified player tag.

- `Client`**.playerBattles(playerTag)**
  - Get battles of specified player tag.

- `Client`**.club(clubTag)**
  - Get information about specified club tag.

- `Client`**.clubMembers(clubTag)**
  - Get members of specified club tag.

- `Client`**.brawlers()**
  - Get information about all the brawlers.

- `Client`**.brawler(brawlerId)**
  - Get information about the specified brawler.

- `Client`**.clubRankings(country, [Options](###%20Search%20Options))**
  - Get club rankings for specified country.
  - `country` is optional. If not specified is default to **global**

- `Client`**.playerRankings(country, [Options](###%20Search%20Options))**
  - Get player rankings for specified country.
  - `country` is optional. If not specified is default to **global**
  
- `Client`**.brawlerRankings(brawlerId, country, [Options](###%20Search%20Options))**
  - Get club rankings for specified country.
  - `country` is optional. If not specified is default to **global**

- `Client`**.powerPlayRankings(brawlerId, country, [Options](###%20Search%20Options))**
  - Get powerplay rankings for specified country.
  - `country` is optional. If not specified is default to **global**

- `Client`**.powerPlaySeasons(country, [Options](###%20Search%20Options))**
  - Get powerplay seasons.
  - `country` is optional. If not specified is default to **global**

### Search Options

Options to filter search result..

- `limit`: **number** -> No. of items to return.
- `before`: **string** -> Return only items that occur before this marker.
- `after`: **string** -> Return only items that occour after this marker.
