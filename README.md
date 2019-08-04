# picture_edit
a js script for mobile-side image editing

### 用原生js和canvas写的一个移动端图片编辑器

#### 使用方法
1、引入dist文件夹下的ped.js
2、new window.PED.imageInfo(url,saveFn)
* url是图片的地址（可以是相对路径，也可以是http链接）
* saveFn 为点击保存时的回调函数

#### 功能说明
1、可以双指放大缩小图片
2、可以在图片上进行涂鸦
2、可以输入文字，输入文字后可以单指移动文字在图片上的位置
3、可以撤回涂鸦的内容，不能撤回文字，文字编辑功能还未实现

#### 构建自己的ped.js
1、npm install
2、npm run build

----
欢迎star
