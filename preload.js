document.addEventListener("DOMContentLoaded", async function () {
  let text = await fetch(`https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js`).then(res => res.text())
  text = text.replace(`define.amd`, `define.noamd`) // 避免如果页面上使用了 amd 时此脚本没有正常加载
  eval(text)

  window.tool = {
    view,
    print,
  };
  if (window.Sys) {
    new Sys().then(async (main) => {
      window.main = main;
      msg = new window.main.Msg();
      window.main.form.show();
    });
  } else {
    console.warn(`请在宿主中打开，才可以访问系统功能`);
  }
});

let msg = undefined;

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
async function print(source) {
  const url = await view(source);
  console.log("打印", url);
  msg.emit(`img`, url);
}
