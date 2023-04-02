const { createProxyMiddleware } = require('http-proxy-middleware')

const proxy = createProxyMiddleware({
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
})

const allowCors = fn => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }
    return await fn(req, res)
}

async function handler(req, res) {
    return proxy(req, res)
}

module.exports = allowCors(handler)
