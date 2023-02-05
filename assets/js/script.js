let todayEl = $("#today"); // Link todayEl to html section


$("#search-button").on("click", function (event) { // when search button is clicked, run function
  
    $("#today").empty();

    event.preventDefault(); 
// -----------Display Location Searched and Todays Date--------------------------------------
  let location = $("#search-input").val(); // create variable with user search query
  let currentCityAndDate = $("<h2>"); // create a new H2 element
  currentCityAndDate.text(location + " " + "(" + moment().format('L') + ")"); // Add text of user search to new H2 & date
  todayEl.append(currentCityAndDate); // display current city & date on page
      

  let queryURL = // URL to send to the API including key and searched city
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    location +
    "&limit=5&appid=6090686048651d85250d11bb39ac022a";

  $.ajax({ // Get info from API
    url: queryURL,
    method: "GET",
  }).then(function (response) { // Once data is returned run function

    let lat = response[0].lat; // create variable for city lat
    let lon = response[0].lon; // create variable for city lon

    getWeather(lat, lon); // run function using lat and lon as parameters

});

    function getWeather(lat, lon) { // function to get weather data using 
      let weatherURL =
        "http://api.openweathermap.org/data/2.5/forecast?lat=" + // create URL for API using lat and lon for users city search
        lat +
        "&lon=" +
        lon +
        "&appid=6090686048651d85250d11bb39ac022a";

      $.ajax({ // Send URl to API to get weather data 
        url: weatherURL,
        method: "get",
      }).then(function (response) {
        // console.log(response);

        let temp = $("<h4>");
        temp.text(response.list[0].main.temp);
        todayEl.append(temp);
        let wind = $("<h4>");
        wind.text(response.list[0].wind.speed);
        todayEl.append(wind);
        let humidity = $("<h4>");
        humidity.text(response.list[0].main.humidity);
        todayEl.append(humidity);



    });


    }
});
