let _         = require('lodash'),
    htmlTag   = require('html-tag'),
    getPixels = require('get-pixels')

let ratioΣ = n => _.max([0.5, _.min([Math.round(n * 2)/2, 2])])


function _guid(prefix) {
  prefix = `${prefix}-` || ''
  let s4 = () =>  Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1)
  // return prefix + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4() 
  return prefix + s4() + s4() + '-' + s4() + s4() }


// This function helps transforming structures
// —eg. [{ tagName: 'meta', attributes: { name: 'description', content: 'foobar' } }]—
// into proper HTML tags: <meta name="description" content="foobar" />
function _toHtml(tags) {
  return tags
          .map(({ tagName, attributes, content }) => htmlTag(tagName, attributes, content))
          .join('') }

function _image(image) {
  let ratio   = ratioΣ(image.width/image.height),
      width   = 1200,
      height  = width / ratio
  return {  url:    image.url({ w: width, h: height, auto: 'compress' }),
            id:     _guid('i'),
            ratio:  ratioΣ(image.width/image.height),
            tiny:   image.url({ w: width/100, h: height/100, auto: 'compress' }) }}

function _aboutContent(item) {
  let type = item.entity.itemType.name

  if(type === 'text')   return {text: item.text}
  if(type === 'image') { 
    return {image: _image(item.image)}}
  if(type === 'teammember') { 
    return {teammember: {
              image:        _image(item.image),
              name:         item.name,
              role:         item.role,
              description:  item.description}}}}

function _projectContent(item) {
  let contentType = item.entity.itemType.apiKey
  if(contentType === 'text_block')  
    return { text: item.content }

  if(contentType === 'image_block') {  
      if(!item.image) return null
      let ι = _image(item.image)
      ι.caption = item.caption
      ι.size    = item.size
      return { image: ι}}

   if(contentType === 'gallery_block') { 
    return { gallery: item.images.map(item => _image(item)) } 

  } }

function _projectBase(project, index, options) {
  return {title:        project.title,
          label:        project.label,
          image:        _image(project.coverImage),
          seoMetaTags:  _toHtml(project.seoMetaTags),
          type:         options.type,
          id:           options.prefix + '-' + index,
          // content is being written into the frontmatter instead of the content section of the post
          content:      _.compact(project.content.map(item => _projectContent(item))) }}

function _mapLink(text, coordinates) {
  let p = { api:        1,  
            map_action: 'map',
            // basemap:    'terrain',
            zoom:       14,
            center:     `${coordinates.latitude},${coordinates.longitude}` },
      s = _.map(p, (v, k) => `${k}=${v}`).join('&')
  return `[${text}](https://www.google.com/maps/@?${s})` }

function _projectStats(project, type) {
  let stats = {}

  if(type === 'architecture') 
    stats =  {timeline: project.timeline,
              status:   project.status,
              topology: project.topology,
              client:   project.client }

  if(type === 'design') 
    stats =  {timeline:   project.timeline,
              status:     project.status,
              discipline: project.discipline,
              client:     project.client }

  // remove unset values
  stats = _.reduce(stats, (ρ, v, k) => {
              if(v) ρ[k] = v
              return ρ }, {})

  // location needs special treatment, as two fields (location & map)
  // are being lumped together
  if(project.location) {
    stats.location = { text: project.location }
    if (project.map) { 
      stats.location = _.merge(stats.location, project.map)
      stats.location.href = _mapLink(project.location, project.map) }}

  // if none of the stats fields is set, return null
  if(_.isEmpty(stats)) return null
  return { stats } }

function _projects(datoProjects, options) {
  return _.map(datoProjects, (project, index) => {
            let base        = _projectBase(project, index, options),
                stats       = _projectStats(project, options.type),
                frontmatter = _.merge(base, stats)
                content     = '',
                post        = {frontmatter, content}
              return [`${project.slug}.md`, 'yaml', post] })}

function _index(options) {
  let conentTypes = {conentTypes: [options.type]},
      menu        = {menu:
                          _(['architecture', 'design', 'studio'])
                            .without(options.type)
                            .reduce((ρ, τ) => { 
                              ρ[τ] = {id:   τ,
                                      text: τ,
                                      href: `/${τ}`}
                              return ρ}, {home: { id:   'home',
                                                  text: 'everything',
                                                  href: '/'}})
                            },

      // conentTypes: ["architecture", "design", "studio"]
      // menu: 
      //   - id:   "architecture"
      //     text: "architecture"
      //     href: "/architecture"
        
      //   - id:   "design"
      //     text: "design"
      //     href: "/design"
      //   - id:   "studio"
      //     text: "studio"
      //     href: "/studio"

      frontmatter = _.merge(conentTypes, menu),
      content     = '',
      post        = {frontmatter, content}
  return { slug: `_index.md`, format: 'yaml', post }
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

  
  // Global & SEO
  // ————————————————————————————————

  // @obacht! no i18n yet
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

  settings.faviconMetaTags  = _toHtml(dato.site.faviconMetaTags)
  settings.seoMetaTags      = _toHtml(metaTags)
  settings.title            = globalSeo.siteName

  root.createDataFile('data/settings.yml', 'yaml', settings)


  // Architecture
  // ————————————————————————————————
  root.directory('content/architecture', dir => {
    let options   = { type: 'architecture',
                      prefix: 'knck-a'},
        projects  = _projects(dato.architectures, options),
        index     = _index(options)
    _.each(projects, ([slug, format, post]) => dir.createPost(slug, format, post))
    // console.log('architecture index', index)
    console.log('index.post', index.post.frontmatter)
    dir.createPost(index.slug, index.format, index.post)
  })

  // Design
  // ————————————————————————————————
  root.directory('content/design', dir => {
    let options   = { type: 'design',
                      prefix: 'knck-d'},
        projects  = _projects(dato.designs, options),
        index     = _index(options)
    _.each(projects, ([slug, format, post]) => dir.createPost(slug, format, post))
    // dir.createPost(index.slug, index.format, index.post)
  })

  // Studio
  // ————————————————————————————————
  root.directory('content/studio', dir => {
    let options   = { type: 'studio',
                      prefix: 'knck-s'}
        projects  = _projects(dato.studios, options),
        index     = _index(options)
    _.each(projects, ([slug, format, post]) => dir.createPost(slug, format, post))
    // dir.createPost(index.slug, index.format, index.post)
  })

  // Create a markdown file with content coming from the `about_page` item
  // type stored in DatoCMS
  // root.createPost(`content/about.md`, 'yaml', {
  //   frontmatter: {
  //     title:        dato.aboutPage.title,
  //     images:       dato.aboutPage.gallery.map(item => item.url({ w: 800, auto: 'compress' })),
  //     content:      dato.aboutPage.content.map(item => _aboutContent(item)),
  //     seoMetaTags:  _toHtml(dato.aboutPage.seoMetaTags),
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
  //                                         // seoMetaTags:  _toHtml(dato.aboutPage.seoMetaTags),
  //                                         layout:       'article',
  //                                         id:           'knc-' + index,
  //                                         content:      αContent },
  //                         content     = '',
  //                         post        = {frontmatter, content}
  //                       return [`${article.slug}.md`, 'yaml', post]})
  //   _.each(articles, ([slug, format, post]) => dir.createPost(slug, format, post))})

}
