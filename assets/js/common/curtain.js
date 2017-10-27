import anime    from 'animejs'
import Cookie   from 'js-cookie'

let DIRECTIONS  = ['top', 'left', 'bottom', 'right'],
    OPPOSITES   = { bottom: 'top', 
                    left:   'right',
                    right:  'left', 
                    top:    'bottom' },
    IN_EASINGS  = ['easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine'],
    OUT_EASINGS = ['easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine'],
    OPENING_DELAY = 200,
    FADE_DELAY    = 400,
    FADE_DURATION = 800

function open() {
  console.log('TA DA!')

  let δ = _.random(800, 1600),
      Δ = Cookie.get('curtain-direction')
  Cookie.remove('curtain-direction')

  if(!Δ) Δ = _.sample(DIRECTIONS)
  Δ = OPPOSITES[Δ]
  
  let ρ = new Promise( resolve => {
                          let α = { targets: '#curtain',
                                    duration: δ,
                                    delay:    FADE_DELAY + OPENING_DELAY,
                                    easing:   _.sample(OUT_EASINGS),
                                    complete: resolve }
                          if(Δ === 'left')  { 
                            α.width       = 0
                            α.translateX  = 0}

                          if(Δ === 'right') { 
                            α.width       = 0; 
                            α.translateX  = window.innerWidth}

                          if(Δ === 'top')   { 
                            α.height      = 0
                            α.translateY  = 0}

                          if(Δ === 'bottom'){ 
                            α.height      = 0
                            α.translateY  = window.innerHeight}

                          anime(α)}),
      ζ = new Promise( resolve => 
                          anime({ targets: '#rainbow',
                                  duration: FADE_DURATION,
                                  delay: FADE_DELAY,
                                  opacity:  1,
                                  easing:   _.sample(OUT_EASINGS),
                                  complete: resolve}))
  return Promise.all(_.concat(ρ, ζ))
}

function close() {
  console.log('closing curtain')
  let Δ,
      δ = _.random(800, 1600),
      ρ = new Promise( resolve => {
                          let curtain = document.getElementById('curtain'),
                              α = { targets: curtain,
                                    duration: δ,
                                    easing:   _.sample(OUT_EASINGS),
                                    complete: resolve }
                          Δ = _.sample(DIRECTIONS)

                          if(Δ === 'left') {
                            curtain.setAttribute('width', 0)
                            curtain.setAttribute('height', window.innerHeight)
                            curtain.style.transform = `translateX(0) translateY(0)`
                            α.width       = window.innerWidth }

                           if(Δ === 'right') {
                            curtain.setAttribute('width', 0)
                            curtain.setAttribute('height', window.innerHeight)
                            curtain.style.transform = `translateX(${window.innerWidth}px) translateY(0)`
                            α.width       = window.innerWidth
                            α.translateX  = 0 }
                      
                          if(Δ === 'top') {
                            curtain.setAttribute('width', window.innerWidth)
                            curtain.setAttribute('height', 0)
                            curtain.style.transform = `translateX(0) translateY(0)`
                            α.height      = window.innerHeight }

                          if(Δ === 'bottom') {
                            curtain.setAttribute('width', window.innerWidth)
                            curtain.setAttribute('height', 0)
                            curtain.style.transform = `translateX(0) translateY(${window.innerHeight}px)`
                            α.height      = window.innerHeight
                            α.translateY  = 0 }
                          anime(α)}),

      ϑ = new Promise( resolve => 
                          anime({ targets: '#rainbow',
                                  duration: FADE_DURATION,
                                  delay: δ - FADE_DURATION,
                                  opacity:  0,
                                  easing:   _.sample(OUT_EASINGS),
                                  complete: resolve}))

  return Promise.all(_.concat(ϑ, ρ)).then(() => Δ)}


export default { open, close}