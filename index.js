const app = require('./app')
const port = 80
var fs = require('fs')
var http = require('http')
var https = require('https')
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8')
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8')

var credentials = {key: privateKey, cert: certificate};

// your express configuration here

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80, function (err) {
  if (err) {
    throw err
  }

  console.log(`server is listening on 80...`)
});
httpsServer.listen(443, function (err) {
  if (err) {
    throw err
  }

  console.log(`server is listening on 443...`)
})