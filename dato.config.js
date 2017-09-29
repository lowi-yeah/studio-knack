let _         = require('lodash'),
    htmlTag   = require('html-tag'),
    getPixels = require('get-pixels'),
    tinycolor = require('tinycolor2')

// This function helps transforming structures
// —eg. [{ tagName: 'meta', attributes: { name: 'description', content: 'foobar' } }]—
// into proper HTML tags: <meta name="description" content="foobar" />
const toHtml = (tags) => (
  tags.map(({ tagName, attributes, content }) => (
    htmlTag(tagName, attributes, content) )).join(''))

function _aboutContent(item) {
  let type = item.entity.itemType.name

  if(type === 'text')   return {text: item.text}
  if(type === 'image') { 
    return {image: { url:   item.image.url({ w: 800, auto: 'compress' }),
                     ratio: item.image.width/item.image.height }}}
  if(type === 'teammember') { 
    return {teammember: {
              image:        { url:   item.image.url({ w: 800, auto: 'compress' }),
                              ratio: item.image.width/item.image.height },
              name:         item.name,
              role:         item.role,
              description:  item.description}}}}

function _download(uri) {
  return new Promise(function(resolve, reject){
    request.head(uri, function(err, res, body) {
        if(err) reject(err)
        resolve(res)})})}

function _getImageBrightness(image) {
  return new Promise((resolve, reject) => {
    let url = image.url({ w: 32, auto: 'compress' })
    getPixels(url, function(err, pixels) {
      if(err) reject(err)

      let [width, height, channels] = pixels.shape,
          sumBrightness = 0
  
      for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
          let channels      = pixels.pick(x, y, null),
              [cn]          = channels.shape,
              rgb           = _(cn)
                                .range()
                                .reduce((ρ, ι) => {
                                  if(ι === 0) ρ.r = channels.get(ι)
                                  if(ι === 1) ρ.g = channels.get(ι)
                                  if(ι === 2) ρ.b = channels.get(ι)
                                  if(ι === 3) ρ.a = channels.get(ι)/255.0
                                  return ρ }, {}),
              color         = tinycolor(rgb)
          sumBrightness += _.round(color.getBrightness())}}
  
      resolve({ url: image.url({ w: 800, auto: 'compress' }),
                brightness: _.round(sumBrightness/(width * height))})})})}

function _processImages(images) {
  let promises = _.map(images, _getImageBrightness)
  return Promise.all(promises)
}


// Arguments that will receive the mapping function:
//
// * dato:  lets you easily access any content stored in your DatoCMS administrative area
//
// * root:  represents the root of your project, and exposes commands to
//          easily create local files/directories
//
// * i18n:  allows to switch the current locale to get back content in
//          alternative locales from the first argument.
//
// Read all the details here:
// https://github.com/datocms/js-datocms-client/blob/master/docs/dato-cli.md

module.exports = (dato, root, i18n) => {
  
  // Add to the existing Hugo config files some properties coming from data
  // stored on DatoCMS
  ['config.dev.toml', 'config.prod.toml'].forEach(file => {
    root.addToDataFile(file, 'toml', {title:        dato.site.globalSeo.siteName,
                                      languageCode: i18n.locale })})

  // Categories
  // ————————————————————————————————  
  // load the categories and put them into the config
  // categories are the validation-values of entry > category
  var categoryId = '53589',
      categories = dato.entitiesRepo.entities.field[categoryId].validators.enum.values;

  // Create a YAML data file to store global data about the site
  root.createDataFile('data/settings.yml', 'yaml', {
    name:             dato.site.globalSeo.siteName,
    language:         dato.site.locales[0],
    intro:            dato.home.introText,
    copyright:        dato.home.copyright,
    // iterate over   all the `social_profile` item types
    socialProfiles:   dato.socialProfiles.map( profile => {
                      return {type: profile.profileType.toLowerCase().replace(/ +/, '-'),
                              url: profile.url }}),
    faviconMetaTags:  toHtml(dato.site.faviconMetaTags),
    seoMetaTags:      toHtml(dato.home.seoMetaTags),
    filters:          categories })

  // Create a markdown file with content coming from the `about_page` item
  // type stored in DatoCMS
  root.createPost(`content/about.md`, 'yaml', {
    frontmatter: {
      title:        dato.aboutPage.title,
      images:       dato.aboutPage.gallery.map(item => item.url({ w: 800, auto: 'compress' })),
      content:      dato.aboutPage.content.map(item => _aboutContent(item)),
      seoMetaTags:  toHtml(dato.aboutPage.seoMetaTags),
      type:         'extra',
      layout:       'about' }
  });

  // Entries
  // ————————————————————————————————
  // async doesn't work :(
  // new Promise( resolve => root.directory('content/entry', dir => resolve(dir)))
  //   .then(dir => {
  //     let entriesҎ = _.map(dato.entries, (entry, index) => {
  //                         return new Promise((resolve, reject) => {
  //                           _processImages(entry.gallery)
  //                             .then(images => {
  //                               let frontmatter = { title:       entry.title,
  //                                                   // images:      images,
  //                                                   date:        entry.date,
  //                                                   category:    entry.category,
  //                                                   location:    entry.location,
  //                                                   latlng:      entry.latlng,
  //                                                   size:        entry.size,
  //                                                   weight:      entry.date,
  //                                                   emphasis:    entry.emphasis,
  //                                                   seoMetaTags: toHtml(entry.seoMetaTags) },
  //                                   content     = entry.description || '' ,
  //                                   post        = { frontmatter, content}
  //                               resolve([`${entry.slug}.md`, 'yaml', post])})})})
  //     Promise.all(entriesҎ)
  //       .then( entries => {
  //         console.log('dirr', dir.createPost)
  //         _.each(entries, ([slug, format, post]) => {
  //           dir.createPost(slug, format, post)
  //         })
  //         done = true
  //       })
  //   })

  root.directory('content/entry', dir => {
    let entries = _.map(dato.entries, (entry, index) => {
                      let frontmatter = { title:        entry.title,
                                          images:       _.map(entry.gallery, image => 
                                                            { return { url:     image.url({ w: 800, auto: 'compress' }),
                                                                       info:    image.url({ fm: 'json' }),
                                                                       pallete: image.url({ w: 800, palette: 'json', colors: '2' }) }}),
                                          date:         entry.date,
                                          category:     entry.category,
                                          location:     entry.location,
                                          latlng:       entry.latlng,
                                          size:         entry.size,
                                          weight:       entry.date,
                                          emphasis:     entry.emphasis,
                                          seoMetaTags:  toHtml(entry.seoMetaTags) },
                          content     = entry.description || '' ,
                          post        = { frontmatter, content}
                        return [`${entry.slug}.md`, 'yaml', post]})
    _.each(entries, ([slug, format, post]) => {
      dir.createPost(slug, format, post)
    })                      
  })
}
