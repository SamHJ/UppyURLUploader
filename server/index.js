const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser')
const session = require('express-session')
const companion = require('@uppy/companion')
const tus = require('tus-node-server');
const path = require('path');
const multer = require('multer')
const server = new tus.Server();
const uploadApp = express();

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../", "downloads"),
  filename: (req,file,cb)=>{
    cb(null,file.originalname)
  }
})

const uploadFile = multer({storage}).single('file')

const getFileName = (req)=> {
  const fileinfo = JSON.parse(req.headers.fileinfo)
  if(fileinfo.extension) return fileinfo.name

  /*handle the case where this file's url has no extension attached to it, 
    but leads to a downloadable content
    e.g https://avatars.githubusercontent.com/u/8690438?s=88&u=417f4a3aae31bbc99de48c827523cffcb1ec845e&v=4
  */
  const newName = +new Date()
  let extension = 'txt' //default file extension

  const mE = fileinfo.type.split("/")[1] /* most likely extension. e.g image/jpeg returns jpeg 
  as the most likely extension. For application/pdf it is pdf, for image/gif, it is gif etc.
  */
  if(mE){
    extension = mE
  }
  return `${newName}.${extension}`
}

server.datastore = new tus.FileStore({
  path: '/downloads',
  namingFunction: (req)=>getFileName(req)
});

const app = express()

app.use(cors())
app.options('*', cors())
app.use(bodyParser.json())
app.use(session({
  secret: 'my_uppy_secret',
  resave: true,
  saveUninitialized: true,
}))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  next()
})

uploadApp.all('*', server.handle.bind(server));

app.use('/upload',uploadApp);

app.post('/xhr-upload',uploadFile,(req,res)=>{
  if(req.file) return res.json({success:true})

  res.send("file upload failed")
})

// initialize uppy
const uppyOptions = {
  server: {
    host: 'localhost:3020',
    protocol: 'http',
    path: ""
  },
  filePath: './output',
  secret: 'my_uppy_secret',
  debug: true,
}

app.use(companion.app(uppyOptions))

//allow uploaded files to be viewable via their url
app.use('/downloads',express.static('downloads'))

// handle 404 error
app.use((req, res) => {
  return res.status(404).json({ message: 'Not Found' })
})

// handle server errors
app.use((err, req, res) => {
  console.error('\x1b[31m', err.stack, '\x1b[0m')
  res.status(err.status || 500).json({ message: err.message, error: err })
})

const port = process.env.PORT || 3020

companion.socket(app.listen(port), uppyOptions)

console.log(`Uppy URL uploader listening on ${port}`)