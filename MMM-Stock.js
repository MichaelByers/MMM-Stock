"use strict";

Module.register("MMM-Stock", {
	result: {},
	defaults: {
		updateInterval: 60000,
		fadeSpeed: 1000,
		companies: ["GOOGL", "YHOO"],
		currency: "usd",
		separator: "&nbsp;&nbsp;•&nbsp;&nbsp;",
		baseURL: "https://www.alphavantage.co/",
		apikey: "IPWULBT54Y3LHJME"
	},

	getStyles: function() {
		return ["MMM-Stock.css"];
	},

	getTranslations: function() {
		return false;
	},

	start: function() {
		this.getStocks();
		if(this.config.currency.toLowerCase() != "usd"){
			this.getExchangeRate();
		}
		this.scheduleUpdate();
	},

	getDom: function() {
		var wrapper = document.createElement('marquee');
        var separator = this.config.separator;
		var count = 0;
		
		wrapper.className = 'medium bright';
//		var list = document.createElement("ul");

		var data = this.result;
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

		for (var key in data) {
			if (!data.hasOwnProperty(key)) {continue;}
			var symbolElement = document.createElement('span');
			var priceElement = document.createElement('span');
			var changeElement = document.createElement('span');

			var symbol = key;
			var obj = data[key];
			var current = obj[0];
			var prev = obj[1];
			var price = current["4. close"];
			var change = prev["4. close"] - current["4. close"];

			symbolElement.className = 'stock__stock--symbol';
			priceElement.className = 'stock__stock--price';
			changeElement.className = 'stock__stock--change';
			symbolElement.innerHTML = symbol + ' ';
			wrapper.appendChild(symbolElement);


			priceElement.innerHTML = '$' + _this.formatMoney(price, 2, '.', ',');

			if (change > 0) {
				changeElement.classList += ' up';
			} else {
				changeElement.classList += ' down';
			}

			changeElement.innerHTML = ' ' + change;

			var divider = document.createElement('span');

			if (count < _this.result.length - 1){
				divider.innerHTML = separator;
			}

			wrapper.appendChild(priceElement);
			wrapper.appendChild(changeElement);
			wrapper.appendChild(divider);
			count++;
	
		}

		return wrapper;
	},

	scheduleUpdate: function(delay) {
		var loadTime = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			loadTime = delay;
		}

		var that = this;
		setInterval(function() {
			that.getStocks();
			if(this.config.currency.toLowerCase() != "usd"){
				that.getExchangeRate();
			}
		}, loadTime);
	},

	getStocks: function () {
		var allCompanies = this.config.companies;
		var urls = [];
		for(var company in allCompanies){
			var url = this.config.baseURL + "query?function=TIME_SERIES_DAILY&outputsize=compact&symbol=" + allCompanies[company] + "&apikey=" + this.config.apikey;
			urls.push(url);
		}
		this.sendSocketNotification("GET_STOCKS", urls);
	},

	getExchangeRate: function () {
		var url = this.config.baseURL + "?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20('USD" + this.config.currency + "')&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="
		this.sendSocketNotification("GET_EXCHANGE_RATE", url);
	},
	socketNotificationReceived: function(notification, payload) {
		if (notification === "STOCK_RESULT") {
			this.result = payload;
			this.updateDom(self.config.fadeSpeed);
		} else if(notification === "EXCHANGE_RATE"){
			this.rate = payload;
		}
	}
});