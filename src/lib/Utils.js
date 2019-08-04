import {PED_GlOBAL as G, changeOperate} from './GLOBAL'

let scaleStyle = 0
function createNode(txt, domType) {
    const template = txt;
    let tempNode = document.createElement(domType || 'div');
    tempNode.innerHTML = template;
    return tempNode.firstChild;
}

function addScaleEvent(dom) {
    let singleStartTouche = {x: 0, y: 0}
    let doubleStartTouche = null
    let scale = 1
    scaleStyle = (dom.width / parseFloat(dom.style.width)).toFixed(4)
    let context = G.canvasContext
    let boxOffsetTop = G.canvasParentDom.offsetTop
    let boxOffsetLeft = G.canvasParentDom.offsetLeft
    dom.addEventListener("touchstart", function (e) {
        if (e.touches.length === 2) {
            doubleStartTouche = e.touches
        } else if (e.touches.length === 1) {
            if (G.operateType == 1) {
                //记录初始的滑动位置
                setSingleCoordinate(singleStartTouche, e)
                context.beginPath()
                context.lineWidth = 5
                let x = (e.touches[0].pageX - boxOffsetLeft - document.body.scrollLeft + G.canvasGrandDom.scrollLeft) * scaleStyle
                let y = (e.touches[0].pageY - boxOffsetTop - document.body.scrollTop + G.canvasGrandDom.scrollTop) * scaleStyle
                context.moveTo(x, y);
                //记录初始点坐标
                G.paintingArray.push({start: {x, y}, moves: []})
            }
        }
    }, false);

    dom.addEventListener("touchmove", function (e) {
        if (e.touches.length === 2) {
            e.preventDefault()
            resetOperateOne()
            G.operateType = 0
            scale = getScaleNum(doubleStartTouche, e.touches)
            doubleStartTouche = e.touches
            let oldWidth = parseFloat(dom.style.width)
            let oldHeight = parseFloat(dom.style.height)
            let newWidth = (oldWidth * scale).toFixed(4)
            let newHeight = parseFloat((oldWidth * G.img._WH).toFixed(4))
            dom.style.width = newWidth + 'px'
            dom.style.height = newHeight + 'px'
            scaleStyle = (dom.width / parseFloat(newWidth)).toFixed(4)
            boxOffsetTop = G.canvasParentDom.offsetTop
            boxOffsetLeft = G.canvasParentDom.offsetLeft
            fixPadding()
            if (G.inputDomArray.length > 0) {
                G.inputDomArray.forEach(item => {
                    item.style.fontSize = (parseFloat(item.style.fontSize) * scale).toFixed(4) + 'px'
                    item.style.top = (parseFloat(item.style.top) / oldHeight * newHeight).toFixed(4) + 'px'
                    item.style.left = (parseFloat(item.style.left) / oldWidth * newWidth).toFixed(4) + 'px'
                })
            }
        } else if (e.touches.length === 1) {
            if (G.operateType == 1) {
                e.preventDefault()
                let x = parseFloat((e.touches[0].pageX - boxOffsetLeft - document.body.scrollLeft + G.canvasGrandDom.scrollLeft) * scaleStyle)
                let y = parseFloat((e.touches[0].pageY - boxOffsetTop - document.body.scrollTop + G.canvasGrandDom.scrollTop) * scaleStyle)
                context.lineTo(x, y);
                context.stroke()
                //记录初始的滑动位置
                setSingleCoordinate(singleStartTouche, e)
                let historyLength = G.paintingArray.length - 1
                G.paintingArray[historyLength].moves.push({x, y})
            }
        }
    }, {passive: false});
}

