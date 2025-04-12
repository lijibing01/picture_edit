import { G } from './global'
import * as U from './utils'
import svgRotate from '../assets/rotate.svg'
import svgPainting from '../assets/painting.svg'
import svgPaintingCancel from '../assets/painting_cancel.svg'

let _initDistance = 0
let _tempScale = 1


let _operateBorderDom = null
let _operateInfo = null

let _lineElement = null

let _lineInfo = {
  coefficient: 1,
  left: 0,
  top: 0,
}

let _textPosition = {
  id: undefined,
  x: 0,
  y: 0,
  scale: 1,
  left: 0,
  top: 0,
}

let _rotateInfo = {
  x: 0,
  y: 0,
  centerX: 0,
  centerY: 0,
  initialRotation: 0,
  startAngle: 0,
}

let _scaleInfo = {
  x: 0,
  y: 0,
  initFontSize: 14,
  centerX: 0,
  centerY: 0,
  initialScale: 1,
  initLength: 0,
}

function initListener() {
  initOperater()
  G.canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      if (G.operateType === 1) {
        U.simpleEvent(e)
        const touch = e.touches[0]
        G.canvasContext.beginPath()
        G.canvasContext.lineWidth = G.initOptions.fontLineWidth * G.device.dpr
        G.canvasContext.lineCap = 'round' // 线条末端添加圆形线帽，减少线条的生硬感
        G.canvasContext.lineJoin = 'round' // 线条交汇时为原型边角
        G.canvasContext.shadowBlur = G.initOptions.fontShadowBlur // 利用阴影，消除锯齿
        G.canvasContext.shadowColor = '#000000'
        const _bounding = G.canvas.getBoundingClientRect()
        const x = touch.clientX - _bounding.left
        const y = touch.clientY - _bounding.top
        const coefficient = G.canvas.width / _bounding.width
        _lineInfo = {
          coefficient,
          left: _bounding.left,
          top: _bounding.top,
        }
        const finalX = x * coefficient
        const finalY = y * coefficient
        G.canvasContext.moveTo(finalX, finalY)
        G.steps.push({ type: 'line', start: { x: finalX, y: finalY }, moves: [] })
      }
    } else if (e.touches.length === 2) {
      U.simpleEvent(e)
      resetLineImg()
      U.lockBox() // 防止缩放速度过快，屏幕出现之前的滚动条
      Object.keys(G.textsInfo).forEach(key => {
        const info = G.textsInfo[key]
        info.dom.style.cssText = `${info.dom.style.cssText}; display: none;`
      })
      G.touchType = 'scaleCanvas'
      G.preScale = G.currentScale
      _tempScale = 1
      _initDistance = U.getDistance(e.touches)
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]

      // 计算两个触摸点的中心点坐标（相对于视口）
      const centerX = (touch1.clientX + touch2.clientX) / 2
      const centerY = (touch1.clientY + touch2.clientY) / 2
      const rect = G.canvas.getBoundingClientRect()
      const rectBox = G.canvasBox.getBoundingClientRect()
      G.screenPosition = {
        x: centerX,
        y: centerY,
      }
      G.outerPosition = {
        x: centerX - rectBox.left,
        y: centerY - rectBox.top,
      }
      G.canvas.style.transformOrigin = `${centerX - rect.left}px ${centerY - rect.top}px`
    }
  });

  function moveEvent(e) {
    const currentDistance = U.getDistance(e.touches)
    const scaleChange = currentDistance / _initDistance // 计算缩放变化
    _tempScale = scaleChange
    G.canvas.style.transform = `scale(${scaleChange})`
  }

  const throttledScroll = U.throttle((e) => {
    moveEvent(e)
  }, 16); // 60hz刷新率为准，16.67毫秒刷新一次

  G.canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      if (G.operateType === 1) {
        U.simpleEvent(e)
        const touch = e.touches[0]
        const x = touch.clientX - _lineInfo.left
        const y = touch.clientY - _lineInfo.top
        const finalX = x * _lineInfo.coefficient
        const finalY = y * _lineInfo.coefficient
        G.canvasContext.lineTo(finalX, finalY)
        G.canvasContext.stroke()
        let historyLength = G.steps.length - 1
        G.steps[historyLength].moves.push({ x: finalX, y: finalY })
      }
    } else if (e.touches.length === 2 && G.operateType !== 1 && G.touchType === 'scaleCanvas') {
      U.simpleEvent(e)
      throttledScroll(e)
    }
  });

  G.canvas.addEventListener('touchend', (e) => {
    if (e.touches.length === 0 && G.touchType === 'scaleCanvas') {
      _initDistance = 0
      G.touchType = ''
      const boxRect = G.canvasBox.getBoundingClientRect()
      const _preWidth = boxRect.width
      const _preHeight = boxRect.height
      const _lastWidth = _preWidth * _tempScale
      const _lastHeight = _preHeight * _tempScale

      const rect = G.canvas.getBoundingClientRect()
      // 此处需要先设置canvas的宽高，再设置canvasBox的宽高，不然缩小的时候，滚动条会变大
      G.canvas.style.cssText = `width: ${rect.width}px; height: ${rect.height}; transform: scale(1); transform-origin: center`
      G.canvasBox.style.cssText = `width: ${_lastWidth}px; height: ${_lastHeight}px`
      G.pedEdit.scrollTo(_lastWidth / _preWidth * G.outerPosition.x - G.screenPosition.x, _lastHeight / _preHeight * G.outerPosition.y - G.screenPosition.y)
      G.currentScale = _lastWidth / G.editSize.width

      const _scale = G.currentScale / G.preScale
      Object.keys(G.textsInfo).forEach(key => {
        const info = G.textsInfo[key]
        info.x = info.x * _scale
        info.y = info.y * _scale
        info.fontSize = info.fontSize * _scale
        info.width = info.width * _scale
        info.height = info.height * _scale
        info.dom.style.cssText = `${info.dom.style.cssText};
          font-size: ${info.fontSize}px;
          line-height: ${info.fontSize * G.initOptions.fontLineHeight}px;
          padding: ${G.initOptions.fontPaddingLeft * G.currentScale}px ${G.initOptions.fontPaddingTop * G.currentScale}px;
          border-radius: ${G.initOptions.fontRaduis * G.currentScale}px; 
          transform: translate(${info.x}px, ${info.y}px) rotate(${info.rotate}deg);
          display: block;`
      })
    }
    U.unLockBox()
  });
}

