import("https://releases.transloadit.com/uppy/v2.2.1/uppy.min.js")

let fileInfo = {}

let isFromURL = false

document.addEventListener("DOMContentLoaded", function(){
  const urlBtn = document.querySelector('[data-uppy-acquirer-id="Url"]')
  const fileBtn = document.querySelector('[data-uppy-acquirer-id="MyDevice"]')
  urlBtn.addEventListener('click',(e)=>isFromURL = true)
  fileBtn.addEventListener('click',(e)=>isFromURL=false)
});

const uppy = new Uppy.Core({
    debug: true, 
    autoProceed: false,
    onBeforeFileAdded: (currentFile, _) => {
      // if(isFromURL){
      //     fileInfo = {
      //         name: currentFile.name,
      //         type: currentFile.type,
      //         extension: currentFile.extension,
      //         size: currentFile.data.size
      //     }
      //     const headers = {fileInfo:JSON.stringify(fileInfo)}
      //     uppy.use(Uppy.Tus, { headers, endpoint: 'http://localhost:3020/upload/' })
      //   }else{
          uppy.use(Uppy.XHRUpload, {endpoint: 'http://localhost:3020/xhr-upload', fieldName: 'file', formData: true })
        // }
    }
  })
  .use(Uppy.Dashboard, { inline: true, target: '#drag-drop-area',showProgressDetails: true})
  .use(Uppy.Url, { target: Uppy.Dashboard, companionUrl: 'http://localhost:3020' })
  .use(Uppy.GoldenRetriever)
  
  uppy.on('complete', res => {
    if(res.successful){
      const item = res.successful[0]
      if(item){
        let fileURL = ''
        if(isFromURL){
          console.log('from url: ')
          fileURL = item.uploadURL.split("/upload/").join("/")
        }else{
          console.log('from formdata: ')
          fileURL = `https://dload.tapnaija.com/uploads/${item.name}`
        }

        document.querySelector('.uppy-file-url-input').value = fileURL
      }
    }
    flushPlugin()
  })

  uppy.on('upload-error', (file, error, response) => {
    flushPlugin()
  });

  const flushPlugin = ()=>{
    if(isFromURL) return uppy.removePlugin(uppy.getPlugin('Tus'));
    uppy.removePlugin(uppy.getPlugin('XHRUpload'))
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