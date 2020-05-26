var NodeHelper = require("node_helper");
var request = require("request");
var async = require("async");

module.exports = NodeHelper.create({
	start: function () {
		console.log(this.name + " helper method started...");
	},

	sendRequest: function (urls) {
		var self = this;

		var results = null;

		async.eachSeries(urls, function(url, done) {
			request(url, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					results = JSON.parse(body);
				}
				done();
			});

		}, function(err) {
			if (err) {
				console.log(this.name + "ERROR: " + err);
				throw err;
			}
			self.sendSocketNotification("STOCK_RESULT", results);
		});
	},

	sendExchangeRate: function (url) {
		var self = this;

		request({ url: url, method: "GET" }, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var result = JSON.parse(body);
				self.sendSocketNotification("EXCHANGE_RATE", result);
			}
		});
	},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, urls) {
		if (notification === "GET_STOCKS") {
			this.sendRequest(urls);
		} else if(notification === "GET_EXCHANGE_RATE"){
			this.sendExchangeRate(urls);
		}
	}
});
