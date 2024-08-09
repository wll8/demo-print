let msg = undefined;

document.addEventListener("DOMContentLoaded", async function () {
  window.tool = {
    view,
    print,
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
  const canvasdom = document.createElement("canvas");
  const width = parseInt(window.getComputedStyle(source).width, 10);
  const height = parseInt(window.getComputedStyle(source).height, 10);
  const scaleBy = Number((203 / 96).toFixed(2));
  canvasdom.width = width * scaleBy;
  canvasdom.height = height * scaleBy;
  const canvas = await html2canvas(source, {
    scale: scaleBy,
    useCORS: true,
  }).catch((err) => console.log(err));
  if (target) {
    target.innerHTML = ``;
    target.appendChild(canvas);
  }
  const url = canvas.toDataURL();
  return url;
}
async function print(dom) {
  const hack = cssHack(dom)
  const url = await view(dom);
  hack.reset()
  console.log("打印", url);
  msg.emit(`img`, url);
}