function addTextEvent() {
    G.textInput.addEventListener('blur', function () {
        let textArray = G.textInput.innerText.split(/[\n\r]+/)
        G.textBox.style.display = 'none'
        let fontSize = 15
        if (textArray.length > 0) {
            G.inputArray.push(textArray)
            if (G.textOperateIndex == 0) {
                let textDom = `<div style="position: absolute;font-size: ${fontSize + 'px'};background-color: white;padding: 3px 5px;border-radius: 5px;white-space: nowrap">`
                for (let i = 0; i < textArray.length; i++) {
                    textDom = textDom + textArray[i] + `${i == textArray.length - 1 ? '' : '</br>'}`
                }
                textDom += `</div>`
                let dom = createNode(textDom)
                G.canvasParentDom.appendChild(dom)
                //获取dom的宽高以居中显示
                let domWidth = dom.offsetWidth
                let domHeight = dom.offsetHeight
                dom.style.top = (G.boxSize._height - domHeight) / 2 + G.canvasGrandDom.scrollTop - parseFloat(G.canvasGrandDom.style.paddingTop || 0) + 'px'
                dom.style.left = (G.boxSize._width - domWidth)  / 2 + G.canvasGrandDom.scrollLeft - parseFloat(G.canvasGrandDom.style.paddingLeft || 0) + 'px'
                G.inputDomArray.push(dom)
                addTextMoveEvent(dom)
            }
            G.textIndex ++
        }
        G.textInput.innerText = ''
        G.textBox.style.display = 'none'
        G.textInput.style.display = 'none'
    })
}

function resetOperateOne() {
    let operate = [...document.querySelectorAll('.picture-operate')][0]
    console.log(operate.style.color)
    if (operate.style.color == 'rgb(69, 148, 248)') {
        operate.firstChild.src = './src/assets/image/painting.png'
        operate.style.color = 'white'
    }
}

function addOperateEvent() {
    let operates = [...document.querySelectorAll('.picture-operate')]
    operates.forEach((item) => {
        item.addEventListener('click', function (e) {
            let type = e.currentTarget.getAttribute("operate")
            changeOperate(type)
            if(type == 1){
                let operate = e.currentTarget
                operate.firstChild.src = './src/assets/image/painting1.png'
                operate.style.color = '#4594f8'
            }else if (type == 4) {
                resetImg()
                clearInputDom()
                G.paintingArray = []
                resetOperateOne()
            } else if (type == 2) {
                G.textBox.style.display = 'block'
                G.textInput.style.display = 'inline-block'
                G.textInput.focus()
                resetOperateOne()
            } else if (type == 3) {
                if (G.paintingArray.length > 0) {
                    resetImg()
                    let context = G.canvasContext
                    G.paintingArray.pop()
                    context.beginPath()
                    G.paintingArray.forEach((item) => {
                        context.moveTo(item.start.x, item.start.y);
                        item.moves.forEach(move => {
                            context.lineTo(move.x, move.y)
                        })
                    })
                    context.stroke()
                }
                resetOperateOne()
            }
        }, false)
    })
}

function addTextMoveEvent(dom) {
    let toucheXY = {x: 0, y: 0}
    let oldCoordinate = {top: 0, left: 0}
    dom.addEventListener('touchstart', function (e) {
        e.preventDefault()
        toucheXY.x = e.touches[0].pageX - document.body.scrollLeft
        toucheXY.y = e.touches[0].pageY - document.body.scrollTop
        oldCoordinate.top = parseFloat(dom.style.top)
        oldCoordinate.left = parseFloat(dom.style.left)
    },false)
    dom.addEventListener('touchmove', function (e) {
        e.preventDefault()
        if (e.touches.length == 1) {
            //移动
            let lessX = e.touches[0].pageX - document.body.scrollLeft - toucheXY.x
            let lessY = e.touches[0].pageY - document.body.scrollTop - toucheXY.y
            toucheXY.x = e.touches[0].pageX - document.body.scrollLeft
            toucheXY.y = e.touches[0].pageY - document.body.scrollTop
            let resultLeft = oldCoordinate.left + lessX
            let resultTop = oldCoordinate.top + lessY
            oldCoordinate.top = resultTop
            oldCoordinate.left = resultLeft
            dom.style.left = resultLeft.toFixed(4) + 'px'
            dom.style.top = resultTop.toFixed(4) + 'px'
        } else if (e.touches.length == 2) {
        }
    }, false)
}

