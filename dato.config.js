let _         = require('lodash'),
    htmlTag   = require('html-tag'),
    getPixels = require('get-pixels'),
    d3        = require('d3-scale')


var ratioΣ = d3.scaleQuantize()
                .domain([0.5, 2])
                .range([0.5, 1, 2])

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

function _articleContent(item) {
  let type = item.entity.itemType.apiKey

  console.log('ITEM:', item.entity.itemType.apiKey)

  if(type === 'article_text')  
    return { text: item.text }

  if(type === 'article_image') {  
      if(!item.image) return null
      let url   = item.image.url({ w: 1200, auto: 'compress' }),
          ratio = ratioΣ(item.image.width/item.image.height)
      return { image: { url, ratio }}}

  if(type === 'article_factsheet') 
    return { facts: {
              timeline: item.entity.timeline,
              status:   item.entity.status,
              location: { text: item.entity.location,
                          coordinates: item.entity.map },
              topology: item.entity.topology,
              size:     item.entity.size,
              client:   item.entity.client }}

   if(type === 'gallery') { 
    return { gallery: item.gallery.map(item => item.url({ w: 800, auto: 'compress' })) } }
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

  
  
  root.directory('content/entry', dir => {
    let entries = _.map(dato.entries, (entry, index) => {
                      let frontmatter = { title:        entry.title,
                                          images:       _.map(entry.gallery, image => 
                                                            { return { url:     image.url({ w: 800, auto: 'compress' }),
                                                                       info:    image.url({ fm: 'json' }),
                                                                       tiny:    image.url({ w: 2 }),
                                                                       palette: image.url({ w: 800, palette: 'json', colors: '2' }) }}),
                                          date:         entry.date,
                                          id:           'knc-' + index,
                                          tag:          entry.tag,
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

  // Articles
  // ————————————————————————————————
  root.directory('content/article', dir => {
    let articles  = _.map(dato.articles, (article, index) => {

                      // console.log('## article')
                      // console.log(article.content)

                      let αContent    = _.compact(article.content.map(item => _articleContent(item))), 
                          frontmatter = { title:        article.title,
                                          label:        article.label,
                                          category:     article.category,
                                          image:        { url:      article.heroImage.url({ w: 800, auto: 'compress' }),
                                                          info:     article.heroImage.url({ fm: 'json' }),
                                                          tiny:     article.heroImage.url({ w: 2 }),
                                                          palette:  article.heroImage.url({ w: 800, palette: 'json', colors: '2' }) },
                                          // seoMetaTags:  toHtml(dato.aboutPage.seoMetaTags),
                                          layout:       'article',
                                          id:           'knc-' + index,
                                          content:      αContent },
                          content     = '',
                          post        = {frontmatter, content}
                        return [`${article.slug}.md`, 'yaml', post]})
    _.each(articles, ([slug, format, post]) => dir.createPost(slug, format, post))})

}