function handleText() {
  if (G.textInput.innerText.length) {
    let textArray = G.textInput.innerText.split(/[\n\r]/)
    const fontSize = G.initOptions.fontSize * G.currentScale
    let textDom = `<div style="position: absolute;
      left: 0;
      top: 0;
      user-select: none;
      color: ${G.initOptions.fontColor};
      font-size: ${fontSize}px;
      line-height: ${fontSize * G.initOptions.fontLineHeight}px;
      background-color: ${G.initOptions.fontBgColor};
      padding: ${G.initOptions.fontPaddingLeft * G.currentScale}px ${G.initOptions.fontPaddingTop * G.currentScale}px;
      border-radius: ${G.initOptions.fontRaduis * G.currentScale}px;
      white-space: nowrap;
      z-index: ${G.textId}">`
    for (let i = 0; i < textArray.length; i++) {
      textDom = textDom + textArray[i] + `${i == textArray.length - 1 ? '' : '</br>'}`
    }
    textDom += `</div>`
    let dom = U.stringToNode(textDom)
    G.canvasBox.appendChild(dom)
    // 获取宽高以居中显示
    const boxRect = G.canvasBox.getBoundingClientRect()
    const domRect = dom.getBoundingClientRect()
    const top = G.editSize.height / 2 - boxRect.top - domRect.height / 2
    const left = G.editSize.width / 2 - boxRect.left - domRect.width / 2
    dom.style.cssText = `${dom.style.cssText}; transform: translate(${left}px, ${top}px) rotate(0deg);`
    const id = G.textId++
    dom.dataset.pedTextId = id
    G.textsInfo[id] = {
      textArray,
      x: left,
      y: top,
      rotate: 0,
      fontSize,
      fontColor: G.initOptions.fontColor,
      fontBgColor: G.initOptions.fontBgColor,
      width: domRect.width,
      height: domRect.height,
      dom,
    }
    G.steps.push({
      type: 'creat_text',
      textId: id
    });
    dom.addEventListener("touchstart", addTextBox)
    dom.addEventListener("touchmove", moveTextBox)
    dom.addEventListener("touchend", endTextBox)
    dom.addEventListener("click", handleTextClick)
    G.textInput.innerText = ""
  }
  G.textInput.removeEventListener("blur", handleText)
  G.textContent.style.display = "none"
}

