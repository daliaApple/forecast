// setup jquery
var jsdom = require("jsdom");
var window = jsdom.jsdom().defaultView;
var $ = global.$ = require("../bower_components/jquery/dist/jquery.js")(window);
global.moment = require("../src/js/moment.js")

// load forecast
var forecast = require("../src/js/forecast.js");

var testData = {
    latitude: 47.6420172,
    longitude: -122.0988803,
    daily: {
        summary: "Mixed precipitation throughout the week, with temperatures peaking at 52°F on Friday.",
        icon: "rain",
        data: [{
            time: 1487577600,
            summary: "Rain until evening.",
            icon: "rain",
            temperatureMin: 39.3,
            temperatureMax: 44.42,
        }, {
            time: 1487664000,
            summary: "Light rain starting in the afternoon.",
            icon: "rain",
            temperatureMin: 36.46,
            temperatureMax: 49.53,
        }, {
            time: 1487750400,
            summary: "Light rain throughout the day.",
            icon: "rain",
            temperatureMin: 34.64,
            temperatureMax: 46.28,
        }, {
            time: 1487836800,
            summary: "Mostly cloudy until afternoon.",
            icon: "partly-cloudy-day",
            temperatureMin: 30.43,
            temperatureMax: 47.69,
        }, {
            time: 1487923200,
            summary: "Mostly cloudy throughout the day.",
            icon: "partly-cloudy-day",
            temperatureMin: 29.71,
            temperatureMax: 51.56,
        }, {
            time: 1488009600,
            summary: "Clear throughout the day.",
            icon: "clear-day",
            temperatureMin: 26.21,
            temperatureMax: 48.82,
        }, {
            time: 1488096000,
            summary: "Flurries overnight.",
            icon: "snow",
            temperatureMin: 26.03,
            temperatureMax: 48.8,
        }, {
            time: 1488182400,
            summary: "Light snow in the morning.",
            icon: "snow",
            temperatureMin: 25.6,
            temperatureMax: 43.66,
        }]
    }
};

describe("forecast UI", function () {

    var div;
    var forecastBehaviorSpy;
    var forecastUISpy;
    var coordinates = {
        latitude: 47.6420172,
        longitude: -122.0988803
    };
    var testPosition = {
        coords: coordinates
    };


    beforeEach(function () {
        $('body').html('<div id="apiData"></div>');
    });

    describe("displayForecastData function", function () {

        it("should call the getLocationAndForecastData function", function () {
            spyOn(forecast.forecastBehavior, "getLocationAndForecastData");

            forecast.forecastUI.displayForecastData();

            expect(forecast.forecastBehavior.getLocationAndForecastData).toHaveBeenCalled();
        });

        it("should show loading icon", function () {
            spyOn(forecast.forecastBehavior, "getLocationAndForecastData");

            forecast.forecastUI.displayForecastData();

            expect($("#apiData").html()).toBe(" <i class=\"fa fa-circle-o-notch fa-spin\"></i> Loading... ");
        });

        it("should show error on error", function () {
            var errorMsg = "error!";
            spyOn(forecast.forecastBehavior, "getLocationAndForecastData").and.callFake(function (onSuccess, onError) {
                onError(errorMsg);
            });

            forecast.forecastUI.displayForecastData();

            expect($("#apiData").text()).toBe(errorMsg);
        });

        it("should call showPositionForecastData function on success", function () {
            spyOn(forecast.forecastUI, "showPositionForecastData");

            spyOn(forecast.forecastBehavior, "getLocationAndForecastData").and.callFake(function (onSuccess, onError) {
                onSuccess(testPosition);
            });

            forecast.forecastUI.displayForecastData();

            expect(forecast.forecastUI.showPositionForecastData).toHaveBeenCalled();
            expect(forecast.forecastUI.showPositionForecastData.calls.mostRecent().args[0]).toEqual(testPosition);
        });

    });

    describe("showPositionForecastData function", function () {

        it("should call the getForecastData function", function () {
            spyOn(forecast.forecastBehavior, "getForecastData");

            forecast.forecastUI.showPositionForecastData(testPosition);

            expect(forecast.forecastBehavior.getForecastData).toHaveBeenCalled();
        });


        it("should show error on error", function () {
            var errorMsg = "error!";
            spyOn(forecast.forecastBehavior, "getForecastData").and.callFake(function (latitude, longitude, onSuccess, onError) {
                onError(errorMsg);
            });

            forecast.forecastUI.showPositionForecastData(testPosition);

            expect($("#apiData").text()).toBe(errorMsg);
        });

        it("should call showPositionForecastData function on success", function () {
            spyOn(forecast.forecastUI, "displayData");

            spyOn(forecast.forecastBehavior, "getForecastData").and.callFake(function (latitude, longitude, onSuccess, onError) {
                onSuccess(testData);
            });

            forecast.forecastUI.showPositionForecastData(testPosition);

            expect(forecast.forecastUI.displayData).toHaveBeenCalled();
            expect(forecast.forecastUI.displayData.calls.mostRecent().args).toEqual([testData, 5]);
        });

    });

    describe("displayData function", function () {

       it("should show data", function () {

            forecast.forecastUI.displayData(testData, 5);

            for (var i = 0; i < 5; i++) {
			    var dayData = testData.daily.data[i];
                expect($("#apiData").html()).toContain(dayData.summary);
                expect($("#apiData").html()).toContain(Math.round(dayData.temperatureMin));
                expect($("#apiData").html()).toContain(Math.round(dayData.temperatureMax));
            }
        });

    });

    afterEach(function () {
        $('body').html('');
    });
});
