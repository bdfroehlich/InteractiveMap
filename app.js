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

checkboxCof.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    getFoursquare('coffee')
  } else {
    console.log('cof not checked');
  }
})

checkboxRest.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    getFoursquare('restaurant')
  } else {
    console.log('rest not checked');
  }
})

checkboxHotel.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      getFoursquare('hotels')
    } else {
      console.log('not checked');
    }
  })

  checkboxMark.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
      getFoursquare('grocery')
    } else {
      console.log('not checked');
    }
  })


async function getFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3nLay+EW8XGwjRje4mtGignySWZNT8d3/bYAFcWDcHpg='
		}
	}
	let limit = 5
	let lat = userMap.coords[0]
	let lon = userMap.coords[1]
	let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let fourSquareResults = await JSON.parse(data)
    let businessData = fourSquareResults.results
    console.log(businessData)
    
        // for(let i=0; i<businessData.length; i++) {
        // const markers = L.marker(businessData[i].geocodes.latitude,businessData[i].geocodes.longitude)
        // markers.addTo(userMap).bindPopup('<p1><b>${businessData[i].name}</b></p1>').openPopup()
        // }
}