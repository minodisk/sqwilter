'use strict'

// Add UI for selecting filter
// ;(() => {
//   document.addEventListener('DOMContentLoadedl', () => {
//     const div = document.createElement('div')
//     const select = document.createElement('select')
//     div.appendChild(select)
//     const form = document.querySelector('#preferences form')
//     console.log(form)
//     form.appendChild(div)
//   }, false)
// })()

;(() => {
  const model = Sqwiggle.cache
  if (model.get('source-aspect') == null) {model.set('source-aspect', 'cropped')}
  if (model.get('source-filter') == null) {model.set('source-filter', 'none')}
})()

;(() => {
  const Av = Sqwiggle.View.Av.prototype
  const onRender = Av.onRender
  Av.onRender = (self) => {
    const $label1 = $('<label for="user-aspect">Aspect</label>')
    const $select1 = $('<select id="user-aspect">')
      .append($('<option value="cropped">Cropped</option>'))
      .append($('<option value="raw">Raw</option>'))
      .on('change', (e) => {
        var id = $(e.target).val()
        self.model.set({'source-aspect': id})
      })
    const $label2 = $('<label for="user-filter">Filter</label>')
    const $select2 = $('<select id="user-filter">')
      .append($('<option value="none">None</option>'))
      .append($('<option value="mosaic">Mozaic</option>'))
      .on('change', (e) => {
        var id = $(e.target).val()
        self.model.set({'source-filter': id})
      })
    self.$el.find('#user-camera').after($label1, $select1, $label2, $select2)
    self.$('#user-aspect').val(self.model.get('source-aspect'))
    self.$('#user-filter').val(self.model.get('source-filter'))
    onRender.call(self)
  }
})()

Sqwiggle.View.Video.prototype.captureSnapshot = (flash) => {
  if (flash === true) {
    this.$('.camera-flash').show().fadeOut(400)
  }

  // must have video first
  const video = this.$('video.active')[0]
  if (!(video && video.videoWidth && video.videoHeight)) return

  const model = Sqwiggle.cache
  const aspect = model.get('source-aspect')
  const width = 640
  const height = 480

  const canvas = Filters.getCanvas(width, height)
  const ctx = canvas.getContext('2d')
  if (aspect === 'raw') {
    const sx = height / video.videoWidth
    const sy = height / video.videoHeight
    const s = Math.min(sx, sy)
    const w = video.videoWidth * s
    const h = video.videoHeight * s
    ctx.drawImage(video, (width - height) / 2 + (height - w) / 2, (height - h) / 2, w, h)
  } else {
    ctx.drawImage(video, 0, 0, width, height)
  }

  const filter = model.get('source-filter')
  switch (filter) {
    case 'none':
    case 'raw_aspect':
      break
    default:
      const idata = Filters.filterImage(filters[filter], canvas, width, height)
      ctx.putImageData(idata, 0, 0)
      break
  }

  var unfiltered = canvas.toDataURL('image/webp', 1)
  Sqwiggle.cache.save({'snapshot': unfiltered})
}

const mosaic = (idata) => {
  const pixels = idata.data
  const width = idata.width
  const height = idata.height
  const size = 10
  const dimension = size * size

  const maxX = size * Math.ceil(width / size)
  const maxY = size * Math.ceil(height / size)
  for (let oy = 0; oy < maxY; oy += size) {
    for (let ox = 0; ox < maxX; ox += size) {
      let sr = 0
      let sg = 0
      let sb = 0
      for (let y = oy; y < oy + size; y++) {
        for (let x = ox; x < ox + size; x++) {
          const i = (width * y + x) * 4
          sr += pixels[i]
          sg += pixels[i + 1]
          sb += pixels[i + 2]
        }
      }
      const r = sr / dimension >> 0
      const g = sg / dimension >> 0
      const b = sb / dimension >> 0
      for (let y = oy; y < oy + size; y++) {
        for (let x = ox; x < ox + size; x++) {
          const i = (width * y + x) * 4
          pixels[i] = r
          pixels[i + 1] = g
          pixels[i + 2] = b
        }
      }
    }
  }

  return idata
}

const filters = {
  mosaic: mosaic,
}
