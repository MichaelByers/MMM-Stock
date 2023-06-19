"use strict";

Module.register("MMM-Stock", {
	result: {},
	defaults: {
		updateInterval: 1800000, // 500 calls per month limit
		fadeSpeed: 1000,
		companies: "GOOGL,YHOO",
		currency: "usd",
		separator: "&nbsp;&nbsp;•&nbsp;&nbsp;",
		baseURL: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes",
		host: "apidojo-yahoo-finance-v1.p.rapidapi.com",
		region: "US",
		lang: "en"
	},

    // Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	getStyles: function() {
		return ["MMM-Stock.css"];
	},

	getTranslations: function() {
		return false;
	},

	start: function() {
		console.log('Starting module: ' + this.name);
		this.getStocks();
		this.scheduleUpdate();
	},

	getDom: function() {
		var wrapper = document.createElement('marquee');
        var separator = this.config.separator;
		var count = 0;
		var _this = this;
		wrapper.className = 'medium bright';
		var data = this.result;
		var size = Object.keys(data).length;
		// the data is not ready
		if(Object.keys(data).length === 0 && data.constructor === Object){
			return wrapper;
		}

		//if another currency is required - usd is default
		var differentCurrency = false;
		if(this.config.currency.toLowerCase() != "usd"){
			differentCurrency = true;
			var requiredCurrency = this.config.currency.toUpperCase();
		}

        data.forEach(function(key) {
			var symbolElement = document.createElement('span');
			var priceElement = document.createElement('span');
			var changeElement = document.createElement('span');

			var symbol = key.symbol;
			var price = key.regularMarketPrice;
			var change = key.regularMarketChange;
			var perc = key.regularMarketChangePercent;

			//debug
			console.log("[STOCK] reading " + symbol);

			if (symbol == "^GSPC") {symbol = "S&P500";}
			else if (symbol == "^DJI") {symbol = "DOW";}
			else if (symbol == "^IXIC") {symbol = "NASDAQ";}

			symbolElement.className = 'stock__stock--symbol';
			priceElement.className = 'stock__stock--price';
			changeElement.className = 'stock__stock--change';
			symbolElement.innerHTML = symbol + ' ';
			wrapper.appendChild(symbolElement)

			priceElement.innerHTML = '$' + _this.formatMoney(price, 2, '.', ',');

			if (change > 0) {
				changeElement.classList += ' up';
			} else {
				changeElement.classList += ' down';
			}
			changeElement.innerHTML = ' ' + _this.formatMoney(change, 2, '.', ',') + ' (' + _this.formatMoney(perc, 2, '.', ',') + '%)';

			var divider = document.createElement('span');

			if (count < (size - 1)){
				divider.innerHTML = separator;
			}

			wrapper.appendChild(priceElement);
			wrapper.appendChild(changeElement);
			wrapper.appendChild(divider);
			count++;

		});

		return wrapper;
	},

	formatMoney: function (amount, decimalCount, decimal, thousands) {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            var negativeSign = amount < 0 ? '-' : '';

            var i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            var j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : '');
        } catch (e) {
            throw new Error(e);
        }
    },

    roundValue: function (value) {
        return Math.round(value * 100) / 100;
    },

	scheduleUpdate: function(delay) {
		var loadTime = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			loadTime = delay;
		}

		var that = this;
		setInterval(function() {
			that.getStocks();
		}, loadTime);
	},

	getStocks: function () {
		var urls = [];
		var options = {
			method: 'get',
			url: this.config.baseURL,
			params: {region: this.config.region, lang: this.config.lang, symbols: this.config.companies},
			headers: {
			  'x-rapidapi-host': this.config.host,
			  'x-rapidapi-key': this.config.apikey,
			  useQueryString: true
			}
		  };

        urls.push(options);
		// only get stocks in trading hours, to conserve # api calls
		var hour = moment().hour();
		var day = moment().day();

		if( (hour >= 7) && (hour <=17) && (day != 0) && (day != 6) ) {
			this.sendSocketNotification("GET_STOCKS", urls);
		}
	},

	getExchangeRate: function () {
		var url = this.config.baseURL + "?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20('USD" + this.config.currency + "')&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="
		this.sendSocketNotification("GET_EXCHANGE_RATE", url);
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "STOCK_RESULT") {
			this.result = payload.quoteResponse.result;
			this.updateDom(self.config.fadeSpeed);
		} else if(notification === "EXCHANGE_RATE"){
			this.rate = payload;
		}
	}
});
