const citymap = {
  Amsterdam: {
    center: { lat: 52.37, lng: 4.89 },
    population: 821752,
  },
  Barcelona: {
    center: { lat: 41.38, lng: 2.17 },
    population: 1620000,
  },
  Mumbai: {
    center: { lat: 19.07, lng: 72.87 },
    population: 1200000,
  },
  Wellington: {
    center: { lat: -41.28, lng: 174.77 },
    population: 320000,
  },
  Rome: {
    center: { lat: 41.89, lng: 12.5 },
    population: 2873000,
  },
  Almaty: {
    center: { lat: 43.23, lng: 76.85 },
    population: 1520000,
  },
  Lima: {
    center: { lat: -12.04, lng: -77.03 },
    population: 7200000,
  },
  Cape_Town: {
    center: { lat: -33.92, lng: 18.42 },
    population: 2000000,
  },
  Istanbul: {
    center: { lat: 41.01, lng: 28.97 },
    population: 1319000,
  },
  London: {
    center: { lat: 51.5, lng: -0.11 },
    population: 8308000,
  },
  New_York: {
    center: { lat: 40.714, lng: -74.005 },
    population: 8405837,
  },
  Los_Angeles: {
    center: { lat: 34.052, lng: -118.243 },
    population: 3857799,
  },
};

const openWeatherApiKey = "d220f549078c750d10b58ab8d90ca504";

async function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: { lat: 37.09, lng: -95.712 },
    mapTypeId: "terrain",
  });

  for (const city in citymap) {
    const cityName = city.replace("_", " ");

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${citymap[city].center.lat}&lon=${citymap[city].center.lng}&appid=d220f549078c750d10b58ab8d90ca504&units=metric`
    );
    const data = await response.json();

    const visibility = data.visibility;
    const windspeed = data.wind.speed;
    const temperature = data.main.temp;

    const risk = calculateRisk(visibility, windspeed, temperature);

    const infoWindow = new google.maps.InfoWindow({
      content: `
      <div class="info-window">
        <h1>${cityName}</h1>
        <ul>
            <li>Visibility: ${visibility}m</li>
            <li>Windspeed: ${windspeed}km/h</li>
            <li>Temperature: ${temperature}°C</li>
        </ul>
        <div id="risk-level">
        <strong>Risk level:</strong>
        <div style="background-color:${risk}; width:40px;height:40px;"></div>
        </div>
      </div>
      `,
      maxWidth: 500,
    });

    const cityCircle = new google.maps.Circle({
      strokeColor: calculateRisk(visibility, windspeed, temperature),
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: calculateRisk(visibility, windspeed, temperature),
      fillOpacity: 0.35,
      map,
      center: citymap[city].center,
      radius: Math.sqrt(citymap[city].population) * 100,
    });

    google.maps.event.addListener(cityCircle, "click", function (ev) {
      infoWindow.setPosition(ev.latLng);
      infoWindow.open(map);

      document.getElementById("spot").innerHTML = `You selected ${cityName}`;
    });
  }
}

function calculateRisk(visibility, windspeed, temperature) {
  if (visibility <= 10000 && visibility >= 8500 && windspeed <= 3) {
    return "#82ff5c";
  } else if (visibility >= 6500 && windspeed <= 5) {
    return "#c6ff5c";
  } else if (visibility >= 6000 && windspeed <= 8) {
    return "#f1ff5c";
  } else if (visibility >= 4500 && windspeed <= 12) {
    return "#ffb85c";
  } else if (visibility >= 2000 && windspeed <= 20) {
    return "#eb4034";
  }
  return "#8f0a00";
}

window.initMap = initMap;
