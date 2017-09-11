import anime from 'animejs'

let TRANSITION_DURATION = 1000,
    EASINGS = ['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack']

function _href(e) {
  if(e.tagName.match(/body/gi)) return null
  let location = e.getAttribute('href')
  if(location) return location
  else return _href(e.parentElement)}

function _transitionTo(doneFn){
  let τ = document.getElementById('transition'),
      δ = _.sample(['left', 'top']),
      ε = _.sample(EASINGS),
      ω = { targets: '#transition',
            top: 0,
            left: 0,
            easing:   ε,
            duration: TRANSITION_DURATION },
      α  = anime(ω) 
  α.complete = () => doneFn() }

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
      _transitionTo(() => {window.location = location})
    }}

  // here we go…
  let τ = document.getElementById('transition'),
      δ = _.sample(['left', 'top']),
      ρ = _.sample(['-102%', '102%']),
      ε = _.sample(EASINGS),
      ω = { targets: '#transition',
            easing:   ε,
            duration: TRANSITION_DURATION },
      Ϟ = ω[δ] = ρ,
      α  = anime(ω) 
  α.complete = () => _initBackButton()
}

export default { init: init }