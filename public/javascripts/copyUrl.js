// init variables
const copyUrl = document.querySelector('.short-url')
const copyBtn = document.querySelector('.copy-button')
const toolTip = document.querySelector('.tool-tip')

// copy function
if (copyUrl) {
  copyBtn.addEventListener('click', function btnOnClicked() {
    copyUrl.select() // select short URL
    if (document.execCommand('copy')) {
      // copy short URL to clipboard
      toolTip.classList.add('show') // show tool tip
      setTimeout(function removeToolTip() {
        toolTip.classList.remove('show')
      }, 700)
    } else {
      console.log('Umm.. Something is wrong...')
    }
  })
}
