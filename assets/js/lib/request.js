
function json(url) {
  console.log('request. load json', url)
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.overrideMimeType("text/plain; charset=x-user-defined");
    
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) // Success!
        resolve(JSON.parse(request.responseText))
        // resolve(request.responseText)
      else // We reached our target server, but it returned an error
        reject(request.responseText)}

    request.onerror = () => reject(request)
    request.send()
  })
}

function image(url) {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.overrideMimeType("text/plain; charset=x-user-defined");
    // mimeType: "text/plain; charset=x-user-defined",
    
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) // Success!
        resolve(request.responseText)
      else // We reached our target server, but it returned an error
        reject(`image request failed with status ${request.status}`)}
    request.onerror = () => reject(`image request failed with status ${request.status}`)

    request.send()
  })
}

export default { json, image }