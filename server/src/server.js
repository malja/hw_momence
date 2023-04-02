const express = require('express')
const cors = require('cors')
const proxyMiddleware = require('http-proxy-middleware')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

const corsOptions = {
    origin: '*'
}
app.use(cors(corsOptions))

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

app.listen(process.env.PORT || 8000)

module.exports = app
