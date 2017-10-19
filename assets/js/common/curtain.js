import anime    from 'animejs'

let DIRECTIONS  = ['top', 'left', 'bottom', 'right'],
    IN_EASINGS  = ['easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine'],
    OUT_EASINGS = ['easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine']

function open() {
  console.log('TA DA!')
  let ρ = new Promise( resolve => {
                          let α = { targets: '#curtain',
                                    duration: _.random(1200, 2000),
                                    // duration: 2000,
                                    delay:    400,
                                    easing:   _.sample(OUT_EASINGS),
                                    complete: resolve },
                              δ = _.sample(DIRECTIONS)
                          if(δ === 'left' || δ === 'right')  α.width  = 0
                          if(δ === 'top'  || δ === 'bottom') α.height = 0
                          anime(α)}),

      ϑ = _.map(document.querySelectorAll('rect.gradient'), gradient => 
              new Promise( resolve => 
                              anime({ targets: gradient,
                                      duration: _.random(1600, 2000),
                                      // opacity:  _.random(0.12, 0.81, true),
                                      opacity:  1,
                                      easing:   _.sample(OUT_EASINGS),
                                      complete: resolve})))
  return Promise.all(_.concat(ϑ, ρ))}

function close() {
  console.log('closing curtain')
  let ρ = new Promise( resolve => {
                          let α = { targets: '#curtain',
                                    duration: _.random(1200, 2000),
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
                                      duration: _.random(800, 1600),
                                      opacity:  0,
                                      easing:   'easeOutQuad',
                                      complete: resolve})))
  return Promise.all(_.concat(ϑ, ρ))}


export default { open, close}