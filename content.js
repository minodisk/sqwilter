const s = document.createElement('script')
s.src = chrome.extension.getURL('exec.js')
document.body.appendChild(s)
