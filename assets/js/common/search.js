
import lunr from 'lunr'

let URL = '/assets/lunr.json',
    idx

function init(worker) {
  return new Promise(resolve => {
    worker.onmessage = event => {
      idx = lunr.Index.load(JSON.parse(event.data))

      console.log('search index', JSON.parse(event.data))
      
      resolve(worker) }
    worker.postMessage({url: URL, type: 'json'})  })}

function makeResult(lunrResult) {

  console.log('make search result', lunrResult)
  let results = document.getElementById('search-results'),
      item    = document.getElementById(lunrResult.ref),
      title   = item.getAttribute('data-caption'),
      type    = item.getAttribute('data-type'),
      href    = item.getAttribute('data-link'),
      image   = item.querySelector('.image')
      
  let ε = document.createElement('a'),
      i = document.createElement('div'),
      c = document.createElement('div')
  
  ε.classList.add('search-result')
  ε.classList.add('no-hover')
  ε.setAttribute('href', href)

  i.classList.add('image')
  i.setAttribute('style', image.getAttribute('style'))

  c.classList.add('caption')
  c.innerHTML = title

  ε.appendChild(i)
  ε.appendChild(c)
  results.appendChild(ε)
}

function search(string) {
  let lunrResults = idx.search(`*${string}*`),
      results = document.getElementById('search-results')

  results.innerHTML = ''
  _.each(lunrResults, result => makeResult(result))
}

export default { init, search }