function handleTextClick(e) {
  U.simpleEvent(e)
  handleCreateOperate(e.currentTarget)
}

function handleCreateOperate(target) {
  handleRemoveOperate()
  const id = target.dataset.pedTextId
  _operateInfo = G.textsInfo[id]
  const element = `<div style="position: absolute;
          width: ${_operateInfo.width + G.initOptions.operatePaddingLeft * 2}px;
          height: ${_operateInfo.height + G.initOptions.operatePaddingTop * 2}px;
          left: ${_operateInfo.x - G.initOptions.operatePaddingLeft}px;
          top: ${_operateInfo.y - G.initOptions.operatePaddingTop}px;
          border: 2px solid ${G.initOptions.textOperateColor};
          box-sizing: border-box;
          border-radius: 2px;
          background: transparent;
          transform: rotate(${_operateInfo.rotate}deg);">
        </div>`
  _operateBorderDom = U.stringToNode(element)
  const rotateElement = `<img src="${svgRotate}" class="operate-rotate" />`
  const _rotateDom = U.stringToNode(rotateElement)
  _rotateDom.addEventListener("touchstart", addTextRotate)
  _rotateDom.addEventListener("touchmove", moveTextRotate)
  _rotateDom.addEventListener("touchend", endTextRotate)

  const scaleElement = `<div class="operate-scale"></div>`
  const _scaleDom = U.stringToNode(scaleElement)
  _scaleDom.addEventListener("touchstart", addTextScale)
  _scaleDom.addEventListener("touchmove", moveTextScale)
  _scaleDom.addEventListener('touchend', endTextScale)

  _operateBorderDom.appendChild(_rotateDom)
  _operateBorderDom.appendChild(_scaleDom)
  G.canvasBox.appendChild(_operateBorderDom)
}

function handleRemoveOperate() {
  if (_operateBorderDom) _operateBorderDom.remove()
}

function addTextBox(e) {
  if (e.touches.length === 1) {
    const touche = e.touches[0]
    const dom = e.currentTarget
    const id = dom.dataset.pedTextId
    let { x, y } = G.textsInfo[id]
    _textPosition = {
      id,
      x: touche.clientX,
      y: touche.clientY,
      scale: G.currentScale,
      left: x,
      top: y,
    }
  }
}

function moveTextBox(e) {
  U.simpleEvent(e)
  if (e.touches.length === 1) {
    G.touchType = 'scaleCanvas'
    handleRemoveOperate()
    const target = e.currentTarget
    const id = target.dataset.pedTextId
    const lessX = e.touches[0].clientX - _textPosition.x + _textPosition.left
    const lessY = e.touches[0].clientY - _textPosition.y + _textPosition.top
    target.style.cssText = `${target.style.cssText}; transform: translate(${lessX}px, ${lessY}px) rotate(${G.textsInfo[id].rotate}deg);`
    G.textsInfo[id].x = lessX
    G.textsInfo[id].y = lessY
  }
}

function endTextBox() {
  if (G.touchType === 'scaleCanvas') {
    G.touchType = ''
    G.steps.push({
      type: 'move_text',
      textId: _textPosition.id,
      scale: _textPosition.scale,
      x: _textPosition.left,
      y: _textPosition.top,
    });
  }
}

function calculateAngle(x, y) {
  // 弧度转度数
  return Math.atan2(y, x) * (180 / Math.PI)
}

