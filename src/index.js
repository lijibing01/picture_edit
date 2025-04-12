import frame from './template/frame.html'
import { G, resetOptions } from './lib/global'
import * as U from './lib/utils';
import { initListener } from './lib/listeners';
import './template/frame.less'

if (process.env.NODE_ENV === "development") {
  import('./lib/vconsole.min.js').then((module) => {
    new module.default()
  })
}

class drawing {
  constructor(url, options) {
    resetOptions(options)
    this.getDeviceInfo()
    if (typeof url === 'string') {
      this.getImgInfo(url)
    } else if (url.target && url.target.tagName === 'IMG') {
      this.parseImgInfo(url.target)
    } else {
      throw new Error('Not supported')
    }
  }

  parseImgInfo(target) {
    G.img = {
      width: target.naturalWidth,
      height: target.naturalHeight,
      WH: target.naturalWidth / target.naturalHeight,
      HW: target.naturalHeight / target.naturalWidth
    }
    G.imgInstance = target
    this.showImg()
  }

  getImgInfo(url) {
    let img = new Image()
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      G.img = {
        width: img.width,
        height: img.height,
        WH: img.width / img.height,
        HW: img.height / img.width,
      }
      G.imgInstance = img
      this.showImg()
    }
    img.onerror = () => reject(new Error("Image loading failed"));
    img.src = url
  }

  getDeviceInfo() {
    G.device = {
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: window.devicePixelRatio,
    }
  }

  showImg() {
    const canvasWidth = G.device.width - G.initOptions.spaceLeft * 2
    const canvasHeight = Math.floor(canvasWidth * G.img.HW)
    G.canvasInitCssSize = {
      width: canvasWidth,
      height: canvasHeight,
    }
    const _ped = U.stringToNode(frame)
    const _canvas = U.stringToNode(`<canvas width="${G.img.width * G.device.dpr}"
        height="${G.img.height * G.device.dpr}"
        style="width: ${canvasWidth + 'px'};
        height: ${canvasHeight + 'px'};
        transform-origin: left top;">
      </canvas>`)
    const _canvasBox = _ped.querySelector('.canvas-box')
    _ped.style.cssText = `height: ${G.device.height}px; width: ${G.device.width}px`
    _canvasBox.appendChild(_canvas)
    document.body.appendChild(_ped)
    G.canvas = _canvas
    G.canvasContext = G.canvas.getContext('2d', { antialias: true })
    G.canvasContext.drawImage(G.imgInstance, 0, 0, G.canvas.width, G.canvas.height)
    G.canvasBox = G.canvas.parentElement
    G.pedEdit = G.canvasBox.parentElement
    G.ped = G.pedEdit.parentElement
    G.textContent = G.ped.lastElementChild
    G.textInput = G.textContent.firstElementChild

    // 获取可操作区域的宽高
    const editRect = G.pedEdit.getBoundingClientRect()
    G.editSize = {
      width: editRect.width,
      height: editRect.height,
    }
    let _boxHeight = 0
    if (G.editSize.height > canvasHeight + 2 * G.initOptions.spaceTop) {
      _boxHeight = G.editSize.height
    } else {
      _boxHeight = canvasHeight + 2 * G.initOptions.spaceTop
    }
    G.canvasBox.style.cssText = `height: ${_boxHeight}px; width: ${G.editSize.width}px`
    if (process.env.NODE_ENV === "development") {
      console.log('imgInfo=', G.img);
      console.log('deviceInfo=', G.device);
      console.log('editInfo=', G.editSize);
    }
    initListener()
  }
}

export {
  drawing
};