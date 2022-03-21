var btn = document.querySelector('.search button');
var input = document.querySelector('.search input');
var condtionIconImg = document.querySelector('.condtion-icon .icon');
var condtionIconText = document.querySelector('.condtion-icon .icon-text');
var todayCurrentTemp = document.querySelector('.current-temp .temp');
var todayLowTemp = document.querySelector('.low-heigh-temp .low-temp span');
var todayHeighTemp = document.querySelector('.low-heigh-temp .heigh-temp span');
var precipitation = document.querySelector('.precipitation span');
var humidity = document.querySelector('.humidity span');
var pressure = document.querySelector('.pressure span');
var wind = document.querySelector('.wind span');
var locat = document.querySelector('.location span');
var suntime = document.querySelector('.suntime span');
var long = document.querySelector('.long span');
var lat = document.querySelector('.lat span');
var forcast120H = document.getElementById('forcast-120H');
var forcast16D = document.getElementById('forcast-16D');
btn.onclick = function(){
	var value = input.value;
	currentreport(value);
}
function currentreport(v){
document.getElementsByClassName('report-preloader')[0].style.display = 'block';
document.getElementsByClassName('report-preloader')[0].innerHTML = '<span></span>';
var xhr = new XMLHttpRequest();

xhr.addEventListener("readystatechange", function () {
	if (this.readyState === this.DONE) {
		if (this.status === 200) {
		var response = this.responseText;
		var data = JSON.parse(response);
		todayCurrentTemp.innerHTML = data.current_observation.condition.temperature + '&#176;';
		todayLowTemp.innerHTML = data.forecasts[0].low + '&#176;';
		todayHeighTemp.innerHTML = data.forecasts[0].high + '&#176;';
		humidity.innerHTML = data.current_observation.atmosphere.humidity + '%';
		pressure.innerHTML = data.current_observation.atmosphere.pressure + 'hpa';
		wind.innerHTML = data.current_observation.wind.speed + 'mph';
		locat.innerHTML = data.location.city + ", " +data.location.country;
		suntime.innerHTML = data.current_observation.astronomy.sunrise + " to " + data.current_observation.astronomy.sunset;
		long.innerHTML = data.location.long;
		lat.innerHTML = data.location.lat;
		forcast120Hour(data.location.long, data.location.lat);
		forcast16Days(data.location.long, data.location.lat);
	}else{
		document.getElementsByClassName('report-preloader')[0].innerHTML = '<div>Try again with correct name</div>';
	}
		}
});
xhr.open("GET", "https://yahoo-weather5.p.rapidapi.com/weather?location="+v+"&format=json&u=c");
xhr.setRequestHeader("x-rapidapi-host", "yahoo-weather5.p.rapidapi.com");
// replace your api key with this api key 24be8c3b58msh73ce604f8f56c19p17a6e6jsnb61b599b5041
xhr.setRequestHeader("x-rapidapi-key", "24be8c3b58msh73ce604f8f56c19p17a6e6jsnb61b599b5041");
xhr.send();
}
function forcast120Hour(x, y){
var xhr = new XMLHttpRequest();

xhr.addEventListener("readystatechange", function () {
	if (this.readyState === this.DONE) {
		var response = this.responseText;
		var data = JSON.parse(response);
		precipitation.innerHTML = data.data[0].precip + "%";
		condtionIconImg.innerHTML = '<img src="images/'+data.data[0].weather.icon+'.png" alt="'+data.data[0].weather.description+'">';
		condtionIconText.innerHTML = data.data[0].weather.description;
		var storeData = '';
		for (var i = 0; i < data.data.length-1; i = i+4) {
			var timeData = data.data[i].timestamp_local;
			var date  = timeData.split('T')[0].split('-')[2];
			var time = timeData.split('T')[1].split(':')[0];
			if(time > 12){
				time = time - 12 + 'pm';
			}else{
				time = time + 'am';
			}
			var formatedDate = date + '-T-' + time;
			storeData = storeData + '<li class="splide__slide"><div class="short-weather"><div class="s-icon"><img src="images/'+data.data[i].weather.icon+'.png" title="'+data.data[i].weather.description+'"></div><div class="s-detail"><span class="s-temperature"><img src="images/temperature.png" alt=""><span>'+data.data[i].temp+'&#176;C</span></span><span class="s-precipitation"><img src="images/rain.png" alt=""><span>'+Math.round(data.data[i].precip * 10)/10+'%</span></span></div><div class="s-time">'+formatedDate+'</div></div></li>';
			
		}
		forcast120H.innerHTML = storeData;
		loadForcast120Hour();
	}
});
xhr.open("GET", "https://weatherbit-v1-mashape.p.rapidapi.com/forecast/hourly?lat="+y+"&lon="+x+"&hours=120");
xhr.setRequestHeader("x-rapidapi-host", "weatherbit-v1-mashape.p.rapidapi.com");
// replace your api key with this api key 24be8c3b58msh73ce604f8f56c19p17a6e6jsnb61b599b5041
xhr.setRequestHeader("x-rapidapi-key", "24be8c3b58msh73ce604f8f56c19p17a6e6jsnb61b599b5041");
xhr.send();
}

function forcast16Days(x, y){
var xhr = new XMLHttpRequest();

xhr.addEventListener("readystatechange", function () {
	if (this.readyState === this.DONE) {
	var response = this.responseText;
	var data = JSON.parse(response);
	var storeData = '';
	for (var i = 0; i < data.data.length; i++) {
		storeData = storeData + '<li class="splide__slide"><div class="short-weather"><div class="s-icon"><img src="images/'+data.data[i].weather.icon+'.png" title="'+data.data[i].weather.description+'"></div><div class="s-detail"><span class="s-temperature"><img src="images/temperature.png" alt=""><span>'+data.data[i].temp+'&#176;C</span></span><span class="s-precipitation"><img src="images/rain.png" alt=""><span>'+Math.round(data.data[i].precip * 10)/10+'%</span></span></div><div class="s-time">'+data.data[i].datetime+'</div></div></li>';
	}
	forcast16D.innerHTML = storeData;
	loadForcast16Days();
		document.getElementsByClassName('report-preloader')[0].style.display = 'none';
	}
});

xhr.open("GET", "https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily?lat="+y+"&lon="+x);
xhr.setRequestHeader("x-rapidapi-host", "weatherbit-v1-mashape.p.rapidapi.com");
xhr.setRequestHeader("x-rapidapi-key", "24be8c3b58msh73ce604f8f56c19p17a6e6jsnb61b599b5041");

xhr.send();
}
function loadForcast120Hour(){
	  var splide = new Splide( '.forcast-120', {
          updateOnMove: true,
          type        : 'slide',
          perPage     : 6,
          perMove     : 6,
		  autoplay: false,
		  arrows: true,
		  pagination: false,
		  drag: true,
		  rewind : false,
} );
splide.mount();
}
function loadForcast16Days(){
	  var splide = new Splide( '.forcast-16d', {
          updateOnMove: true,
          type        : 'slide',
          perPage     : 6,
          perMove     : 2,
		  autoplay: false,
		  arrows: true,
		  pagination: false,
		  drag: true,
		  rewind: false,
} );
splide.mount();
}
