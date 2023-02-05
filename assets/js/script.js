$("#search-button").on("click", function(event){
    event.preventDefault();
    let location = $("#search-input").val();

//    console.log(location); 

    let queryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + location +
    "&limit=5&appid=6090686048651d85250d11bb39ac022a";
    
        $.ajax({
            url: queryURL,
            method: "GET"
        })
      
        .then(function(response) {
        
// console.log(response);

        let lat = response[0].lat;
        let lon = response[0].lon;

        let weatherURL = "api.openweathermap.org/data/2.5/forecast?lat="
         + lat + "&lon=" + lon +
        "&appid=6090686048651d85250d11bb39ac022a";  
        
// console.log(weatherURL);

        // $.ajax({
        //     url: weatherURL,
        //     method: "GET"
        // }) .then(function(getWeather){

        //     console.log(getWeather);

        // })

   
        })
    })
