const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose') // 載入 mongoose
const generateShortUrl = require('./models/shorten_url')
const baseUrl = 'http://localhost:3000/'
const Url = require('./models/url')
const app = express()
const PORT = 3000

mongoose.connect('mongodb://localhost/todo-list', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}) // 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

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
      res.render('index', { shortUrl })
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
