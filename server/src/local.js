const express = require('express')
const cors = require('cors')
const fs = require('fs')
const colors = require('colors')
const proxyMiddleware = require('http-proxy-middleware')
const dotenv = require('dotenv')
dotenv.config()

console.log('Starting local mock server...'.green)

if (!fs.existsSync('public/daily.txt')) {
    console.error('> File public/daily.txt does not exist. Create it!'.red)
    process.exit(1)
}

export const app = express()

const corsOptions = {
    origin: '*'
}
app.use(cors(corsOptions))

console.log('> Loading data files...')

const dailyData = fs.readFileSync('public/daily.txt', 'utf8')

console.log('> Serving ' + '"daily.txt"'.yellow)

app.use('/proxy', proxyMiddleware.createProxyMiddleware({
    target: process.env.EXTERNAL_API_URL,
    changeOrigin: true,
    onError: (err, req, res) => {
        console.error('Proxy error:', err)
        res.status(500).send('Proxy error')
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request:', req.originalUrl)
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log('Proxying response:', req.url, res.statusCode)
    },
    pathRewrite: { '^/proxy': '' }
}));

app.get('/daily.txt', (req, res) => {
    console.log('GET ' + req.originalUrl, req.headers)
    res.send(dailyData)
})

console.log('Listening on ' + '8000'.green)
app.listen(8000)
