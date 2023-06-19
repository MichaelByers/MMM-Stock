var NodeHelper = require("node_helper");
var axios = require('axios').default;
var moment = require("moment");

module.exports = NodeHelper.create({
	start: function () {
		console.log(this.name + " helper method started...");
	},

	sendRequest: function (urls) {
		var self = this;
		console.log( "[MMM-Stock] " + moment().format("D-MMM-YY HH:mm") + " making URL calls" );
		//urls is an array of options, only using 1 for now
		axios(urls[0])
			.then(function (response) {
				if (response.status == 200) {
					self.sendSocketNotification("STOCK_RESULT", response.data);
				}
			})
			.catch(function (error) {
				// handle error
				console.log( "[MMM-Stock] " + moment().format("D-MMM-YY HH:mm") + " Request " + error );
		});
	},

	sendExchangeRate: function (url) {
		var self = this;

		axios.get(url)
			.then(function (response) {
			if (response.status == 200) {
				self.sendSocketNotification("EXCHANGE_RATE", response.data);
			}
			})
			.catch(function (error) {
				// handle error
				console.log( "[MMM-Stock] Exchange Rate " + moment().format("D-MMM-YY HH:mm") + " Exchange " + error );
			});

	},

	//Subclass socketNotificationReceived received.
	socketNotificationReceived: function(notification, urls) {
		if (notification === "GET_STOCKS") {
//			console.log( "[MMM-Stock] " + moment().format("D-MMM-YY HH:mm") + " sending requests: "+JSON.stringify(urls, null, 4) );
			this.sendRequest(urls);
		} else if(notification === "GET_EXCHANGE_RATE"){
			this.sendExchangeRate(urls);
		}
	}
});
