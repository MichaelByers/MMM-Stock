# Magic Mirror Module Stocks
The `stocks` module is a <a href="https://github.com/MichMich/MagicMirror">MagicMirror</a> addon.
This module displays a scrolling stocks ticker on your MagicMirror.

## ℹ️ How to use this module
1. clone this repo with the following command: `git clone https://github.com/Elaniobro/MMM-stocks.git`
1. install all the npm modules with either `yarn install` or `npm install`
1. update your [Magic Mirror Config](https://github.com/MichMich/MagicMirror/blob/master/config/config.js.sample), by adding the following object:
To use this module, add it to the modules array in the `config/config.js` file:

````javascript
modules: [
  {
    module: 'MMM-stocks',
        position: 'bottom_bar',
    config: {
      apiKey: 'YOUR_KEY_GOES_HERE', // api token from https://cloud.iexapis.com
      crypto: 'BTCUSDT,LTCUSDT,ETHUSDT', // crypto symbols
      separator: '&nbsp;&nbsp;•&nbsp;&nbsp;', // separator between stocks
      stocks: 'MSFT,AAPL,GOOG,INTC', // stock symbols
      updateInterval: 37000 // update interval in milliseconds
    }
  }
]
````
1. enjoy!

## 🛠️ Config
* `module` the name of the module you are installing.
* `position` where you want the mmm-nyc-transit module to appear. (**note: works best on bottom**)
* `apiKey` see [iexapis api Key](#🔑-iexapis-api-Key) on where to obtain yours
* `crypto` crypto stock symbols
  * must add USDT to the end of crypto symbol.
  * ex: `BTC` + `USDT` = `BTCUSDT`
* `separator` character(s) you woud like to use between stocks
* `stocks` stock stymbol name
* `updateInterval` default is set to 5 minutes

## 🔑 iexapis API Key:
You will need to sign up for the iexapis cloud API. To get a key, please visit their website: [cloud iexapis](https://cloud.iexapis.com).

## ✨ Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/elaniobro/mmm-stocks/issues)

## 👨🏻 Author
**Elan Trybuch**
* [github](https://www.github.com/elaniobro)
* [twitter](https://www.twitte.com/elaniobro)

**Alex Yakhnin**
* [github](https://github.com/alexyak)

### ⚖️ License
This project is licensed under the MIT License - see the LICENSE.md file for details

### 🙏🏽 Acknowledgments

