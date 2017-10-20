import '../sass/index.sass'
import 'leaflet/dist/leaflet.css'

import L        from 'leaflet'
// import overlay  from './common/overlay'
import util     from './common/util'
import pattern  from './common/pattern'
import images   from './article/images'
import menu     from './article/menu'
import infinite from './article/infinite-scroll'


const LAYER_TOKEN   = 'pk.eyJ1IjoibG93aSIsImEiOiJjaXpyZnYwMHUwMDI2MnFzN21wNm1zeGF2In0.t4FHMAzcW-5SMIfKneu3YQ'
const ACCESS_TOKEN  = 'pk.eyJ1IjoibG93aSIsImEiOiJjajh4aXJwOHMxa3MxMzNyMHBhZGE0bnZ1In0.B6U7OjjTGl7oBB-3d1Vdsg'

function _initMap() {
  let μ = document.getElementById('map')
  if(!μ) return

  let lat = μ.getAttribute('data-lat'),
      lng = μ.getAttribute('data-lng'),
      map = L.map('map', {center: [lat, lng],
                          zoom:   16 })

  L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${LAYER_TOKEN}`, {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: ACCESS_TOKEN
  }).addTo(map)
}
function init() {
  console.log('initializing article.')
  _initMap()

  images.init()  
  menu.init()
  pattern.init()

  infinite.init()
  

  
  window.curtainPromise
    .then(() => {
      document.querySelector('.grid-wrap').style.opacity = 1
      document.getElementById('footer').style.display = 'flex'
      console.log('BAM!')})
  
}



document.addEventListener('DOMContentLoaded', init)