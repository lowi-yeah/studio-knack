import _              from 'lodash'
import anime          from 'animejs'
import {scaleLinear}  from 'd3-scale'
import {randomNormal} from 'd3-random'
import {parseSVG, 
        makeAbsolute} from 'svg-path-parser'

import gradient from './gradient'
import pattern  from './pattern'
import util     from './util'
import dom      from './dom'

// let EASINGS = ['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack']
let EASINGS     = ['linear', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine'],
    // viewbox of the logo svg is: '0 0 1920 809.4'
    BASEWIDTH   = 1920

function _getRatio() {
  let ww = window.innerWidth,
      kw = knackBase.getBoundingClientRect().width
  return ww/kw }

function _title(str) {
  return str.replace(/\b\S/g, function(t) { return t.toUpperCase() });
}

// we cannot use a simple resize, because the logo is a clipping path and
// normal svg scaling of such paths is not supported in all browsers
// instead, we need to parse the 'd' attribute of all strings and scale them directly
function _resize(baseCommands, options) {
  options = options || {}
  options = _.defaults(options, { δx:72, δy: 24, width: 200, relative: false})

  let σ = options.width/BASEWIDTH,
      h = σ * 809.4,
      logoFrame = document.querySelector('#logo-frame'),
      gridWrap  = document.querySelector('.grid-wrap')
  
  if(options.relative) logoFrame.style.height = `${h + options.δy + 64}px`    
  else if(gridWrap) gridWrap.style.paddingTop = `${h + 48}px`
  

  _.each(baseCommands, ζ => {
    let c = _.map(ζ.commands, command => {
                let result = {}
                result.code = command.code
                switch(command.code){
                  case ('C'): 
                    result.x   = options.δx + (σ * command.x)
                    result.x1  = options.δx + (σ * command.x1)
                    result.x2  = options.δx + (σ * command.x2)
                    result.y   = options.δy + (σ * command.y)
                    result.y1  = options.δy + (σ * command.y1)
                    result.y2  = options.δy + (σ * command.y2)
                    break
                
                  case 'H': 
                    result.x   = options.δx + (σ * command.x)
                    break
                
                  case 'L': 
                    result.x   = options.δx + (σ * command.x)
                    result.y   = options.δy + (σ * command.y)
                    break
                
                  case 'M': 
                    result.x   = options.δx + (σ * command.x)
                    result.y   = options.δy + (σ * command.y)
                    break
                
                  case 'S': 
                    result.x   = options.δx + (σ * command.x)
                    result.x2  = options.δx + (σ * command.x2)
                    result.y   = options.δy + (σ * command.y)
                    result.y2  = options.δy + (σ * command.y2)
                    break
                
                  case 'V': 
                    result.y   = options.δy + (σ * command.y)
                    break
                
                  case 'Z': break }
                  // console.log('result', result)
                return result
                }),
        d = _.map(c, command => {
                switch(command.code){
                  case 'C': return `C${command.x1},${command.y1},${command.x2},${command.y2},${command.x},${command.y}`
                  case 'H': return `H${command.x}`
                  case 'L': return `L${command.x},${command.y}`
                  case 'M': return `M${command.x},${command.y}`
                  case 'S': return `S${command.x2},${command.y2},${command.x},${command.y}`
                  case 'V': return `V${command.y}`
                  case 'Z': return 'Z'}}).join('')
    ζ.path.setAttribute('d', d)
  })
  
}

function setText(baseCommands, text, options) {

  document.getElementById('logo-sub').textContent = _title(text)
  document.getElementById('logo-rect').setAttribute('clip-path', `url(#${baseCommands.id})`)
  
  options = options || {}
  options = _.defaults(options, { width: 200})
  _resize( baseCommands, options )
}

function removeText(baseCommands, options) {
  let logoSub = document.getElementById('logo-sub')
  if(logoSub) logoSub.textContent = ''

  document.getElementById('logo-rect').setAttribute('clip-path', `url(#${baseCommands.id})`)

  // calculate the logo size
  let padding = 2 * 16,
      button  = 48 + 16,
      width   = 800 
  
  options = options || {}
  options = _.defaults(options, { width })

  options.width = _.min([window.innerWidth - padding - button, options.width])

  _resize( baseCommands, options )

  // hackedy hack
  // the about page is special and has a different svg structure
  // the text itself is solid, but there are 3D extrusions that are gradiented
  // so if we are in about-land, we also need to resize the characters shapes
  let fillins = document.getElementById('fillins')
  if(fillins) {
    let characters  = fillins.querySelectorAll('path'),
        commands    = _.map(characters, path => {
                          let commands = parseSVG(path.getAttribute('d'))
                          makeAbsolute(commands)
                          return {path, commands}})
    _resize( commands, options )
  }
}


function init() {
  return new Promise( resolve => {


    let largePaths      = document.querySelectorAll('#large-logo path'),
        largeCommands   = _.map(largePaths, path => {
                              let commands = parseSVG(path.getAttribute('d'))
                              makeAbsolute(commands)
                              return {path, commands}}),
        smallPaths      = document.querySelectorAll('#small-logo path'),
        smallCommands   = _.map(smallPaths, path => {
                              let commands = parseSVG(path.getAttribute('d'))
                              makeAbsolute(commands)
                              return {path, commands}})

    largeCommands.id = 'large-logo'
    smallCommands.id = 'small-logo'
    
    this.setText    = _.partial(setText, smallCommands)
    this.removeText = _.partial(removeText, largeCommands)

    // upon init check whether we're at the index page (render big logo),
    // or whether we're at a sub-page (render small logo with texts)
    let wrap      = document.getElementById('wrap'),
        pageType  = wrap.getAttribute('data-type').toLowerCase()

    if(pageType) {
      
      if(_.includes(['architecture', 'design', 'studio'], pageType) ) 
        setText(smallCommands, pageType, { δx: 72 })
      
      else if(_.isEqual(pageType, 'project') ) 
        removeText(smallCommands, { width: 128, δx:48, δy: 16 } )

      else if(_.isEqual(pageType, 'about') ) 
        removeText(largeCommands, { width: 800, δx:48, relative: true } )
      
      else removeText(largeCommands, { δx: 72 })}
    
    
    resolve() })}

export default {init, setText, removeText}