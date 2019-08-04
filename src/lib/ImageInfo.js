import {PED_GlOBAL as G, setCanvas} from './GLOBAL'
import * as Util from './Utils'

class ImageInfo {
    constructor(url,saveFn) {
        this.getImgInfo(url)
        this.getDeviceInfo()
        this.saveFn = saveFn
    }

    getImgInfo(url) {
        let img = new Image()
        img.crossOrigin = 'anonymous';
        let that = this
        img.onload = function () {
            let globalImg = G.img
            globalImg._width = this.width
            globalImg._height = this.height
            globalImg._HW = (this.width / this.height).toFixed(4)
            globalImg._WH = (this.height / this.width).toFixed(4)
            G.imgInstance = this
            that.showImg()
        }
        img.src = url
    }

    getDeviceInfo() {
        G.device._width = document.documentElement.clientWidth
        G.device._height = document.documentElement.clientHeight
    }

    showImg() {
        if (document.getElementById('picture_edit_cancel')) {
            G.pictureEditBox.remove()
        }
        let operatingStyle = `style="flex: 1;padding-top: 1rem" class='picture-operate'`
        let imgBox = `<div style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;overflow: hidden;z-index: 997;background-color: white">`+
                          `<div id="picture_edit_cancel" style="position: absolute;left: 15px;top: 15px;padding: 5px 13px;background-color: white;color: black;z-index: 2;border-radius: 3px">取消`+
                          `</div>`+
                          `<div id="picture_edit_save" style="position: absolute;right: 15px;top: 15px;padding: 5px 13px;background-color: #67c23a;color: white;z-index: 2;border-radius: 3px">保存`+
                          `</div>`+
                          `<div style="width: 100%;height:calc(100% - 6rem);overflow: scroll;-webkit-overflow-scrolling: touch;overflow-scrolling: touch;box-sizing: border-box">`+
                             `<div style="position: relative">`+
                              `<canvas id="picture_edit_canvas" width="${G.img._width}" height="${G.img._height}" style="width: ${G.device._width + 'px'};height: ${Math.floor(G.device._width * G.img._WH) + 'px'}"></canvas>`+
                             `</div>`+
                          `</div>`+
                          `<div style="position: absolute;bottom: 0;left: 0;right: 0;height: 6rem;background-color: black;display: flex;text-align: center;color: white">`+
                            `<div ${operatingStyle} operate="1">`+
                                `<img src="./src/assets/image/painting.png" style="width: 1.3rem;display: block;margin: auto;">涂画`+
                            `</div>`+
                            `<div ${operatingStyle} operate="2">`+
                                `<img src="./src/assets/image/text.png" style="width: 1.3rem;display: block;margin: auto"> 文字`+
                            `</div>`+
                            `<div ${operatingStyle} operate="3">`+
                                `<img src="./src/assets/image/withdraw.png" style="width: 1.3rem;display: block;margin: auto"> 撤回`+
                            `</div>`+
                            `<div ${operatingStyle} operate="4">`+
                                `<img src="./src/assets/image/empty.png" style="width: 1.3rem;display: block;margin: auto"> 清空`+
                            `</div>`+
                          `</div>`+
                          `<div id="picture_edit_text" style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;overflow: hidden;z-index: 2;display: none;background-color: white;opacity: 0.93">`+
                          `</div>`+
                          `<div id="picture_edit_input" contenteditable="true" tabindex="1" style="min-height:15%;border-radius: 5px;border: 2px solid #63eca1;outline: none;width: 96%;box-sizing: border-box;position: absolute;top: 8%;left: 2%;right: 2%;display: none;z-index: 2;padding: 3px 5px"></div>`+
                      `</div>`
        let dom = Util.createNode(imgBox)
        document.body.appendChild(dom)
        let canvasDom = document.getElementById('picture_edit_canvas')
        let textBox = document.getElementById('picture_edit_text')
        let textInput = document.getElementById('picture_edit_input')
        setCanvas(canvasDom, textBox, textInput)
        let heightLess = (G.boxSize._height - parseFloat(canvasDom.style.height)).toFixed(4)
        if(heightLess > 0){
            G.canvasGrandDom.style.paddingTop = heightLess / 2 + 'px'
        }
        G.canvasContext.drawImage(G.imgInstance, 0, 0, canvasDom.width, canvasDom.height)
        Util.addScaleEvent(canvasDom)
        Util.addTextEvent()
        //给操作按钮添加事件
        Util.addOperateEvent()
        //保存按钮事件添加
        Util.addSaveEvent(document.getElementById('picture_edit_save'),G.canvasContext,this.saveFn)
        //取消按钮事件添加
        Util.addCancelEvent(document.getElementById('picture_edit_cancel'))
    }

    showPED(){
        G.pictureEditBox.style.display = 'block'
    }
}

export default ImageInfo;
