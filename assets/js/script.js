moment.locale('en-gb');

let todayEl = $("#today"); // Link todayEl to html section
let searchHistory = []; // empty array for searches
let searchHistoryContainer = $("#history"); // create element for button display area
let clearButton = $("#clear-button");


function displayHistory() {
  // function for creating buttons for previous searched location
  searchHistoryContainer.empty(); // Empty the container of buttons
  for (let i = searchHistory.length - 1; i >= 0; i--) {
    // go through array in reverse order so newest searches are at the top
    let btn = $("<button>"); // create new button
    btn.attr("type", "button"); // assign attribute of type
    btn.attr("class", "history-btn btn"); // assign the element classes
    btn.attr("data-search", searchHistory[i]); // give attribute of data-search
    btn.text(searchHistory[i]); // give the button a text of the searched location
    searchHistoryContainer.append(btn); // add the button to the container
  }

}

function addToHistory(search) {
  // function to add searched place to array
  if (searchHistory.indexOf(search) !== -1) {
    // Check if the search is already in the history
    return;
  }
  searchHistory.push(search); // If its a new search push it to the array
  localStorage.setItem("search-history", JSON.stringify(searchHistory)); // turn it into a string to store in local storage
  displayHistory(); // re-run the display function
}

function getHistory() {
  // get searches from local storage
  let storedHistory = localStorage.getItem("search-history"); // get item from local storage
  if (storedHistory) {
    // Check stored history exists
    searchHistory = JSON.parse(storedHistory); // Convert from string to object
    
  }
  displayHistory(); // re-run the display function
}

getHistory(); // get local storage as soon as page is loaded

function fetchAPI(search) {
  // main function for getting information from the API

  $("#today").empty(); // empty the display area for todays weather

  addToHistory(search); // add the searched location to the searched history array

  let queryURL = // URL to send to the API including key and searched city
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    search +
    "&limit=5&appid=6090686048651d85250d11bb39ac022a";

  $.ajax({
    // Get info from API
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    // Once data is returned run function

    let lat = response[0].lat; // create variable for city lat
    let lon = response[0].lon; // create variable for city lon

    getWeather(lat, lon); // run function using lat and lon as parameters
  });

  // function to get weather data using latitude and longitude
  function getWeather(lat, lon) {
    let weatherURL =
      "http://api.openweathermap.org/data/2.5/forecast?lat=" + // create URL for API using lat and lon for users city search
      lat +
      "&lon=" +
      lon +
      "&appid=6090686048651d85250d11bb39ac022a&units=metric";

    // Send URl to API to get weather data
    $.ajax({
      url: weatherURL,
      method: "get",
    }).then(function (response) {
      let currentCityAndDate = $("<h2>");
      let date = moment().format("L");
      // create a new H2 element
      currentCityAndDate.text(search + " - " + date);
      // fill H2 with searched city and todays date
      let weatherIcon = $("<img>");
      // create image element
      weatherIcon.attr(
        "src",
        `https://openweathermap.org/img/w/${response.list[0].weather[0].icon}.png`
      );
      // add icon from response to new image element
      currentCityAndDate.append(weatherIcon);
      // Add weather icon image to H2 element
      todayEl.append(currentCityAndDate);
      // display H2 in todays weather section

      // Display todays weather data
      let temp = $("<h4>");
      temp.text("Temp: " + response.list[0].main.temp + " °C");
      todayEl.append(temp);
      let wind = $("<h4>");
      wind.text("Wind Speed: " + response.list[0].wind.speed + " mph");
      todayEl.append(wind);
      let humidity = $("<h4>");
      humidity.text("Humidity: " + response.list[0].main.humidity + "%");
      todayEl.append(humidity);

      console.log(response);

      // create area to display forcast
      let cardDisplayEl = $("#forecast");

      cardDisplayEl.empty();

      for (let i = 5; i < response.list.length; i += 8) {
        let card = $("<div>");
        card.attr("class", "card col-sm-12 col-lg");
        card.attr("id", [i]);
        let cardBody = $("<div>");
        cardBody.attr("class", "card-body");
        let cardTitle = $("<h5>");
        cardTitle.attr("class", "card-title");
        let cardTimestamp = response.list[i].dt;
        let cardDate = new Date(cardTimestamp * 1000);
        let icon = $("<img>");
        icon.attr(
          "src",
          `https://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png`
        );
        cardTitle.text(cardDate.toLocaleDateString("en-GB"));
        let cardTemp = $("<p>");
        cardTemp.text("Temp: " + response.list[i].main.temp + "°C");
        let cardWind = $("<p>");
        cardWind.text("Wind Speed: " + response.list[i].wind.speed + " mph");
        let cardHumidity = $("<p>");
        cardHumidity.text("Humidity: " + response.list[i].main.humidity + "%");
        cardDisplayEl.append(card);
        card.append(cardBody);
        cardTitle.append(icon);
        cardBody.append(cardTitle);
        cardBody.append(cardTemp);
        cardBody.append(cardWind);
        cardBody.append(cardHumidity);
      }
    });
  }
}

function handleSearch(event) {
  // function for taking user input
  if (!$("#search-input").val()) {
    // If no value is input end function
    return;
  }
  event.preventDefault();
  let search = $("#search-input").val().trim(); // Create variable with users search

  fetchAPI(search); // Run fetchAPI function with the search as the parameter
  $("#search-input").empty; // empty the search input
}

$("#search-button").on("click", handleSearch); // When search button is clicked run the above function

function historyClick(event) {
  // function for displaying data for previously searched places
  if (!event.target.matches(".history-btn")) {
    // If target of click is not a button with class history-btn end function
    return;
  }
  let btn = event.target;
  let search = btn.getAttribute("data-search"); // Get the data-search value from button
  fetchAPI(search); // Run fetchAPI with the place name taken from data-search
}

searchHistoryContainer.on("click", historyClick); // if a previous place button is clicked, run above function
clearButton.on("click", function(event) {
  localStorage.clear();
  displayHistory();
});

