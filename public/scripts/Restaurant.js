var Restaurant;

$(document).ready(function () {
	Restaurant = function (data) {
		var self = this;
		eachKeyValue(data, function (key, val) {
			self[key] = val;
		});
		this.buildMarker()
			.drawMarker()
			.buildItineraryItem()
			.drawItineraryItem();
		currentDay.restaurants.push(this);
	}

	Restaurant.prototype = generateAttraction({
		icon: '/images/restaurant.png',
		$listGroup: $('#my-restaurants .list-group'),
		$all: $('#all-restaurants'),
		all: all_restaurants,
		attraction: "restaurants",
		constructor: Restaurant
	});

	Restaurant.prototype.delete = function () {
		var index = currentDay.restaurants.indexOf(this);
		$.ajax({
			type: "DELETE",
			url: "/days/" + currentDay.id + "/restaurant/" + currentDay.restaurants[index],
			success: function(responseData){
				console.log(responseData);
			}
		});
		var removed = currentDay.restaurants.splice(index, 1)[0];
		removed
			.eraseMarker()
			.eraseItineraryItem();
	};
});