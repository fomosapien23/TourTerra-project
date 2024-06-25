
// console.log(maptoken);

mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: "mapbox://styles/mapbox/streets-v12",
    center: data.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});


// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color : "red"})
.setLngLat(data.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({ offset:25,closeOnClick :true })
    .setHTML(`<h4>${data.title}</h4><p>Exact location provided after Booking</p>`)
)
.addTo(map);