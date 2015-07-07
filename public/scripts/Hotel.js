var Hotel;

$(document).ready(function () {
	Hotel = function (data) {
		var self = this;
		eachKeyValue(data, function (key, val) {
			self[key] = val;
		});
		if (currentDay.hotel) {
			currentDay.hotel.delete();
		}
		this.buildMarker()
			.drawMarker()
			.buildItineraryItem()
			.drawItineraryItem();
		currentDay.hotel = this;
	}

	Hotel.prototype = generateAttraction({
		icon: '/images/lodging_0star.png',
		$listGroup: $('#my-hotel .list-group'),
		$all: $('#all-hotels'),
		all: all_hotels,
		attraction: "hotel",
		constructor: Hotel
	});

	Hotel.prototype.delete = function () {
		$.ajax({
			type: "DELETE",
			url:"/days/" + currentDay.id + "/hotel",
			success: function (responseData) {
				console.log(responseData);
			}
		});
		currentDay.hotel
			.eraseMarker()
			.eraseItineraryItem();
		currentDay.hotel = null;
	};
});