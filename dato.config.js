const htmlTag = require('html-tag');

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
    console.log('teammember', item.name)
    return {
      teammember: {
        image:        { url:   item.image.url({ w: 800, auto: 'compress' }),
                        ratio: item.image.width/item.image.height },
        name:         item.name,
        role:         item.role,
        description:  item.description}}}}

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

  // console.log('dato.aboutPage', dato.aboutPage.content)

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
  // Create directory (or empty it if already exists)...
  root.directory('content/entry', dir => {
    // ...and for each entry stored online...
    dato.entries.forEach((entry, index) => {
      // ...create a markdown file with all the metadata in the frontmatter
      dir.createPost(`${entry.slug}.md`, 'yaml', {
        frontmatter: {
          title:       entry.title,
          images:      entry.gallery.map(item => item.url({ w: 800, auto: 'compress' })),
          date:        entry.date,
          category:    entry.category,
          location:    entry.location,
          latlng:      entry.latlng,
          size:        entry.size,
          weight:      entry.date,
          emphasis:    entry.emphasis,
          seoMetaTags: toHtml(entry.seoMetaTags) },
        content: entry.description || '' }) }) })

}
