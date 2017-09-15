import anime          from 'animejs'
import {scaleLinear}  from 'd3-scale'
import util           from './util'


export default {

  boringHero: () => {
    let heroF = document.getElementById('hero-frame'),
        hfh   = heroF.clientHeight,
        hero  = document.getElementById('hero'),
        σ     = scaleLinear()
                  .domain([0, window.innerHeight*0.618])
                  .rangeRound([100, 24]),
        ƒ     = () => { let τ = util.scrollTop(),
                            ς = σ(τ)/100
                        hero.style.transform = `scale(${ς})`
                        heroF.style.height   = `${(hfh * ς) + 24}px`
        }

    σ.clamp(true)
    ƒ() 

    console.log('hero', hero)
    util.addEvent(window, 'scroll', ƒ)

    // body...
  }
}