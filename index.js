require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('dns')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

const options = {
  all: true
}
const urlList = {}
let i = 0

app.use(bodyParser.urlencoded({ extended: true }))

app.post("/api/shorturl/", (req, res) => {
  const url = req.body.url
  const cleanUrl = url.replace(/https?:\/\//gi, '').replace(/ftp?:/gi, '').split('/')[0]
  dns.lookup(cleanUrl, options, (err, adresses, family) => {
    if (err) {
      console.error(err)
      res.json({ error: 'invalid url' })
    }
    else {
      urlList[i] = url
      i++
      res.json({ original_url: url, short_url: (i - 1).toString() })
    }
  })
})

app.get('/api/shorturl/:url', (req, res) => {
  url = parseInt(req.params.url)
  if (urlList[url]) {
    res.redirect(urlList[url])
  }
  else {
    res.json({ error: 'invalid short url' })
  }
})