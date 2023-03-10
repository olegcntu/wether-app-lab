const link = 'https://api.openweathermap.org/data/2.5/weather'
const codeId = '8d8c55b646dfbfd856addc1fddcb41b8'
const root = document.getElementById('root')

const popup = document.getElementById('popup')
const textInput = document.getElementById('text-input')
const form = document.getElementById('form')

let store = {
    city: '',
    humidity: 0,
    temp: 0,
    time: 0,
    windSpeed: 0,
    main: '',
    description: '',
    cloudsP: 0
}
const fetchData = async () => {
    try {
        const query = localStorage.getItem('query') || store.city
        console.log(query)
        store = {
            ...store,
            city: query
        }
        const result = await fetch(`${link}?q=${store.city}&appid=${codeId}`);
        const data = await result.json();
        console.log(data)

        const {clouds: {all: cloudsP}, main: {humidity, temp, pressure}, wind: {speed: windSpeed}, weather} = data;

        store = {
            ...store,
            humidity,
            temp,
            time: new Date().toLocaleString(),
            description: weather[0].description,
            main: weather[0].main,
            windSpeed,
            properties: {
                cloudcover: {
                    title: "cloudcover",
                    value: `${cloudsP} %`,
                    icon: "cloud.png",
                },
                humidity: {
                    title: "humidity",
                    value: `${humidity}%`,
                    icon: "humidity.png",
                },
                windSpeed: {
                    title: "wind speed",
                    value: `${windSpeed} km/h`,
                    icon: "wind.png",
                },
                pressure: {
                    title: "pressure",
                    value: `${pressure}`,
                    icon: "gauge.png",
                }
            },
        }
        renderComponent()

        console.log(store)
    } catch (err) {
        console.log(err)
    }
}

const getImage = (main) => {
    const MainLower = main.toLowerCase()

    switch (MainLower) {
        case 'clouds':
            return "./img/cloud.png"
        case 'snow':
            return "./img/snowflake.png"
        case 'clear':
            return "./img/clear.png"
        case 'mist':
            return "./img/fog.png"
        case 'sunny':
            return "./img/sunny.png"
        case 'party':
            return "./img/party.png"
        case 'rain':
            return "./img/rain.png"
        default :
            return "./img/the.png"
    }
}


const renderProperty = (properties) => {
    return Object.values(properties)
        .map(({title, value, icon}) => {
            return `<div class="property">
            <div class="property-icon">
              <img src="./img/icons/${icon}" alt="">
            </div>
            <div class="property-info">
              <div class="property-info__value">${value}</div>
              <div class="property-info__description">${title}</div>
            </div>
          </div>`;
        })
        .join("");
};
const markup = () => {

    const {city, temp, description, main, time, properties} = store;

    return `<div class="container">
            <div class="top">
              <div class="city">
                <div class="city-subtitle">Weather Today in</div>
                  <div class="city-title" id="city">
                  <span>${city}</span>
                </div>
              </div>
              <div class="city-info">
                <div class="top-left">
                <img class="icon" src=${getImage(main)} alt="" />
                <div class="description">${description}</div>
              </div>
            
              <div class="top-right">
                <div class="city-info__subtitle">as of ${time}</div>
                <div class="city-info__title">${temp}</div>
              </div>
            </div>
          </div>
       <div id="properties">${renderProperty(properties)}</div>
      </div>`;
};

const togglePopupClass = () => {
    popup.classList.toggle("active");
};

const renderComponent = () => {
    root.innerHTML = markup();

    const city = document.getElementById("city");
    city.addEventListener("click", togglePopupClass);
};
const handleInput = (e) => {
    store = {
        ...store,
        city: e.target.value
    }
}

const handleSubmit = (e) => {
    e.preventDefault()
    const value = store.city
    if (!value) {
        return null
    }
    localStorage.setItem('query', value)
    fetchData()
    togglePopupClass()
}

form.addEventListener('submit', handleSubmit)
textInput.addEventListener('input', handleInput)
fetchData();