
const fs = require('fs');
const { escpos } = require(`./lib/index.js`)

new Sys().then(async main => {
  const win = main.win
  console.log(`win`, win)
  const msg = new main.Msg()
  msg.on(`img`, async (base64) => {
    console.log(`base64`, base64)
    const filePath = `${__dirname}/temp.png`
    saveBase64AsImage(base64, filePath);
    console.log(`filePath`, filePath, base64.length)
    print(filePath)
  })

}).catch(err=> {
  console.log(`错误`, err)
})


function saveBase64AsImage(base64String, filePath) {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  const imageBuffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, imageBuffer);
}

function print(filePath) {
  const device = new escpos.Win(); // 默认USB
  const options = { encoding: "GB18030" /* default */ }
  const printer = new escpos.Printer(device, options);
  escpos.Image.load(filePath, function(image){
    console.log(`image`, image)
    device.open(function(){
      printer.align('ct')
        .image(image, 'D24')
        .then(() => { 
          printer.cut().close(); 
        });
    });
  
  });
}