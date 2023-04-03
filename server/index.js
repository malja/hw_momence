const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware')

const proxy = createProxyMiddleware({
    target: process.env.EXTERNAL_API_URL,
    changeOrigin: true,

    selfHandleResponse: true,

    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        res.removeHeader('Access-Control-Allow-Origin')
        return res
    }),

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
