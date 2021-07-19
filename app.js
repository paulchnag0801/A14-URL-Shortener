const express = require('express')
const exphbs = require('express-handlebars')
const generateShortUrl = require('./models/shorten_url')
const baseUrl = 'https://powerful-journey-36561.herokuapp.com/'
const Url = require('./models/url')
const app = express()
const PORT = process.env.PORT || 3000

require('./config/mongoose')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', async (req, res) => {
  const shortUrl = await generateShortUrl()
  const originalUrl = req.body.originalUrl
  const urlResults = {
    originalUrl,
    shortUrl,
  }
  Url.create(urlResults)
    .then(() => {
      res.render('index', { shortUrl, originalUrl })
    })
    .catch((error) => console.log(error))
})

// redirect short URL to original URL
app.get('/:id', (req, res) => {
  const shortUrl = baseUrl + req.params.id
  Url.findOne({ shortUrl: shortUrl })
    .lean()
    .then((urlResult) => {
      res.redirect(`${urlResult.originalUrl}`)
    })
    .catch((error) => console.error(error))
})

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})
