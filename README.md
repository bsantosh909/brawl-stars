# @statscell/brawl

Node.js client for working with brawl stars API.

## Usage

Install the package using:

```bash
npm install @statscell/brawl
```

Use the package as:

```js
import { Client } from '@statscell/brawl';
// OR
const { Client } = require('@statscell/brawl');

// token can be obtained from https://developers.brawlstars.com/
const client = new Client({ token: 'token-from-dev-portal' });

client.getPlayer('YJ0LVRQQ')
  .then((player) => {
   console.log(`${player.name} - ${player.tag}`);
  })
  .catch((err) => console.log(err));
```

The above example is just a basic example. You can do lot more with the package.

## Available Methods

- `Client`**.getPlayer(playerTag)**
  - Get information about specified player tag.

- `Client`**.getPlayerBattles(playerTag)**
  - Get battles of specified player tag.

- `Client`**.getClub(clubTag)**
  - Get information about specified club tag.

- `Client`**.getClubMembers(clubTag)**
  - Get members of specified club tag.

- `Client`**.getBrawlers()**
  - Get information about all the brawlers.

- `Client`**.getBrawler(brawlerId)**
  - Get information about the specified brawler.

- `Client`**.getClubRankings(country, Options)**
  - Get club rankings for specified country.
  - `country` is optional. If not specified is default to **global**

- `Client`**.getPlayerRankings(country, Options)**
  - Get player rankings for specified country.
  - `country` is optional. If not specified is default to **global**
  
- `Client`**.getBrawlerRankings(brawlerId, country, Options)**
  - Get club rankings for specified country.
  - `country` is optional. If not specified is default to **global**

- `Client`**.getPowerPlayRankings(brawlerId, country, Options)**
  - Get powerplay rankings for specified country.
  - `country` is optional. If not specified is default to **global**

- `Client`**.getPowerPlaySeasons(country, Options)**
  - Get powerplay seasons.
  - `country` is optional. If not specified is default to **global**

### Search Options

Options to filter search result..

- `limit`: **number** -> No. of items to return.
- `before`: **string** -> Return only items that occur before this marker.
- `after`: **string** -> Return only items that occour after this marker.
