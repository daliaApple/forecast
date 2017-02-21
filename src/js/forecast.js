
var forecastUI = (function() {

	function displayForecastData() {
		$("#apiData").append(" <i class=\"fa fa-circle-o-notch fa-spin\"></i> Loading... ");
		forecastBehavior.getLocationAndForecastData(function(position) {
			forecastUI.showPositionForecastData(position);
        },
		function(message) {
			$("#apiData").text(message);
		});
	}

	function showPositionForecastData(position) {
		var currentLatitude = position.coords.latitude;
		var currentLongitude = position.coords.longitude;
		forecastBehavior.getForecastData(currentLatitude, currentLongitude, function(data) {
			forecastUI.displayData(data, 5);
        },
		function(message) {
			$("#apiData").text(message);
		});
	}

	function displayData(data, numOfDaysToDisplay) {
		$("#apiData").html('<div class="row">');
		for (var i = 0; i < numOfDaysToDisplay; i++) {
			var dayData = data.daily.data[i];
			var appendObject = "<div class='col-md-4 panel panel-primary'>";
			appendObject += "<div class='panel-heading'>";
			appendObject += "<h3 class='panel-title'>" + moment(dayData.time * 1000).format('MM/DD/YYYY') + "</h3></div>";
			appendObject += "<div class='panel-body'>";
			appendObject += "<ul class='list-group'>";
			appendObject += "<li class='list-group-item'><img src='/svg/" + dayData.icon + ".svg'/></li>";
			appendObject += "<li class='list-group-item'>" + dayData.summary + "</li>";
			appendObject += "<li class='list-group-item'>Temperature: " + Math.round(dayData.temperatureMax) + "° - " + Math.round(dayData.temperatureMin) + "°</li>";
			appendObject += "</ul></div></div>";
			$("#apiData").append(appendObject);
		}
		$("#apiData").append('</div>');
	}

	var api = {
        displayForecastData: displayForecastData,
		showPositionForecastData: showPositionForecastData,
		displayData: displayData
    };

    return api;
	
})();

var forecastBehavior = (function() {
   
	function getForecastData(latitude, longitude, onSuccess, onError) {
		$.ajax({
            type: 'GET',
            dataType: 'jsonp',
            cache: false,
            url: 'https://api.darksky.net/forecast/c346f07763411b8a86bd8d708a7c2312/' + latitude + ',' + longitude,
            success: function (data) {
				onSuccess(data);
            },
            error: function (xhr, textStatus, errorThrown) {
				onError("Failed to get weather information.");
            }
        });
	}

	function getLocationAndForecastData(onSuccess, onError) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(onSuccess);
		} else {
			onError("Need your current location to show weather forecast.");
		}
	}

    var api = {
        getForecastData: getForecastData,
		getLocationAndForecastData: getLocationAndForecastData
    };

    return api;

})();

//for testing
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	module.exports = {
		forecastUI,
		forecastBehavior
	};
}
