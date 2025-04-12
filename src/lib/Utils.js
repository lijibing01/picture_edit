import { G, resetOptions } from './global'

export function lockBox() {
  G.pedEdit.style.overflow = 'hidden'
}

export function unLockBox() {
  G.pedEdit.style.overflow = 'auto'
}

export function removePed() {
  G.ped.remove()
  resetOptions()
}

export function simpleEvent(e) {
  e.stopPropagation()
  e.preventDefault()
}

export function stringToNode(htmlString) {
  const container = document.createElement('div')
  container.innerHTML = htmlString.trim()
  return container.firstElementChild
}

export function drawPanel(canvasScale, textInfo, textReact, canvasRect) {
  const ctx = G.canvasContext
  ctx.save()

  // 计算缩放后的尺寸和位置
  const width = textReact.width * canvasScale
  const height = textReact.height * canvasScale
  const x = (textReact.left - canvasRect.left) * canvasScale
  const y = (textReact.top - canvasRect.top) * canvasScale
  const borderRadius = textInfo.fontSize / G.initOptions.fontSize * G.initOptions.fontRaduis * canvasScale
  const fontSize = textInfo.fontSize * canvasScale

  // 计算中心点
  const centerX = x + width / 2
  const centerY = y + height / 2

  // 应用旋转
  ctx.translate(centerX, centerY)
  ctx.rotate(textInfo.rotate * Math.PI / 180)
  ctx.translate(-centerX, -centerY)

  // 绘制面板
  ctx.beginPath()
  ctx.moveTo(x + borderRadius, y)
  ctx.arcTo(x + width, y, x + width, y + borderRadius, borderRadius)
  ctx.arcTo(x + width, y + height, x + width - borderRadius, y + height, borderRadius)
  ctx.arcTo(x, y + height, x, y + height - borderRadius, borderRadius)
  ctx.arcTo(x, y, x + borderRadius, y, borderRadius)
  ctx.closePath()

  ctx.fillStyle = 'white'
  ctx.lineWidth = 1
  ctx.lineCap = 'butt'
  ctx.lineJoin = 'miter'
  ctx.shadowBlur = 0
  ctx.shadowColor = '#ffffff'
  ctx.strokeStyle = 'white'
  ctx.fill()
  ctx.stroke()

  // 设置文字样式
  ctx.font = `${Math.round(fontSize)}px ${G.initOptions.fontFamily}`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'black'

  // 计算文字位置
  const lineHeight = fontSize * G.initOptions.fontLineHeight
  const textScale = fontSize / G.initOptions.fontSize / canvasScale
  const startX = x + G.initOptions.fontPaddingTop * canvasScale * textScale
  const startY = y + G.initOptions.fontPaddingLeft * canvasScale * textScale + lineHeight / 2

  // 绘制多行文本
  textInfo.textArray.forEach((line, index) => {
    const textY = startY + index * lineHeight
    ctx.fillText(line, startX, textY)
  });
  ctx.restore()
}

export function getDistance(touches) {
  const dx = touches[1].clientX - touches[0].clientX
  const dy = touches[1].clientY - touches[0].clientY
  return Math.hypot(dx, dy)
}

export function throttle(func, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now()
    if (now - lastCall < delay) return
    lastCall = now
    func.apply(this, args)
  }
}