function addTextRotate(e) {
  U.simpleEvent(e)
  if (e.touches.length === 1) {
    const rect = _operateInfo.dom.getBoundingClientRect()
    const touche = e.touches[0]
    const x = touche.clientX
    const y = touche.clientY
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    _rotateInfo = {
      x,
      y,
      centerX,
      centerY,
      initialRotation: _operateInfo.rotate,
      startAngle: calculateAngle(x - centerX, y - centerY)
    }
  }
}

function moveTextRotate(e) {
  U.simpleEvent(e)
  if (e.touches.length === 1) {
    _operateBorderDom.remove()
    G.touchType = 'addRotateLog'
    const touche = e.touches[0]
    const rotate = calculateAngle(touche.clientX - _rotateInfo.centerX, touche.clientY - _rotateInfo.centerY) + _rotateInfo.initialRotation - _rotateInfo.startAngle
    _operateInfo.dom.style.cssText = `${_operateInfo.dom.style.cssText}; transform: translate(${_operateInfo.x}px, ${_operateInfo.y}px) rotate(${rotate}deg)`;
    _operateInfo.rotate = rotate
  }
}

function endTextRotate(e) {
  U.simpleEvent(e)
  if (G.touchType === 'addRotateLog') {
    G.touchType = ''
    G.steps.push({
      type: 'rotate_text',
      textId: _operateInfo.dom.dataset.pedTextId,
      rotate: _rotateInfo.initialRotation,
    });
  }
}

function addTextScale(e) {
  U.simpleEvent(e)
  if (e.touches.length === 1) {
    const rect = _operateInfo.dom.getBoundingClientRect()
    const touche = e.touches[0]
    _scaleInfo = {
      x: touche.clientX,
      y: touche.clientY,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2,
      initFontSize: _operateInfo.fontSize,
      initialScale: _operateInfo.fontSize / G.initOptions.fontSize,
      initLength: U.getDistance([touche, {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      }]),
    }
  }
}

function moveTextScale(e) {
  U.simpleEvent(e)
  if (e.touches.length === 1) {
    G.touchType = 'addScaleLog'
    handleRemoveOperate()
    const touche = e.touches[0]
    const _length = U.getDistance([touche, {
      clientX: _scaleInfo.centerX,
      clientY: _scaleInfo.centerY,
    }])
    const scale = _length / _scaleInfo.initLength * _scaleInfo.initialScale
    const fontSize = G.initOptions.fontSize * scale
    _operateInfo.dom.style.cssText = `${_operateInfo.dom.style.cssText};
      font-size: ${fontSize}px;
      line-height: ${fontSize * G.initOptions.fontLineHeight}px;
      border-radius: ${G.initOptions.fontRaduis * scale}px;
      padding: ${G.initOptions.fontPaddingLeft * scale}px ${G.initOptions.fontPaddingTop * scale}px;`
  }
}

function endTextScale(e) {
  U.simpleEvent(e)
  if (G.touchType = 'addScaleLog') {
    G.touchType = ''
    // 缩放文本，需要更新宽高等信息了
    _operateInfo.width = _operateInfo.dom.offsetWidth
    _operateInfo.height = _operateInfo.dom.offsetHeight
    _operateInfo.fontSize = parseFloat(_operateInfo.dom.style.fontSize)

    G.steps.push({
      type: 'scale_text',
      textId: _operateInfo.dom.dataset.pedTextId,
      scale: G.currentScale,
      fontSize: _scaleInfo.initFontSize,
    })
  }
}

function outPutCanvas() {
  const canvasRect = G.canvas.getBoundingClientRect()
  const canvasScale = G.canvas.width / canvasRect.width
  Object.keys(G.textsInfo).forEach((id) => {
    const textInfo = G.textsInfo[id]
    const textDom = textInfo.dom
    textDom.style.cssText = `${textDom.style.cssText}; transform: translate(${textInfo.x}px, ${textInfo.y}px) rotate(0deg)`
    const textReact = textDom.getBoundingClientRect()
    U.drawPanel(canvasScale, textInfo, textReact, canvasRect)
  })
}

function resetImg() {
  const context = G.canvasContext
  context.clearRect(0, 0, G.canvas.width, G.canvas.height)
  context.drawImage(G.imgInstance, 0, 0, G.img.width, G.img.height, 0, 0, G.canvas.width, G.canvas.height)
}

