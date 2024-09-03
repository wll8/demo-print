let msg = undefined;

document.addEventListener("DOMContentLoaded", async function () {
  window.tool = {
    view,
    print,
    getPrintList,
    getPrintDefault,
  };
  if (window.Sys) {
    new Sys().then(async (shim) => {
      msg = new shim.Msg()
      window.shim = shim;
      await shim.nativeMain.win.form._forms[window.ext.hwnd].show(true)
      await shim.nativeMain.win.setText(window.ext.hwnd, `后台管理`)
      let [, debugHwnd] = await shim.nativeMain.global.G.debugHwnd
      // 隐藏调试台
      await shim.nativeMain.win.show(debugHwnd, false)

      // 从本地加载 html2canvas
      let [, jsStr] = await shim.native.string.load(`lib/html2canvas.min.js`)
      jsStr = jsStr.replace(`define.amd`, `define.noamd`) // 避免如果页面上使用了 amd 时此脚本没有正常加载
      eval(jsStr)
    });
  } else {
    console.warn(`请在宿主中打开，才可以访问系统功能`);
  }
});

function cssHack(dom) {
  if (dom.offsetWidth > 0 && dom.offsetHeight > 0) {
    return {
      reset(){}
    }
  } else {
    const old = [
      [`display`, ``],
      [`position`, `fixed`],
      [`zIndex`, 999],
      [`left`, `100vw`],
      [`top`, `100vh`],
      [`backgroundColor`, `#fff`],
    ].reduce((acc, [key, val]) => {
      acc[key] = dom.style[key]
      dom.style[key] = val
      return acc
    }, {})
    return {
      reset() {
        Object.entries(old).forEach(([key, val]) => {
          dom.style[key] = val
        })
      }
    }
  }
}

async function view(source, target) {
  const hack = cssHack(source)
  const canvas = await html2canvas(source, {
    useCORS: true,
  }).catch((err) => console.log(err));
  if (target) {
    target.innerHTML = ``;
    target.appendChild(canvas);
  }
  const url = canvas.toDataURL();
  hack.reset()
  return url;
}
async function print(dom, { printerName = ``, type = `` } = {}) {
  const url = await view(dom);
  console.log("打印", url);
  if(type.toLowerCase() === `a4`) {
    printByName({printerName, base64: url})
  } else {
    return msg.emit(`img`, url);
  }
}
// 获取所有打印机
async function getPrintList() {
  const tag = `tag${Date.now()}`
  const msg = new window.shim.Msg()
  let list = []
  msg.on(tag, (out) => {
    list.push(out)
  })
  let [, read] = await window.shim.ws.call(
    `run`,
    [
      `
      for printerName,serverName,attributes in sys.printer.each(){
        thread.command.publish("${tag}", {
          printerName = printerName,
          serverName = serverName,
          attributes = attributes,
        })
      }
        
      `,
    ],
  )
  msg.off(tag)
  return list
}
// 获取默认打印机名称
async function getPrintDefault() {
  let [, read] = await window.shim.ws.call(
    `run`,
    [
      `
      return sys.printer.default()
        
      `,
    ],
  )
  const name = read.replace(new RegExp(`\u0000`, `ig`), ``)
  return name
}
// 使用指定打印机名称打印 base64
async function printByName({printerName, base64} = {}) {
  base64 = base64.replace(`data:image/png;base64,`, ``)
  let [, read] = await window.shim.ws.call(
    `run`,
    [
      `
        var arg = ...
        var printer = sys.printer(arg.printerName);
        var pdc = printer.createDevice(
            dmPaperSize = 9/*_DMPAPER_A4*/; //A4 纸
            dmOrientation = 1;//横向打印为2,纵向打印为1 
        );
        pdc.start(
            function(hdcPrinter,rc){
                import gdip.graphics; 
                import gdip.bitmap; 
                var graphics = gdip.graphics(hdcPrinter);
                var buffer = crypt.decodeBin(arg.base64)
                var bmp = gdip.bitmap(buffer); 
                //使用图片dpi绘图
                graphics.drawImageWithDpi(bmp,0,0);
            }
        ); 
        
      `,
      {
        printerName,
        base64,
      },
    ],
  )
}
