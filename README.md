# Introduction
A mobile image editor written with native js and canvas

# Source code
https://github.com/lijibing01/picture_edit

# Online Experience
http://ai.xkcoin.cn/index.html

# Usage
1. yarn add picture_edit
2. import * as PED from 'picture_edit'
3. new PED.drawing(url, options)
4. refer to https://github.com/lijibing01/picture_edit/blob/master/index.html

# Options
| Parameter Name | Default Value | Type | Description |
|---------|-------|------|------|
| spaceLeft | 30 | number | Initialize the left and right spacing of the image |
| spaceTop | 30 | number | Distance from the top and bottom |
| fontSize | 14 | number | Text size |
| fontPaddingLeft | 3 | number | Text top and bottom padding |
| fontPaddingTop | 5 | number | Text left and right padding |
| fontRaduis | 5 | number | Text corner radius |
| fontLineHeight | 1.2 | number | Text line height ratio |
| fontLineWidth | 5 | number | Line width |
| fontShadowBlur | 5 | number | Line shadow |
| operatePaddingLeft | 28 | number | Left and right margins of the operation module |
| operatePaddingTop | 10 | number | Top and bottom margins of the operation module |
| fontColor | '#000000' | string | Text color |
| fontBgColor | '#ffffff' | string | Text background color |
| fontFamily | "Arial" | string | Font |
| textOperateColor | "#884cf3" | string | Border color of the operation module |
| getDataURL | () => {} | function | Callback function to get the edited image |
| outType | 'image/jpeg' | string | image/png, image/webp, image/jpeg |
| encoderOptions | 1 | number | When outType is image/jpeg or image/webp, the quality of the exported image can be selected from the range of 0 to 1 |

# Function description
1. Supports h5 of vue, react, and native js projects Page
1. You can zoom in and out the image with two fingers
2. You can doodle on the image
3. You can enter text and input method emoticons
4. You can move the text with one finger after entering the text
5. After clicking the text, click the button in the upper right corner of the operation and drag to zoom in and out the text. Click the icon at the bottom of the operation to rotate the text
6. You can withdraw the content
7. Support the export of the original image, and you can also export the image compression quality

# How to build

```shell
yarn & yarn serve
```

Welcome star