import anime  from 'animejs'
// import util   from './util'

let TRANSITION_DURATION = 1000,
    EASINGS = ['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack']

function _href(e) {
  if(!e) return
  if(e.tagName.match(/body/gi)) return null
  let location = e.getAttribute('href')
  if(location) return location
  else return _href(e.parentElement)}

function _home(doneFn) {
  console.log('going home…')
  setTimeout(doneFn, 800)
}

function _about(doneFn){
  // let τ = document.getElementById('transition'),
  //     δ = _.sample(['left', 'top']),
  //     ε = _.sample(EASINGS),
  //     ω = { targets: '#transition',
  //           top: 0,
  //           left: 0,
  //           easing:   ε,
  //           duration: TRANSITION_DURATION },
  //     α  = anime(ω) 
  // setTimeout(doneFn, 1000)


  let home  = document.getElementById('home-link'),
      about = document.getElementById('about-link'),
      τ     = anime.timeline(),
      ω     = about.getBoundingClientRect().top - 35

  console.log('τ', τ)

  // ————————————————————————————————
  anime({ targets: '#about-link',
          fontSize: 32,
          easing:   _.sample(EASINGS),
          duration: 420 })

  // ————————————————————————————————
  anime({ targets: '#about-link',
          fontSize: 32,
          easing:   _.sample(EASINGS),
          duration: 420 })

  // ————————————————————————————————
  τ.add({ targets: '#about-link',
          translateX: 116,
          easing:   _.sample(EASINGS),
          delay:    _.random(120, 240),
          duration: _.random(240, 420) })

  τ.add({ targets: '#about-link',
          translateX: 116,
          translateY: -ω,
          easing:   _.sample(EASINGS),
          duration: _.random(240, 420) })

  τ.add({ targets: '#menu',
          translateX: -window.innerWidth,
          easing:   _.sample(EASINGS),
          delay: _.random(240, 420),
          duration: _.random(240, 420) })

  setTimeout(doneFn, τ.duration)


  // ————————————————————————————————
  anime({ targets: '#contact',
          translateX: 0,
          translateY: window.innerHeight,
          duration:   _.random(420, 640),
          delay:      _.random(120, 240),
          easing:     _.sample(EASINGS) }) 

   // ————————————————————————————————
  anime({ targets: '#toc',
          scale: 0,
          duration:   _.random(420, 640),
          delay:      _.random(120, 240),
          easing:     _.sample(EASINGS) }) 
}

function _initBackButton() {
  let β = document.getElementById('back')
  if(!β) return
  console.log('_initBackButton')
  let δ = _.random(400, 1200),
      ε = _.sample(EASINGS),
      ω = { targets:  β,
            left:      '1rem',
            easing:   ε,
            duration: δ},
      α  = anime(ω) 
}


function init() {

  // global function for navigating a step back
  // used on single pages to navigate back to the home screen
  window.goBack = function() {
    _transitionTo(() => {window.history.back()})
  }
  
  // capture all a#href clicks
  window.onclick = e => { 
    let location = _href(e.target)
  
    if(location) {
      e.preventDefault()
      console.log('location', location)

      if( location === '/about') _about(() => window.location = location)
      if( location === '/') _home(() => window.location = location)
      // _transitionTo()
    }}

}

export default { init: init }