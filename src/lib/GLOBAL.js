export let PED_GlOBAL = {
    img: {
        _width: 0,
        _height: 0,
        _WH: 0,
        _HW: 0
    },
    device: {
        _width: 0,
        _height: 0
    },
    boxSize: {
        _width: 0,
        _height: 0
    },
    operateType: 0, //0: 什么都不做  1:涂画  2:输入文字  3:撤回  4:清空
    imgInstance: null,
    canvas: {},
    textBox: {},
    textInput: {},
    textOperateIndex: 0,
    textIndex: 0,
    inputArray:[],
    inputDomArray: [],
    canvasParentDom: null,
    canvasGrandDom: null,
    pictureEditBox: null,
    canvasContext: {},
    paintingArray: [],
}

export function changeOperate(type) {
    PED_GlOBAL.operateType = type
}

export function setCanvas(canvas, textBox, textInput) {
    PED_GlOBAL.canvas = canvas
    PED_GlOBAL.canvasParentDom = canvas.parentElement
    PED_GlOBAL.canvasGrandDom = canvas.parentElement.parentElement
    PED_GlOBAL.canvasContext = canvas.getContext('2d')
    PED_GlOBAL.textBox = textBox
    PED_GlOBAL.pictureEditBox = textBox.parentElement
    PED_GlOBAL.textInput = textInput

    PED_GlOBAL.boxSize._height = PED_GlOBAL.canvasGrandDom.offsetHeight
    PED_GlOBAL.boxSize._width = PED_GlOBAL.canvasGrandDom.offsetWidth
}
