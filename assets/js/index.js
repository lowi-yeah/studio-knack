import '../sass/index.sass'

import anime      from 'animejs'

import menu       from './menu'
import layout     from './layout'
import images     from './images'
import logo       from './logo'
import util       from './util'
import gradient   from './gradient'
import overlay    from './overlay'
import pattern    from './pattern'
import single     from './single'

let DIRECTIONS  = ['top', 'left', 'bottom', 'right'],
    EASINGS     = ['easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc']

// function _closeCurtain() {
//   console.log('closing #curtain')
//   return new Promise(resolve => {

//     let curtain = document.getElementById('curtain'),
//         ρ = { targets: '#curtain',
//               duration: _.random(320, 640),
//               easing:   EASINGS[Math.floor(Math.random() * EASINGS.length)],
//               complete: () => {
//                 // document.getElementById('curtain').style.display = 'none'
//                 resolve()
//               }},
//         δ = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]

//     if(δ === 'left' || δ === 'right') {
//       curtain.setAttribute('width', 0)
//       curtain.setAttribute('height', window.innerHeight)      
//       ρ.width = [0, window.innerWidth]
//     }

//     if(δ === 'top'  || δ === 'bottom') {
//       curtain.setAttribute('width', window.innerWidth)
//       curtain.setAttribute('height', 0)
//       ρ.height = [0, window.innerHeight]
//     }

//     anime(ρ) })
// }



function _closeCurtain() {
  console.log('closing #curtain')
  let ρ = new Promise( resolve => {
                          let α = { targets: '#curtain',
                                    duration: _.random(2000, 3200),
                                    easing:   'easeOutQuad',
                                    complete: resolve },
                              δ = _.sample(DIRECTIONS)

                          if(δ === 'left' || δ === 'right') {
                            curtain.setAttribute('width', 0)
                            curtain.setAttribute('height', window.innerHeight)      
                            α.width = [0, window.innerWidth] }
                      
                          if(δ === 'top'  || δ === 'bottom') {
                            curtain.setAttribute('width', window.innerWidth)
                            curtain.setAttribute('height', 0)
                            α.height = [0, window.innerHeight] }
                          anime(α)}),

      ϑ = _.map(document.querySelectorAll('rect.gradient'), gradient => 
              new Promise( resolve => 
                              anime({ targets: gradient,
                                      duration: _.random(1600, 2000),
                                      opacity:  0,
                                      easing:   'easeOutQuad',
                                      complete: resolve})))
  return Promise.all(_.concat(ϑ, ρ))}


function _href(e) {
  if(!e) return
  if(e.tagName.match(/body/gi)) return null
  let location = e.getAttribute('href')
  if(location) return location
  else return _href(e.parentElement)}

// capture all a#href clicks
function interceptLinks() {
  window.onclick = e => { 
    let location = _href(e.target)
    if(location) {
      e.preventDefault()

      _closeCurtain()
        .then(() => {
          console.log('location', location)
          window.location = location
        })
      // if( location === '/about') _about(() => window.location = location)
      // _transitionTo()
    }}}


function init() {
  console.log('ready!')
  console.log('device',  util.getDevice(window.innerWidth))
  interceptLinks()
  images.init()  
  pattern.init()
  
  window.curtainPromise
    .then(layout.init)
    .then(logo.begin)
    .then(layout.show)
    .then(menu.init)
    .then(overlay.init)
    

  
  // logo.begin()

  //   .then( menu.init )
  //   .then( single.init )
  //   .then( layout.update )

}

document.addEventListener('DOMContentLoaded', init)
// ready(setTimeout(init, 100))

