/* eslint-disable */
Date.prototype.format = function (fmt) {
  if (!this) return
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S': this.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

String.prototype.formatDate = function (fmt) {
  let params = this.replace(/[-\s]/g, ':').split(':')
  params[1] -= 1
  let result = new Date(...params)
  return result.format(fmt)
}

String.prototype.gbLength = function () {
  var l = this.length
  var blen = 0
  for (let i = 0; i < l; i++) {
    if ((this.charCodeAt(i) & 0xff00) !== 0) {
      blen += 1
    } else {
      blen += 0.5
    }
  }
  return Math.ceil(blen)
}

String.prototype.gbIndex = function (length) {
  let l = this.length
  let blen = 0
  let index = 0
  for (let i = 0; i < l; i++) {
    if ((this.charCodeAt(i) & 0xff00) !== 0) {
      blen += 1
    } else {
      blen += 0.5
    }
    if (blen === length) {
      index = i
      break
    } else if (blen > length) {
      index = i - 1
      break
    }
  }
  return index
}

String.prototype.copyClipboard = function (callBack) {
  var textarea = document.createElement('textarea')
  textarea.innerHTML = this
  textarea.style.position = 'fixed'
  textarea.style.top = '1000000000px'
  document.body.appendChild(textarea)
  textarea.select()
  let ret = 'error'
  if (document.execCommand('copy')) {
    document.execCommand('copy')
    textarea.blur()
    ret = 'success'
  }
  var lt = setTimeout(function () {
    clearTimeout(lt)
    document.body.removeChild(textarea)
  }, 0)
  setTimeout(() => {
    callBack && callBack(ret)
  }, 100)
}

Image.prototype.getBase64Image = function () {
  let img = this
  var canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  var ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  var dataURL = canvas.toDataURL('image/png')
  return dataURL
}

String.prototype.padStart = function (num, str) {
  var s = this
  if (this.length >= num) {
    return s.substring(0, num)
  } else {
    var n = num - this.length
    for (var i = 0; i < n; i++) {
      s = str + s
    }
    return s
  }
}
String.prototype.isJSON = function () {
  try {
    let obj = JSON.parse(this)
    if (typeof obj === 'object' && obj ){
      return true
    } else {
      return false
    }
  } catch(e) {
    return false
  }
}
/* eslint-enable */
