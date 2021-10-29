import("https://releases.transloadit.com/uppy/v2.2.1/uppy.min.js")

let fileInfo = {}

const uppy = new Uppy.Core({
    debug: true, 
    autoProceed: false,
    onBeforeFileAdded: (currentFile, _) => {
        fileInfo = {
            name: currentFile.name,
            type: currentFile.type,
            extension: currentFile.extension,
            size: currentFile.data.size
        }

        uppy.use(Uppy.Tus, { headers: {fileInfo:JSON.stringify(fileInfo)}, endpoint: 'http://localhost:3020/upload/' })
    }
  })
  .use(Uppy.Dashboard, { inline: true, target: '#drag-drop-area',showProgressDetails: true, })
  .use(Uppy.Url, { target: Uppy.Dashboard, companionUrl: 'http://localhost:3020' })
  .use(Uppy.GoldenRetriever)
  
  uppy.on('complete', result => {
    if(result.successful){
        document.querySelector('.uppy-file-url-input').value = result.successful[0].uploadURL.split("/upload/").join("/")
    }
    flushTUS()
  })

  uppy.on('upload-error', (file, error, response) => {
    flushTUS()
  });

  const flushTUS = ()=>{
    //remove Tus plugin from uppy instnce
    uppy.removePlugin(uppy.getPlugin('Tus'))
  }

  const copyToClipboard = ()=>{
    var copyTextarea = document.querySelector('.uppy-file-url-input');
    copyTextarea.focus();
    copyTextarea.select();

    try {
      document.execCommand('copy');
      alert(`Link copied successfully!`)
    } catch (err) {
      alert('Oops, unable to copy link');
    }
  }