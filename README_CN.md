# 介绍
用原生js和canvas写的一个移动端图片编辑器

# 源码
https://github.com/lijibing01/picture_edit

# 在线体验
http://ai.xkcoin.cn/index.html

# 使用方法
1. yarn add picture_edit
2. import * as PED from 'picture_edit'
3. new PED.drawing(url, options)
4. 参考: https://github.com/lijibing01/picture_edit/blob/master/index.html

# 参数说明
| 参数名称 | 默认值 | 类型 | 说明 |
|---------|-------|------|------|
| spaceLeft | 30 | number | 初始化图片的左右间距 |
| spaceTop | 30 | number | 距离顶部和底部的距离 |
| fontSize | 14 | number | 文字大小 |
| fontPaddingLeft | 3 | number | 文字上下padding |
| fontPaddingTop | 5 | number | 文字左右padding |
| fontRaduis | 5 | number | 文字圆角半径 |
| fontLineHeight | 1.2 | number | 文字行高比例 |
| fontLineWidth | 5 | number | 线条宽度 |
| fontShadowBlur | 5 | number | 线条阴影 |
| operatePaddingLeft | 28 | number | 操作模块的左右边距 |
| operatePaddingTop | 10 | number | 操作模块的上下边距 |
| fontColor | '#000000' | string | 文字颜色 |
| fontBgColor | '#ffffff' | string | 文字背景颜色 |
| fontFamily | "Arial" | string | 字体 |
| textOperateColor | "#884cf3" | string | 操作模块的边框颜色 |
| getDataURL | () => {} | function | 回调函数，获取编辑后的图片 |
| outType | 'image/jpeg' | string | image/png、image/webp、image/jpeg |
| encoderOptions | 1 | number | outType 为 image/jpeg 或 image/webp 的情况下，可以从 0 到 1 的区间内选择导出图片的质量 |

# 功能说明
1. 支持 vue、react、原生 js 项目的 h5 页面
1. 可以双指放大缩小图片
2. 可以在图片上进行涂鸦
3. 可以输入文字和输入法表情
4. 文字后可以单指移动文字
5. 点击文字后，点击操作右上角的按钮拖拽可以放大缩小文字。点击操作底部图标可以旋转文字
6. 可以撤回内容
7. 支持原图导出，也可以导出图片压缩质量

# 如何构建

```shell
yarn & yarn serve
```

欢迎star
