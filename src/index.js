import express from 'express'
import path from 'path'
import cors from 'cors'
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname)

const PORT = 5555
const app = express();
app.use(cors())
app.disable('x-powered-by').disable('etag')

app.use('/', async (req, res, next) => {
  return next()
},
express.static(path.join(__dirname, '../dist'))
)

app.get('/', async (req, res) => {
  //express.static(path.join(__dirname, '../dist'))
  res.render(path.join(__dirname, '../dist/index.html'))
})
app.listen(PORT)

console.log('Front server started in port ', PORT)

