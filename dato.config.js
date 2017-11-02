let _         = require('lodash'),
    htmlTag   = require('html-tag'),
    getPixels = require('get-pixels'),
    lunr      = require('lunr'),
    fs        = require('fs')

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

function _projectSearchContent(item) {
  let contentType = item.entity.itemType.apiKey
  if(contentType === 'text_block')  return item.content
  if(contentType === 'image_block') return item.caption
  return '' }

function _projectSearchBase(project, index, options) {
  let content = _.compact(project.content.map(item => _projectSearchContent(item)))
  return {title: project.title,
          body: content.join(' '),
          type: options.type,
          slug: project.slug,
          id:   options.prefix + '-' + index}}

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
                post        = {frontmatter, content},
                search      = _projectSearchBase(project, index, options)
              return { slug: `${project.slug}.md`, format: 'yaml', post, search }})}

function _title(str) {
  return str.replace(/\b\S/g, function(t) { return t.toUpperCase() });
}

function _indexMenu(options) {
  let menu = _(['architecture', 'design', 'studio'])
                .reduce((ρ, τ, ι) => { 
                  ρ[`${options.prefix}-${τ}`] = { id:     τ,
                                                  order:  ι+1,
                                                  text:   τ,
                                                  href:   τ}
                  return ρ}, {})
  return {menu} }


function _index(options) {
  let type        = {type: _title(options.type)},
      conentTypes = {conentTypes: [options.type]},
      menu        = _indexMenu(options),
      frontmatter = _.merge(type, conentTypes, menu),
      content     = '',
      post        = {frontmatter, content}
  return { slug: `_index.md`, format: 'yaml', post }
}

function _mainIndex() {
  let options   = { type: 'index',
                    prefix: 'knck-index'},
      type        = {type: options.type},
      conentTypes = {conentTypes: ['architecture', 'design', 'studio']},
      menu        = _indexMenu(options),
      frontmatter = _.merge(type, conentTypes, menu),
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
  
  // Initialize search-index
  // ————————————————————————————————  
  let searchIndex = []

  // _index.md
  // ————————————————————————————————
  root.directory('content', dir => {
    let mainIndex = _mainIndex()
    dir.createPost(mainIndex.slug, mainIndex.format, mainIndex.post) })


console.log('root', root)

  // Architecture
  // ————————————————————————————————
  root.directory('content/architecture', dir => {
    let options   = { type: 'architecture',
                      prefix: 'knck-a'},
        projects  = _projects(dato.architectures, options),
        index     = _index(options)
    _.each(projects, ({slug, format, post}) => dir.createPost(slug, format, post))
    _.each(projects, ({search}) => searchIndex.push(search))
    dir.createPost(index.slug, index.format, index.post)
  })

  // Design
  // ————————————————————————————————
  root.directory('content/design', dir => {
    let options   = { type: 'design',
                      prefix: 'knck-d'},
        projects  = _projects(dato.designs, options),
        index     = _index(options)
    _.each(projects, ({slug, format, post}) => dir.createPost(slug, format, post))
    _.each(projects, ({search}) => searchIndex.push(search))
    dir.createPost(index.slug, index.format, index.post)
  })

  // Studio
  // ————————————————————————————————
  root.directory('content/studio', dir => {
    let options   = { type: 'studio',
                      prefix: 'knck-s'}
        projects  = _projects(dato.studios, options),
        index     = _index(options)
    _.each(projects, ({slug, format, post}) => dir.createPost(slug, format, post))
    _.each(projects, ({search}) => searchIndex.push(search))
    dir.createPost(index.slug, index.format, index.post)
  })

  // build search index
  // console.log('Lunr', lunr)
  var idx = lunr(function () {
              this.ref('id')
              this.field('title')
              this.field('type')
              this.field('body')
              searchIndex.forEach(function (doc) {
                this.add(doc) }, this) })

  fs.writeFile('public/lunr-knack.json', JSON.stringify(idx, null, 2), 'utf-8', 
      () => console.log('Search-index written to: public/lunr-knack.json'))


  // l.setOutput('public/lunr-knack.json')
  

}
