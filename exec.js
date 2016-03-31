'use strict'

Sqwiggle.View.Video.prototype.captureSnapshot = (a) => {
  var width = 640,
    height = 480,
    video = this.$('video.active')[0]
  if (a === !0 && this.$('.camera-flash').show().fadeOut(400),
    video && video.videoWidth && video.videoHeight) {
    var canvas = Filters.getCanvas(width, height),
      context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, width, height)

    var idata = Filters.filterImage(mosaic, canvas, width, height)
    context.putImageData(idata, 0, 0)

    var image = canvas.toDataURL('image/webp', 1)
    Sqwiggle.cache.save({
      snapshot: image
    })
  }
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
