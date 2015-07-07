var Day;

$(document).ready(function () {
	Day = function (number) {
		this.hotel = null;
		this.restaurants = [];
		this.thingsToDo = [];
		if(number){
			this.number = number;
			days.push(this);
		}else{
			var postId = function (responseData) {
				this.id = responseData._id;
			};
			this.number = days.push(this);
			$.post('/days', {number: this.number}, postId.bind(this) );
		}
		this.buildButton()
			.drawButton();
	}

	Day.prototype.populate = function (data){
		this.id = data._id;
		this.hotel = data.hotel ? new Hotel(data.hotel) : null;
		this.restaurants = data.restaurants.map(function (restaurantId) { return new Restaurant(restaurantId) });
		this.thingsToDo = data.thingsToDo.map(function (thingId) { return new ThingToDo(thingId) });
	}

	Day.prototype.buildButton = function () {
		this.$button = $('<button class="btn btn-circle day-btn"></button>').text(this.number);
		var self = this;
		this.$button.on('click', function () {
			self.switchTo();
		});
		return this;
	};

	Day.prototype.drawButton = function () {
		var $parent = $('.day-buttons');
		this.$button.appendTo($parent);
		return this;
	};

	Day.prototype.eraseButton = function () {
		this.$button.detach();
		return this;
	};

	Day.prototype.switchTo = function () {
		function eraseOne (attraction) {
			attraction.eraseMarker().eraseItineraryItem();
		}
		if (currentDay.hotel) eraseOne(currentDay.hotel);
		currentDay.restaurants.forEach(eraseOne);
		currentDay.thingsToDo.forEach(eraseOne);

		function drawOne (attraction) {
			attraction.drawMarker().drawItineraryItem();
		}
		if (this.hotel) drawOne(this.hotel);
		this.restaurants.forEach(drawOne);
		this.thingsToDo.forEach(drawOne);

		currentDay.$button.removeClass('current-day');
		this.$button.addClass('current-day');
		$('#day-title > span').text('Day ' + this.number);
		currentDay = this;
	};

	function deleteCurrentDay () {
		if (days.length > 1) {
			$.ajax({
				type: "DELETE",
				url: "/days/" + currentDay.id,
				success: function(responseData){
					console.log("deleted: ", responseData);
				}
			});
			var index = days.indexOf(currentDay),
				previousDay = days.splice(index, 1)[0],
				newCurrent = days[index] || days[index - 1];
			days.forEach(function (day, idx) {
				day.number = idx + 1;
				$.post("/days/" + day.id + "/number", {number: day.number}, function(responseData){
					console.log(responseData);
				});
				day.$button.text(day.number);
			});
			newCurrent.switchTo();
			previousDay.eraseButton();
		}
	};

	$('#add-day').on('click', function () {
		new Day();
	});

	$('#day-title > .remove').on('click', deleteCurrentDay);
});
