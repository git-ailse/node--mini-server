/*
 * simple node server
 */
const fs       = require('fs')
const path     = require('path')
const http     = require("http")
const url      = require("url")
const handlers = loadDir('api')

// handle
const handle = async (request, response) => {
  const handler = handlers[request.pathname]
  // 如果资源存在
  if (typeof handler === 'function') {
    let result
    switch(request.method){
      case 'OPTIONS':
        response.writeHead(200, { "Allow": 'POST' })
        response.end()
        break        
      case 'POST':
        try {
          result = await handler(request)
          console.log('result', result);
          response.writeHead(result && result.statusCode || 200, {
            "Content-Type": "application/json charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
            "Access-Control-Allow-Headers": "authorization,content-type",
            "Access-Control-Allow-Methods": "GET, PUT, POST, PATCH, OPTIONS"
          })
          response.write(JSON.stringify(result || '{}'))
          response.end()
        } catch (err) {
            response.writeHead(err.statusCode, {"Content-Type": "application/json charset=utf-8"})
            err.statusCode === 400 
              && response.write(JSON.stringify({ 
                message: `400请求错误，${err.message}`
              })) 
              || response.write(JSON.stringify({ 
                message: `500服务器错误，${err.message}`
              }))
              response.end()
        }
        break        
      default:
        response.writeHead(400,  {"Content-Type": "application/json charset=utf-8"})
        response.write(JSON.stringify({message: '400请求错误，不允许的请求方法'}))
        response.end()
    }
  // 如果资源不存在
  } else {
    response.writeHead(404,  {"Content-Type": "application/json charset=utf-8"})
    response.write(JSON.stringify({ message: '404错误，请求的资源不存在！'}))
    response.end()
  }
}

// server
const onRequest = (request, response) => {
  console.log(request.method, request.url)
  request.pathname = url.parse(request.url).pathname.replace(/^\//,'')
  request.query = url.parse(request.url, true).query || {}
  request.setEncoding("utf8")
  let body = ""
  request.addListener("data", function(bodyChunk) {
    body += bodyChunk
  })
  request.addListener("end", function() {
    console.log('body: ' + body)
    request.body = JSON.parse(body || '{}')
    handle(request, response)
  })
}

// start
http.createServer(onRequest).listen(process.env.PORT || 3000)
console.log("cli node server is ok!")


// modules loading
function loadDir(dir) {
    patcher = {}
    function load(path, name) {
        if (name) {
            return require(path + name)
        }
        return require(path)
    }
    fs.readdirSync(__dirname + '/' + dir).forEach(function (filename) {
        if (!/\.js$/.test(filename)) {
            return
        }
        const name = path.basename(filename, '.js')
        const _load = load.bind(null, './' + dir + '/', name)

        patcher.__defineGetter__(name, _load)
    })
    return patcher
}
