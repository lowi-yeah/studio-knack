import anime          from 'animejs'
import {scaleLinear}  from 'd3-scale'
import util           from './util'


export default {
  boringHero: () => {
    let heroF = document.getElementById('hero-frame'),
        hfh   = heroF.clientHeight,
        hero  = document.getElementById('hero'),
        min   = 64/hero.clientHeight,
        δ     = [0, window.innerHeight],
        σΣ     = scaleLinear()
                  .domain(δ)
                  .range([1, min]),
        hΣ    = scaleLinear()
                  .domain(δ)
                  .rangeRound([hfh, 92]),
        ƒ     = () => { let τ = util.scrollTop()
                        hero.style.transform = `scale(${σΣ(τ)})`
                        heroF.style.height   = `${hΣ(τ)}px` }

    σΣ.clamp(true)
    hΣ.clamp(true)
    ƒ() 

    util.addEvent(window, 'scroll', ƒ)

    // body...
  }
}