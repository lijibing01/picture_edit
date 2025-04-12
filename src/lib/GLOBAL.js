let PED_GlOBAL = {}

function resetOptions(options = {}) {
  PED_GlOBAL = {
    initOptions: {
      spaceLeft: 30,
      spaceTop: 30,
      fontSize: 14,
      fontPaddingLeft: 3,
      fontPaddingTop: 5,
      fontRaduis: 5,
      fontLineHeight: 1.2,
      fontLineWidth: 5,
      fontShadowBlur: 5,
      maxScale: 2,
      operatePaddingLeft: 28,
      operatePaddingTop: 10,
      fontColor: '#000000',
      fontBgColor: '#ffffff',
      fontFamily: "Arial",
      textOperateColor: "#884cf3",
      getDataURL: () => { },
      outType: 'image/jpeg',
      encoderOptions: 1,
      ...options,
    },
    imgInstance: undefined,
    img: {
      width: 0,
      height: 0,
      WH: 0,
      HW: 0
    },
    device: {
      width: 0,
      height: 0,
      dpr: 1,
    },
    operateType: 0,
    canvas: undefined,
    canvasContext: undefined,
    canvasInitCssSize: {
      width: 0,
      height: 0,
    },
    canvasBox: undefined,
    ped: undefined,
    pedEdit: undefined,
    editSize: {
      width: 0,
      height: 0
    },
    preScale: 1,
    currentScale: 1,
    scrollPercent: {
      width: 1,
      height: 1,
    },
    outerPosition: {
      x: 0,
      y: 0,
    },
    screenPosition: {
      x: 0,
      y: 0,
    },
    textContent: undefined,
    textInput: undefined,
    touchType: '',
    textId: 2,
    textsInfo: {},
    steps: [],
  }
}

export { PED_GlOBAL as G, resetOptions }