function resetLineImg() {
  G.operateType = 0
  U.unLockBox()
  if (_lineElement) _lineElement.src = svgPaintingCancel
}

function initOperater() {
  G.ped.addEventListener('click', (e) => {
    const operateType = e.target.getAttribute('operate')
    if (operateType) {
      if (operateType === 'cancel') {
        U.removePed()
      } else if (operateType === 'save') {
        outPutCanvas()
        const dataUrl = G.canvas.toDataURL(G.initOptions.outType, G.initOptions.encoderOptions)
        G.initOptions.getDataURL(dataUrl)
        U.removePed()
      } else if (operateType === 'line') {
        if (G.operateType === 1) {
          G.operateType = 0
          U.unLockBox()
        } else {
          G.operateType = 1
          U.lockBox()
        }
        _lineElement = e.target.tagName === 'DIV' ? e.target.firstElementChild : e.target
        _lineElement.src = G.operateType === 0 ? svgPaintingCancel : svgPainting
      } else if (operateType === 'text') {
        resetLineImg()
        G.textContent.style.display = "block"
        G.textInput.focus()
        G.textInput.addEventListener("blur", handleText)
      } else if (operateType === 'back') {
        resetLineImg()
        if (G.steps.length) {
          const lastInfo = G.steps.pop()
          if (lastInfo.type === 'line') {
            resetImg()
            const context = G.canvasContext
            context.lineWidth = G.initOptions.fontLineWidth * G.device.dpr
            context.lineCap = 'round'
            context.lineJoin = 'round'
            context.shadowBlur = G.initOptions.fontShadowBlur
            context.shadowColor = '#000000'
            G.steps.forEach((item) => {
              if (item.type === 'line') {
                context.beginPath()
                context.moveTo(item.start.x, item.start.y)
                item.moves.forEach(move => {
                  context.lineTo(move.x, move.y)
                  context.stroke()
                })
              }
            })
          } else if (lastInfo.type === 'creat_text') {
            const textId = lastInfo.textId
            G.textsInfo[textId].dom.remove()
            delete G.textsInfo[textId]
          } else if (lastInfo.type === 'move_text') {
            const textId = lastInfo.textId
            const finalX = lastInfo.x * G.currentScale / lastInfo.scale
            const finalY = lastInfo.y * G.currentScale / lastInfo.scale
            G.textsInfo[textId].x = finalX
            G.textsInfo[textId].y = finalY
            G.textsInfo[textId].dom.style.cssText = `${G.textsInfo[textId].dom.style.cssText}; transform: translate(${finalX}px, ${finalY}px) rotate(${G.textsInfo[textId].rotate}deg);`
          } else if (lastInfo.type === 'scale_text') {
            const textId = lastInfo.textId
            const textInfo = G.textsInfo[textId]
            const finalFontSize = lastInfo.fontSize * G.currentScale / lastInfo.scale
            textInfo.fontSize = finalFontSize
            textInfo.dom.style.cssText = `${textInfo.dom.style.cssText};
              font-size: ${finalFontSize}px;
              line-height: ${finalFontSize * G.initOptions.fontLineHeight}px;
              border-radius: ${G.initOptions.fontRaduis * (finalFontSize / G.initOptions.fontSize)}px;
              padding: ${G.initOptions.fontPaddingLeft * (finalFontSize / G.initOptions.fontSize)}px ${G.initOptions.fontPaddingTop * (finalFontSize / G.initOptions.fontSize)}px;`
            const rect = textInfo.dom.getBoundingClientRect()
            textInfo.width = rect.width
            textInfo.height = rect.height
          } else if (lastInfo.type === 'rotate_text') {
            const textId = lastInfo.textId
            const textInfo = G.textsInfo[textId]
            textInfo.rotate = lastInfo.rotate
            textInfo.dom.style.cssText = `${textInfo.dom.style.cssText}; 
              transform: translate(${textInfo.x}px, ${textInfo.y}px) rotate(${lastInfo.rotate}deg);`
          }
        }
      } else if (operateType === 'clear') {
        U.removePed()
      }
    }
  })
}

export { initListener }