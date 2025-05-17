async function fetchWeather() {
  let weather_search = document.getElementById('search').value; 
  const weather_data = document.getElementById('weather-data');
  const weather_photo = document.getElementById('weather-photo');
  weather_photo_display.style.display = 'flex'; 
  //https://geek-docs.com/css/css-ask-answer/594_css_how_do_i_position_two_divs_horizontally_next_to_each_other.html
  
  //lon_log.style.display = 'block';

  const apiKey = " "

  if (weather_search == '') {  
    weather_data.innerHTML = ` 
    <div> 
      <h1>The text is empty</h1>
      <p>Please try again with a valid <u>city name</u>.</p>
    </div>`
    weather_photo.innerHTML = `
      `
    return;  
  }
  
  async function getLonAndLat(){
    const countryCode = 86
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${weather_search.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`

    lon_log_api = await fetch(geocodeURL)

    if (!lon_log_api.ok){
      console.log('wrong')
      document.getElementById('weather-data').innerHTML = `
      <div> 
      <h1>API response error</h1>
      <p>Please try again with a valid <u>city name</u>.</p>
      </div>`
    };

    const data = await lon_log_api.json()
    //console.log(data)

    if (data.length==0){
      
      document.getElementById('weather-data').innerHTML = `    
      <div> 
        <h1>The ${weather_search} is invalid, please try again</h1>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>`
    } else {
      console.log(data)

    }
    return data[0]

  }
  async function getweatherData(lon, lat) {

    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    
    const response = await fetch(weatherURL);
    
    console.log(`The long is ${lon}`)

    if (!response.ok) {
      console.log('Api response go wrong!')
      weather_data.innerHTML = `
      <h1>Api response go wrong!</h1>
      `
    } else {
      const response_json = await response.json()
      weather_data.style.display = "flex";
      console.log(response_json.name)     

      weather_data.innerHTML = `
      <div>
        <img src="https://openweathermap.org/img/wn/${response_json.weather[0].icon}.png" alt="${response_json.weather[0].description}" width="100" />
        <h1>${response_json.name}</h1>
        <p>Lon:${response_json.coord.lon}; Lat:${response_json.coord.lat}</p>
        <h2>${Math.round(response_json.main.temp - 273.15)}°C</h2>
      </div>
      `
      //<p>${weather_search}'s lon is ${lon},lat is ${lat}</p>

      return response_json.name
    }
  }

  // https://unsplash.com/documentation#hotlinking
  async function getPhoto(response_json) {
    api_key = ' ';
    const unsplash_url = `https://api.unsplash.com/photos/random?client_id=${api_key}&query=${response_json}&orientation=landscape` //originally just weather_search not response_json
    //'https://api.unsplash.com/photos/?client_id=fOfkt4BRnDDiqqd7KBAvgacWXA9x_-CMXP5H2sTqEIA'
    
    photo_response = await fetch(unsplash_url)

    if (!photo_response.ok) {
      console.log('Api response go wrong for unsplash!')
      weather_photo.innerHTML = `
      <h1>Api response go wrong for pic!</h1>
      `
    } else{
      photo = await photo_response.json()
      console.log(photo)
      //<div id="weather-photo"></div>
      weather_photo.innerHTML = `
      <div>
        <img src="${photo.urls.full}" width="300" />
      </div>
      `
    }


}

  const LonAndLat = await getLonAndLat();
  response_json_name = await getweatherData(LonAndLat.lon, LonAndLat.lat)
  console.log(response_json_name)
  getPhoto(response_json_name) //getPhoto() -->the output photo will become what the user inputs
  weather_search = '';  
  document.getElementById("search").value = weather_search
}