function setSingleCoordinate(init, e) {
    init.x = e.touches[0].pageX - document.body.scrollLeft
    init.y = e.touches[0].pageY - document.body.scrollTop
}

function getDistance(p1, p2) {
    let x = p2.pageX - p1.pageX,
        y = p2.pageY - p1.pageY;
    return Math.sqrt((x * x) + (y * y));
}

function resetImg() {
    G.canvasContext.clearRect(0, 0, G.img._width, G.img._height)
    G.canvasContext.drawImage(G.imgInstance, 0, 0, G.img._width, G.img._height)
}

function getScaleNum(oldTouches, newTouches) {
    let oldLength = getDistance(oldTouches[0], oldTouches[1])
    let newLength = getDistance(newTouches[0], newTouches[1])
    return (newLength / oldLength).toFixed(4)
}

function fixPadding() {
    let heightLess = G.boxSize._height - parseFloat(G.canvas.style.height)
    let widthLess = G.boxSize._width - parseFloat(G.canvas.style.width)
    if (heightLess > 0) {
        G.canvasGrandDom.style.paddingTop = (heightLess / 2).toFixed(4) + 'px'
    } else {
        if (G.canvasGrandDom.style.paddingTop !== '0px') {
            G.canvasGrandDom.style.paddingTop = '0px'
        }
    }
    if (widthLess > 0) {
        G.canvasGrandDom.style.paddingLeft = (widthLess / 2).toFixed(4) + 'px'
    } else {
        if (G.canvasGrandDom.style.paddingLeft !== '0px') {
            G.canvasGrandDom.style.paddingLeft = '0px'
        }
    }
}

function drawRoundedRect(ctx, x, y, width, height, r, fill, stroke) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + r, r);
    ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
    ctx.arcTo(x, y + height, x, y + height - r, r);
    ctx.arcTo(x, y, x + r, y, r);
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
    ctx.restore();
}

function addSaveEvent(dom, cxt, saveFn) {
    dom.addEventListener('click',function () {
        let array = G.inputArray
        if (array.length > 0) {
            for (let i = 0; i < array.length; i++) {
                let item = G.inputDomArray[i]
                let domLeft = parseFloat(item.style.left)
                let domTop = parseFloat(item.style.top) / parseFloat(G.canvas.style.height) * G.img._height
                let frontSize = parseFloat(item.style.fontSize) / parseFloat(G.canvas.style.height) * G.img._height
                drawRoundedRect(cxt, domLeft * scaleStyle, domTop, parseFloat(item.offsetWidth) * scaleStyle, parseFloat(item.offsetHeight) * scaleStyle, 5 * scaleStyle, true, false);
                console.log('scaleStyle===',scaleStyle)
                cxt.fillStyle = "white";
                cxt.fill();
                for (let j = 0; j < array[i].length; j++) {
                    cxt.fillStyle = "black";
                    cxt.font = `${frontSize}px helvetica`
                    // +5是为了修复paddingLeft     *1.4是为了修复line-height
                    cxt.fillText(array[i][j], (domLeft + 5) * scaleStyle, domTop + ((j + 1) * (parseFloat(item.style.fontSize) * 1.4)) * scaleStyle)
                }
            }
            //画完后移除dom元素
            clearInputDom()
        }
        let dataUrl = G.canvas.toDataURL()
        saveFn(dataUrl)
        G.pictureEditBox.style.display = 'none'
        clearInputDom()
        G.paintingArray = []
        G.operateType = 0
    },false)
}

function addCancelEvent(dom) {
    dom.addEventListener('click',function () {
        G.pictureEditBox.style.display = 'none'
        clearInputDom()
        G.paintingArray = []
        G.operateType = 0
    },false)
}

function clearInputDom() {
    G.inputDomArray.forEach(item => {
        item.remove()
    })
    G.inputDomArray = []
    G.inputArray = []
}


export {createNode, addScaleEvent, addTextEvent, addOperateEvent, addSaveEvent, addCancelEvent}
