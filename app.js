// Get the user's coordinates:                                                              
async function getCoords(){
    pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [pos.coords.latitude, pos.coords.longitude]
}

console.log(getCoords()); 

//encapsulating map and map functions in userMap object
const userMap = {
        coords: [],
        businesses: [],
        markers: {},

        createMap: function(){
            // Create map: 
            this.map = L.map('map', {
                center: this.coords,
                zoom: 12,
            });

            // Add OpenStreetMap tiles:
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                minZoom: '15',
            }).addTo(this.map)

            // create red pin marker
            const personPin = L.icon({
                iconUrl: './assets/person.png',
                iconSize: [30,30], //size of icon
                iconAnchor: [19,40], //point of icon that corresponds to marker's location
                popupAnchor: [-5,-35] //point from hich the popup should open relative to iconAnchor
            })

            // Create and add a geolocation marker:
            const marker = L.marker(this.coords,{icon: personPin})
            marker.addTo(this.map).bindPopup('<p1><b>You are here!</b></p1>').openPopup()

        },

        checkGif: L.icon({
            iconUrl: './assets/check.gif',
            iconSize: [30,30], //size of icon
            iconAnchor: [19,40], //point of icon that corresponds to marker's location
            popupAnchor: [-5,-35] //point from hich the popup should open relative to iconAnchor
        }),

        addMarkers() {
            for(let i=0; i<userMap.businesses.length; i++) {
            const markers = L.marker([userMap.businesses[i].latitude,userMap.businesses[i].longitude],{icon: this.checkGif})
            markers.addTo(this.map).bindPopup(`<p1><b>${userMap.businesses[i].name}</b></p1>`).openPopup()
            }
        },

 }

//handlers
//onload
window.onload = async () => {
    const coordinates = await getCoords()
    userMap.coords = coordinates
    userMap.createMap()
}

//checkbox handlers
const checkboxCof = document.getElementById('coffee')
const checkboxRest = document.getElementById('restaurant')
const checkboxHotel = document.getElementById('hotel')
const checkboxMark = document.getElementById('market')

checkboxCof.addEventListener('change', async (event) => {
  if (event.currentTarget.checked) {
    let data = await fourSquareFetch('coffee')
    userMap.businesses = mapData(data)
    userMap.addMarkers()
  } else {
    console.log('cof not checked');
  }
})

checkboxRest.addEventListener('change', async (event) => {
  if (event.currentTarget.checked) {
    let data = await fourSquareFetch('restaurant')
    userMap.businesses = mapData(data)
    userMap.addMarkers()
  } else {
    console.log('rest not checked');
  }
})

checkboxHotel.addEventListener('change', async (event) => {
    if (event.currentTarget.checked) {
        let data = await fourSquareFetch('hotels')
        userMap.businesses = mapData(data)
        userMap.addMarkers()
    } else {
      console.log('not checked');
    }
  })

  checkboxMark.addEventListener('change', async (event) => {
    if (event.currentTarget.checked) {
        let data = await fourSquareFetch('grocery')
        userMap.businesses = mapData(data)
        userMap.addMarkers()
    } else {
      console.log('not checked');
    }
  })

// let businessData = [];

async function fourSquareFetch(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3nLay+EW8XGwjRje4mtGignySWZNT8d3/bYAFcWDcHpg='
		}
	}
	let limit = 5
	let latitude = userMap.coords[0]
	let longitude = userMap.coords[1]
	let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${latitude}%2C${longitude}`, options)
	let data = await response.text()
	let returnedData = await JSON.parse(data)
    let businessData = returnedData.results
    console.log(businessData)
    return businessData
    
}

//process the data to get latitudes and longitudes
    function mapData(data) {
        let businesses = data.map((element) => {
            let location = {
                name: element.name,
                latitude: element.geocodes.main.latitude,
                longitude: element.geocodes.main.longitude
            };
            return location
        })
        return businesses
    }