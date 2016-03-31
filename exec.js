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

    var idata = Filters.filterImage((pixels) => {
      var d = pixels.data
      for (var i = 0; i < d.length; i += 4) {
        var r = d[i]
        // var g = d[i + 1]
        // var b = d[i + 2]
        // var v = 0.2126 * r + 0.7152 * g + 0.0722 * b
        // d[i] = d[i + 1] = d[i + 2] = v
        d[i] = 255
      }
      return pixels
    }, canvas, width, height)
    context.putImageData(idata, 0, 0)

    var image = canvas.toDataURL('image/webp', 1)
    Sqwiggle.cache.save({
      snapshot: image
    })
  }
}
