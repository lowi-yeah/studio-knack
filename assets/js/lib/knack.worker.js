import request from '../lib/request'

function base64Encode(str) {
        var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var out = "", i = 0, len = str.length, c1, c2, c3;
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += CHARS.charAt(c1 >> 2);
                out += CHARS.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += CHARS.charAt(c1 >> 2);
                out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                out += CHARS.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += CHARS.charAt(c3 & 0x3F);
        }
        return out;
    }

function mimetype(url) {
  // get the mimetype by
  // …first removing the path
  let μ = url.replace(/^https:\/\/www.datocms\-assets.com\/(\d+\/)*/, '')
  // …and then removing the query parameters
  μ  = μ.replace(/\?.*$/, '')
  // …what is left is the filename
  // …from which we get the filetype
  μ  = μ.replace(/^[^\.]*\./, '')
  return μ }

function _image(δ, self) {
  request.image(δ.url)
    .then( ι => {
      var encoded = base64Encode(ι),
          μ       = mimetype(δ.url),
          image   = `data:image/${μ};base64,${encoded}`
      if(δ.bg) image = `url(${image})`
      self.postMessage( { ι: image, id: δ.id, bg: δ.bg })})
    .catch( error => self.postMessage( { id: δ.id, error }))
  }

function _json(δ, self) {
  request.json(δ.url)
    .then( j => self.postMessage( j ))
    .catch( error => self.postMessage( { error }))}

//Listener for events of message type coming from main thread.
self.addEventListener('message', function(e) {
  let δ = e.data,
      τ = δ.type

  if(δ.type === 'image')  _image(δ, self)
  if(δ.type === 'json')   _json(δ, self)
}, false)