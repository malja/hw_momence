import express from 'express'
import cors from 'cors'
import { createProxyMiddleware } from 'http-proxy-middleware'
import dotenv from 'dotenv'
dotenv.config()

export const app = express()

const corsOptions = {
    origin: '*'
}
app.use(cors(corsOptions))

app.use('/proxy', createProxyMiddleware({
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
