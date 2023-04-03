const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware')

const proxy = createProxyMiddleware({
    target: process.env.EXTERNAL_API_URL,
    changeOrigin: true,

    selfHandleResponse: true,

    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
        res.setHeader('Access-Control-Allow-Credentials', true)
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
        res.setHeader(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        )

        return responseBuffer
    }),

    pathRewrite: { '^/proxy': '' }
})

async function handler(req, res) {
    return proxy(req, res)
}

module.exports = handler
