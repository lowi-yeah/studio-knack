import {TweenLite} from 'gsap'

//Distance Formula
function distMetric(x,y,x2,y2) {
  let xDiff = x - x2,
      yDiff = y - y2
  return (xDiff * xDiff) + (yDiff * yDiff) }

//Detect Closest Edge
function closestEdge(x,y,w,h) {
  let topEdgeDist     = distMetric(x,y,w/2,0),
      bottomEdgeDist  = distMetric(x,y,w/2,h),
      leftEdgeDist    = distMetric(x,y,0,h/2),
      rightEdgeDist   = distMetric(x,y,w,h/2),
      min             = Math.min(topEdgeDist,bottomEdgeDist,leftEdgeDist,rightEdgeDist)

  switch (min) {
    case leftEdgeDist:    return 'left'
    case rightEdgeDist:   return 'right'
    case topEdgeDist:     return 'top'
    case bottomEdgeDist:  return 'bottom' } }

function _coordinates(self, e) {
  function _offset({x, y}, ε) {
    x += ε.offsetLeft
    y += ε.offsetTop

    if(ε.className.match(/\bpackery\b/)) return {x, y}
    else return _offset({x, y}, ε.parentNode) }

  let {x, y} = _offset({x: 0, y: 0}, self) 
  x = e.pageX - x
  y = e.pageY - y
  return {x, y}
}

export default function initHover() {
  let items = document.querySelectorAll('.grid-item > .box > .content')

  _.each(items, item => {
    item.onmouseenter = function(e){
      let {x, y}    = _coordinates(this, e),
          edge      = closestEdge(x, y, this.clientWidth, this.clientHeight),
          overlay   = this.getElementsByClassName('overlay')[0]
  
      switch(edge){
        case 'left':
          //tween overlay from the left
          overlay.style.top = '0%'
          overlay.style.left = '-100%'
          TweenLite.to(overlay, .5, {left: '0%'})
          break
        case 'right':
          overlay.style.top = '0%'
          overlay.style.left = '100%'
          //tween overlay from the right
          TweenLite.to(overlay, .5, {left: '0%'})
          break
        case 'top':
          overlay.style.top = '-100%'
          overlay.style.left = '0%'
          //tween overlay from the right
          TweenLite.to(overlay, .5, {top: '0%'})
          break
        case 'bottom':
          overlay.style.top = '100%'
          overlay.style.left = '0%'
          //tween overlay from the right
          TweenLite.to(overlay, .5, {top: '0%'})
          break}}
  
     
    item.onmouseleave = function(e){
      let {x, y}  = _coordinates(this, e),
          edge    = closestEdge(x,y,this.clientWidth, this.clientHeight),
          overlay = this.getElementsByClassName('overlay')[0]
  
      switch(edge){
        case 'left':
          TweenLite.to(overlay, .5, {left: '-100%'})
          break
        case 'right':
          TweenLite.to(overlay, .5, {left: '100%'})
          break
        case 'top':
          TweenLite.to(overlay, .5, {top: '-100%'})
          break
        case 'bottom':
          TweenLite.to(overlay, .5, {top: '100%'})
          break }}})}
