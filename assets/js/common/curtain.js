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
    FADE_DURATION = 600

function open() {
  let ρ =  new Promise( resolve => {
      let δ = 620,
          // δ = _.random(800, 1600),
          Δ = Cookie.get('curtain-direction')

      // remove the cookie after opening so that by the next close a new random direction will be chosen
      Cookie.remove('curtain-direction')
      
        if(!Δ) Δ = _.sample(DIRECTIONS)
        Δ = OPPOSITES[Δ]
      
      let α = { targets: '#curtain',
                duration: δ,
                delay:    0,
                easing:   'linear',
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

      anime(α) })

  return ρ

  }

function close() {
  console.log('closing curtain')
  let Δ,
      δ = 620,
      ρ = new Promise( resolve => {
                          let curtain   = document.getElementById('curtain'),
                              whiteout  = document.getElementById('whiteout'),
                              α = { targets: curtain,
                                    duration: δ,
                                    easing:   'linear',
                                    complete: () => {
                                                  whiteout.classList.remove('invisible')
                                                  _.delay(() => resolve(), 320) }}
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
                          anime(α)})
  return ρ.then(() => Δ) 
}


export default { open, close}