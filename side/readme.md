- 在打印机属性-常规中可以看到
- 纸张 58mm
- 打印宽度 48mm
- 分辨率 203 dpi -- 384px
- 产品页 https://www.xprinter.net/product/596.html


Node.js 的 ESC/POS 打印机驱动程序

https://github.com/song940/node-escpos // 报错 usb.on is not a function


https://github.com/strzibny/invoice_printer // 无可执行程序

https://github.com/MicrosoftEdge/WebView2Feedback/issues/1331

https://bbs.aardio.com/forum.php?mod=viewthread&tid=8527


https://github.com/HexaCubist/thermal-print?tab=readme-ov-file // html

https://github.com/tojocky/node-printer?tab=readme-ov-file // 没啥 api

https://github.com/Klemen1337/node-thermal-printer // 报错 driver 找不到

https://github.com/node-escpos/driver // 报错 LIBUSB_ERROR_NOT_SUPPORTED

https://learn.microsoft.com/en-us/windows/win32/api/docobj/ne-docobj-olecmdexecopt?redirectedfrom=MSDN

https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa752087(v=vs.85)

https://learn.microsoft.com/en-us/microsoft-edge/webview2/how-to/print?tabs=winrtcsharp#the-print-method-to-customize-printing

https://www.4fang.net/article/tech/pazu_tprinter.html

https://www.npmjs.com/package/get-pixels // 像素转数组

https://blog.csdn.net/zheshawanyier/article/details/121159159

-- 可行，但不会结束
https://blog.gougucms.com/home/article/detail/id/121.html

https://github.com/tojocky/node-printer

https://github.com/VFPX/Win32API/tree/master/libraries/gdi32 // gdi32 文档

https://hackernoon.com/zh/%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8-tspl-%E5%92%8C-javascript-%E6%89%93%E5%8D%B0%E6%A0%87%E7%AD%BE

https://juejin.cn/post/7197681585977458748?searchId=2023122903480143EF4CF003D094A13868 // python 后端打印

https://juejin.cn/post/7237316724739457061?searchId=2023122903480143EF4CF003D094A13868

https://juejin.cn/post/6844903893365686279?searchId=2023122903480143EF4CF003D094A13868

https://labelary.com/viewer.html // 在线设计器

https://juejin.cn/post/6844903573130592270?searchId=2023122903480143EF4CF003D094A13868 // electron 打印

https://juejin.cn/post/6844903895794188295?searchId=2023122903480143EF4CF003D094A13868 // 打印方案

https://juejin.cn/post/7012945647250702350?searchId=2023122903480143EF4CF003D094A13868 // 前端打印

http://hiprint.io/ // 免费打印插件

https://juejin.cn/post/7201048368389603386?searchId=2023122903480143EF4CF003D094A13868 // electron 打印

https://stackoverflow.com/questions/14488849/higher-dpi-graphics-with-html5-canvas // 图片 dpi 设置

- node-escpos 报错
- 打印图片不清晰
- 打印 html 不会结束
- 打印文字难写
- aar 打印图片 不会结束
- 浏览器 ctrl+p 不会结束

``` js
// 可用但不会停止

import win.ui;
import web.form;
/*DSG{{*/
var winform = ..win.form( scroll=1;bottom=399;parent=...;text="aardio Form";right=599 )
winform.add(  )
/*}}*/

//创建web窗体
var wb = web.form( winform , , , ,true/*securityTrusted*/ );
wb.html = /**
<body> 
Hello World
  
</body> 
**/
winform.show() 

// wb.execWb(8,1)   //页面设置
// wb.execWb(7,1)   //打印预览
// wb.execWb(6,6)   //直接打印

wb.execWb(6,3,2)   //直接打印

//进入消息循环
win.loopMessage();
return winform,wb;
```