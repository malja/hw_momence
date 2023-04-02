import express from 'express'
import fs from 'fs'
import colors from 'colors'
import cors from 'cors'

console.log('Starting local mock server...'.green)

if (!fs.existsSync('public/daily.txt')) {
    console.error('> File public/daily.txt does not exist. Create it!'.red)
    process.exit(1)
}

const app = express()

const corsOptions = {
    origin: '*'
}
app.use(cors(corsOptions))

console.log('> Loading data files...')

const dailyData = fs.readFileSync('public/daily.txt', 'utf8')

console.log('> Serving ' + '"daily.txt"'.yellow)

app.get('/daily.txt', (req, res) => {
    console.log('GET ' + req.originalUrl, req.headers)
    res.send(dailyData)
})

console.log('Listening on ' + '8000'.green)
app.listen(8000)
