async function fetchWeather() {
  let weather_search = document.getElementById('search').value; //这里一开始我漏掉了value
  const weather_data = document.getElementById('weather-data');
  const weather_photo = document.getElementById('weather-photo');
  weather_photo_display.style.display = 'flex'; //设置成block就不行了,设置成block这意味着它们将分别占据一行
  //https://geek-docs.com/css/css-ask-answer/594_css_how_do_i_position_two_divs_horizontally_next_to_each_other.html
  
  //lon_log.style.display = 'block';

  const apiKey = "84d0da0ad973232514dfef09e4fc6fa8"

  if (weather_search == '') {   //这里一开始，我写成了一个=，结果没反应，因为根本没有做判断
    weather_data.innerHTML = ` 
    <div> 
      <h1>The text is empty</h1>
      <p>Please try again with a valid <u>city name</u>.</p>
    </div>`
    weather_photo.innerHTML = `
      `
    return;  //这里这个return什么意思
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
      console.log(response_json)      //这里原本这么写console.log(`{response_json}`), console就会打印object Object 

      weather_data.innerHTML = `
      <div>
        <img src="https://openweathermap.org/img/wn/${response_json.weather[0].icon}.png" alt="${response_json.weather[0].description}" width="100" />
        <h1>${response_json.name}</h1>
        <p>Lon:${response_json.coord.lon}; Lat:${response_json.coord.lat}</p>
        <h2>${Math.round(response_json.main.temp - 273.15)}°C</h2>
      </div>
      `
      //<p>${weather_search}'s lon is ${lon},lat is ${lat}</p>
    }

  
    //console.log(response_json): {coord: {…}, weather: Array(1), base: 'stations', main: {…}, visibility: 9914, …}base: "stations"clouds: {all: 91}cod: 200coord: {lon: 1.4967, lat: 42.4667}dt: 1747060224id: 3039163main: {temp: 287.52, feels_like: 286.4, temp_min: 287.52, temp_max: 287.52, pressure: 1012, …}name: "Sant Julià de Lòria"sys: {type: 2, id: 19636, country: 'AD', sunrise: 1747024528, sunset: 1747076722}timezone: 7200visibility: 9914weather: Array(1)0: {id: 804, main: 'Clouds', description: 'overcast clouds', icon: '04d'}length: 1[[Prototype]]: Array(0)wind: {speed: 4.32, deg: 214, gust: 4.21}[[Prototype]]: Object

  }

  // https://unsplash.com/documentation#hotlinking
  async function getPhoto() {
    console.log(weather_search)
    api_key = 'fOfkt4BRnDDiqqd7KBAvgacWXA9x_-CMXP5H2sTqEIA';
    const unsplash_url = `https://api.unsplash.com/photos/random?client_id=${api_key}&query=${weather_search}&orientation=landscape` //'https://api.unsplash.com/photos/?client_id=fOfkt4BRnDDiqqd7KBAvgacWXA9x_-CMXP5H2sTqEIA'
    
    photo_response = await fetch(unsplash_url)

    if (!photo_response.ok) {
      console.log('Api response go wrong!')
      weather_photo.innerHTML = `
      <h1>Api response go wrong for pic!</h1>
      `
    } else{
      photo = await photo_response.json()
      console.log(photo)
    }

    //<div id="weather-photo"></div>
    weather_photo.innerHTML = `
      <div>
        <img src="${photo.urls.full}" width="300" /> <!-- 修正了引号和宽度 -->
      </div>
      `

}
  //option 1,直接
  //document.getElementById("search").value

  //option 2,多一个无聊的步骤
  const LonAndLat = await getLonAndLat();
  getweatherData(LonAndLat.lon, LonAndLat.lat)
  getPhoto()
  weather_search = '';  //单纯这个代码，并没有改变真正的DOM的值，只是改变了变量weather_search
  document.getElementById("search").value = weather_search
}


    //}
    //const geocodeData = await getLonAndLat();
    //getweatherData(geocodeData.lon, geocodeData.lat) //该函数内部已经包括了通过innerHTML来修改html的方法了

//} 

/*
async function fetchWeather() {
  // Step a. Create global variables and start inner functions  先从HTML页面获取要素
  let searchInput = document.getElementById('search').value;
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";   //    <div id="weather-data" style="display: none;"></div> 原本是none的，只有当点击了fetchWeather的时候，才会显示

  const apiKey = "84d0da0ad973232514dfef09e4fc6fa8"

  if (searchInput == "") {
    weatherDataSection.innerHTML = `
    <div>
      <h2>Empty Input!</h2>
      <p>Please try again with a valid <u>city name</u>.</p>
    </div>
    `
    return;
  }

  // Step b. Get lat and lon coordinates via Geocoding API   https://openweathermap.org/api/geocoding-api
  async function getLonAndLat() {
    const countryCode = 86
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`

    const response = await fetch(geocodeURL);  //why do we use fetch? because fetch needs time, if we don't add an await, then our local computer may run it in advance, causing there is 0 reply.
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }

    const data = await response.json();
    console.log(data)

    if (data.length == 0) {
      console.log("Something went wrong here.");
      weatherDataSection.innerHTML = `
      <div>
        <h2>Invalid Input: "${searchInput}"</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
      `;
      return;
    } else {
        console.log(data[0])
      return data[0];
      
    }
  }

  async function getWeatherData(lon, lat) {
    // Step c. Get weather information via Current Weather API
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    const response = await fetch(weatherURL);

    // Step d. Display the weather data
    const data = await response.json();
    weatherDataSection.style.display = "flex";
    
    // 这里直接修改HTML的值 
    weatherDataSection.innerHTML = `    
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
      <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
      </div>
    `
  }

  // These are part of Step d.
  document.getElementById("search").value = "";   //这里很明显是冗余，应该直接  weather_search = '';就可以了；错误，这样不会改变实际的DOM值，只是暂时改变了变量
  const geocodeData = await getLonAndLat();
  getWeatherData(geocodeData.lon, geocodeData.lat);
}
*/

