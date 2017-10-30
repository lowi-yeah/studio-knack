
import lunr from 'lunr'

let URL = '/lunr-knack.json',
    idx

function init(worker) {
  return new Promise(resolve => {
    worker.onmessage = function (event) {
      idx = lunr.Index.load(event.data)
      // console.log('idx', idx)
      resolve(worker)
    }
    worker.postMessage({url: URL, type: 'json'})  
  })
  
}

function search(string) {
  let searchResults = idx.search(string)
}

export default { init, search }