'use strict'

;['exec.js'].forEach((src) => {
  const s = document.createElement('script')
  s.src = chrome.extension.getURL(src)
  document.body.appendChild(s)
})
