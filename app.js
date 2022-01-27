// Get the user's coordinates:                                                              
async function getCoords(){
    pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [pos.coords.latitude, pos.coords.longitude]
}

console.log(getCoords()); 

// Promise.all([getCoords()]).then((values) => {
//     console.log(values);
//   });

// let userLocation = [];

// navigator.geolocation.getCurrentPosition(getLocation)

// function getLocation(position) {
//     var lat = position.coords.latitude;
//     var lon = position.coords.longitude;
//     console.log(lat)
//     console.log(lon)
//     userLocation = [lat,lon]
//     console.log(userLocation)
// }

//encapsulating map and map functions in userMap object
const userMap = {
        createMap: function(coordinates){
            const coords = coordinates;
            // Create map: 
            const myMap = L.map('map', {
                center: [coords[0], coords[1]],
                zoom: 12,
            });

            // Add OpenStreetMap tiles:
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                minZoom: '15',
            }).addTo(myMap)

            // create red pin marker
            const personPin = L.icon({
                iconUrl: './assets/person.png',
                iconSize: [30,30], //size of icon
                iconAnchor: [19,40], //point of icon that corresponds to marker's location
                popupAnchor: [-5,-35] //point from hich the popup should open relative to iconAnchor
            })

            // Create and add a geolocation marker:
            const marker = L.marker([coords[0], coords[1]],{icon: personPin})
            marker.addTo(myMap).bindPopup('<p1><b>You are here!</b></p1>').openPopup()

        }
 }



// metro station markers
// Metro station markers:
    // const rS = L.marker([48.866200610611926, 2.352236247419453],{icon: redPin}).bindPopup('Réaumur-Sébastopol')
    // const sSD = L.marker([48.869531786321566, 2.3528590208055196],{icon: redPin}).bindPopup('Strasbourg-Saint-Denis')
    // const sentier = L.marker([48.8673721067762, 2.347107922912739],{icon: redPin}).bindPopup('Sentier')
    // const bourse = L.marker([48.86868503971672, 2.3412285142058167],{icon: redPin}).bindPopup('Bourse')
    // const qS = L.marker([48.869560129483226, 2.3358638645569543],{icon: redPin}).bindPopup('Quatre Septembre')
    // const gB = L.marker([48.871282159004856, 2.3434818588892714],{icon: redPin}).bindPopup('Grands Boulevards')

    // const stations = L.layerGroup([rS, sSD, sentier, bourse, qS, gB]).addTo(myMap)


// document.getElementById('pinBtn').addEventListener('click',function(){
//     myMap.removeLayer(stations)
// })

// document.getElementById('pinBtn').addEventListener('click',function(){
//     myMap.removeLayer(stations)
// })

//handlers
//onload
window.onload = async () => {
    const coords = await getCoords()
    userMap.createMap(coords)
}


// function toggleGroup (e) {
//     if (e.checked) {
//       myMap.addLayer();
//     } else {
//       myMap.removeLayer();
//     }
//   }