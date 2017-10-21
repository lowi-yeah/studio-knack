let _         = require('lodash'),
    htmlTag   = require('html-tag'),
    getPixels = require('get-pixels'),
    d3        = require('d3-scale')

// let ratioΣ = d3.scaleQuantize()
//                 .domain([0.5, 1, 2])
//                 .range([0.5, 1, 2])

let ratioΣ = n => _.max([0.5, _.min([Math.round(n * 2)/2, 2])])

// This function helps transforming structures
// —eg. [{ tagName: 'meta', attributes: { name: 'description', content: 'foobar' } }]—
// into proper HTML tags: <meta name="description" content="foobar" />
const toHtml = (tags) => {
  return tags.map(({ tagName, attributes, content }) => (
    htmlTag(tagName, attributes, content) )).join('')}

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
  if(type === 'article_text')  
    return { text: item.text }

  if(type === 'article_image') {  
      if(!item.image) return null
      let id      = 'i-' + item.image.url().match(/\d{5,}/)[0],
          url     = item.image.url({ w: 1200, auto: 'compress' }),
          ratio   = ratioΣ(item.image.width/item.image.height),
          tiny    = item.image.url({ w: 16, auto: 'compress' }),
          info    = item.image.url({ fm: 'json' }),
          palette = item.image.url({ w: 800, palette: 'json', colors: '4' }),
          caption = item.caption,
          size    = item.size
      return { image: { id, url, ratio, tiny, info, palette, caption, size }}}

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
    return { gallery: item.gallery.map(item => item.url({ w: 1200, auto: 'compress' })) } }
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

  
  //      _             _   _
  //  ___| |__  __ _ __| |_| |_
  // / _ \ '_ \/ _` / _| ' \  _|
  // \___/_.__/\__,_\__|_||_\__| in i18n yet

  let settings  = {},
      imageBase = 'https://www.datocms-assets.com',
      globalSeo = _(dato.site.globalSeo.value).values().first(),
      metaTags  = [ { tagName:    'meta',
                      attributes: { name:    'description',
                                    content: globalSeo.fallbackSeo.description }},
                    { tagName:    'meta',
                      attributes: { property: 'og:title',
                                    content: globalSeo.siteName }},
                    { tagName:    'meta',
                      attributes: { property: 'og:description',
                                    content: globalSeo.fallbackSeo.description }},
                    { tagName:    'meta',
                      attributes: { property: 'og:image',
                                    content: imageBase + globalSeo.fallbackSeo.image.path }},
                    { tagName:    'meta',
                      attributes: { property: 'og:url',
                                    content: globalSeo.facebookPageUrl }},
                     { tagName:    'meta',
                      attributes: { property: 'og:site_name',
                                    content: globalSeo.siteName }},
                    { tagName:    'meta',
                      attributes: { property: 'twitter:card',
                                    content: 'summary_large_image' }},
                    { tagName:    'meta',
                      attributes: { property: 'twitter:image:alt',
                                    content: globalSeo.siteName }},
                    { tagName:    'meta',
                      attributes: { property: 'twitter:site',
                                    content: globalSeo.twitterAccount }} ]

  settings.faviconMetaTags  = toHtml(dato.site.faviconMetaTags)
  settings.seoMetaTags      = toHtml(metaTags)
  settings.title            = globalSeo.siteName

  root.createDataFile('data/settings.yml', 'yaml', settings)

  // Categories
  // ————————————————————————————————  
  // load the categories and put them into the config
  // categories are the validation-values of entry > category
  // var categoryId = '53589',
  //     categories = dato.entitiesRepo.entities.field[categoryId].validators.enum.values;

  var categories = ['architecture', 'design', 'studio']

  // Create a markdown file with content coming from the `about_page` item
  // type stored in DatoCMS
  // root.createPost(`content/about.md`, 'yaml', {
  //   frontmatter: {
  //     title:        dato.aboutPage.title,
  //     images:       dato.aboutPage.gallery.map(item => item.url({ w: 800, auto: 'compress' })),
  //     content:      dato.aboutPage.content.map(item => _aboutContent(item)),
  //     seoMetaTags:  toHtml(dato.aboutPage.seoMetaTags),
  //     type:         'extra',
  //     layout:       'about' }
  // });

  // Articles
  // ————————————————————————————————
  // root.directory('content/article', dir => {
  //   let articles  = _.map(dato.articles, (article, index) => {

  //                     // console.log('## article')
  //                     // console.log(article.content)

  //                     let αContent    = _.compact(article.content.map(item => _articleContent(item))), 
  //                         frontmatter = { title:        article.title,
  //                                         label:        article.label,
  //                                         category:     article.category,
  //                                         image:        { url:      article.heroImage.url({ w: 800, auto: 'compress' }),
  //                                                         info:     article.heroImage.url({ fm: 'json' }),
  //                                                         tiny:     article.heroImage.url({ w: 2 }),
  //                                                         palette:  article.heroImage.url({ w: 800, palette: 'json', colors: '2' }) },
  //                                         // seoMetaTags:  toHtml(dato.aboutPage.seoMetaTags),
  //                                         layout:       'article',
  //                                         id:           'knc-' + index,
  //                                         content:      αContent },
  //                         content     = '',
  //                         post        = {frontmatter, content}
  //                       return [`${article.slug}.md`, 'yaml', post]})
  //   _.each(articles, ([slug, format, post]) => dir.createPost(slug, format, post))})

}
