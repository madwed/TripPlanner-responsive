function eachKeyValue (obj, onEach) {
	Object.keys(obj).forEach(function (key) {
		onEach(key, obj[key])
	});
}

var days, currentDay;

$(document).ready(function () {
	days = [];
	$.get("/days", function (responseData, textStatus) {
		if(textStatus !== "success" || responseData.length === 0){
			console.log("database get error: ", textStatus);
			currentDay = new Day();
		}else{
			console.log("days from database: ", responseData);
			responseData.forEach(function(dayDoc){
				if(!currentDay){
					currentDay = new Day(dayDoc.number);
					currentDay.populate(dayDoc);
				}else{
					var newDay = new Day(dayDoc.number);
					newDay.switchTo();
					newDay.populate(dayDoc);
				}
			});
		}
		currentDay.$button.addClass('current-day');
	});
});