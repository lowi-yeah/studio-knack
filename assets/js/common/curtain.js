import anime    from 'animejs'
import Cookie   from 'js-cookie'

let DIRECTIONS  = ['top', 'left', 'bottom', 'right'],
    OPPOSITES   = { bottom: 'top', 
                    left:   'right',
                    right:  'left', 
                    top:    'bottom' },
    IN_EASINGS  = ['easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine'],
    OUT_EASINGS = ['easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine'],
    FADE_DELAY    = 400,
    FADE_DURATION = 600,
    OPEN_CURATION = 600




function open({fromCookie, toCookie}) {
  console.log('opening curtain')
  let Δ = fromCookie ? Cookie.get('curtain-direction') : _.sample(DIRECTIONS)
  Δ = Δ || _.sample(DIRECTIONS)
  Δ = OPPOSITES[Δ]

  if(toCookie) Cookie.set('curtain-direction', Δ)
  else Cookie.remove('curtain-direction')

  let ρ =  new Promise( resolve => {
      let δ = OPEN_CURATION,
          // δ = _.random(800, 1600),
          α = { targets: '#curtain',
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

  return ρ }

function close({fromCookie, toCookie}) {
  console.log('closing curtain')
  let Δ = fromCookie ? Cookie.get('curtain-direction') : _.sample(DIRECTIONS)
  Δ = Δ || _.sample(DIRECTIONS)
  // Δ = OPPOSITES[Δ]

  if(toCookie) Cookie.set('curtain-direction', Δ)
  else Cookie.remove('curtain-direction')

  let δ = OPEN_CURATION,
      ρ = new Promise( resolve => {
                          let curtain   = document.getElementById('curtain'),
                              whiteout  = document.getElementById('whiteout'),
                              α = { targets: curtain,
                                    duration: δ,
                                    easing:   'linear',
                                    complete: () => {
                                                  // whiteout.classList.remove('invisible')
                                                  // _.delay(() => resolve(), 320) 
                                                  resolve()
                                                }}

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