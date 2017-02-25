var fs = require("fs");

var gifs = fs.readdirSync("./gifs");
var dsStore = gifs.indexOf(".DS_Store");
if(dsStore > -1) gifs.splice(dsStore, 1);

var pre = "<!DOCTYPE html>\
<html>\
<head>\
<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\
  <title></title>\
</head>\
<body>\
";
var post = "\
</body>\
</html>";

function randomInt(max = 1, min = 0){
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor(){
  return '#' + Math.random().toString(16).slice(2, 8).toUpperCase();
}

function invertColor(hex) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  // invert color components
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  // pad each with zeros and return
  return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

function gif(){
  var index = randomInt(gifs.length);
  return `<img src=\"./gifs/${ gifs[index] }\"></img>\n`;
}

function bounce(text) {
  return `<marquee direction=\"down\" scrollamount=\"${ randomInt(10, 4) }\" behavior=\"alternate\" height=\"100\">\
  <marquee behavior=\"alternate\" scrollamount=\"${ randomInt(10, 4) }\"><font size=\"6\">${ text }</font></marquee>\
  </marquee>\n`;
}

function scrollDown(text) {
  return `<marquee direction="down" height="100" scrollamount=\"${ randomInt(10, 4) }\">${ text }</marquee>\n`;
}

function scrollRight(text) {
  var color = randomColor();
  var textColor = invertColor(color);
  return `<marquee style=\"color:${ textColor }\" bgcolor=\"${ color }\" direction="right" scrollamount=\"${ randomInt(10, 4) }\">${ text }</marquee>\n`;
}

function scrollLeft(text) {
  return `<marquee direction="left" scrollamount=\"${ randomInt(10, 4) }\">${ text }</marquee>\n`;
}

function alternate(text) {
  return `<marquee behavior="alternate" scrollamount=\"${ randomInt(10, 4) }\">${ text }</marquee>\n`;
}

function doubleScroll(text) {
  return `<marquee scrollamount="10">\
      <marquee scrollamount="20" width="25%">\"${ text }\"</marquee>\
    </marquee>\n`;
}

function loadTXT(path) {
  var txt = fs.readFileSync(path, "utf8").split("\n\n");

  var trimmed = [];
  for(var i = 0, iMax = txt.length; i < iMax; i ++){
    var split = txt[i].trim().split(".");

    trimmed[i] = [];
    for(var j = 0, jMax = split.length; j < jMax; j ++){
      trimmed[i][j] = split[j].trim();
    }
  }
  return trimmed;
}

function createPage(path) {
  var text = loadTXT(path);
  var str = "";
  for(var i = 0, iMax = text.length; i < iMax; i ++){
    for(var j = 0, jMax = text[i].length; j < jMax; j ++){
      var index = randomInt(5);
      switch (index){
        case 0:
          str += bounce(text[i][j]);
          break;
        case 1:
          str += scrollDown(text[i][j]);
          break;
        case 2:
          str += scrollRight(text[i][j]);
          break;
        case 3:
          str += scrollLeft(text[i][j]);
          break;
        case 4:
          str+= doubleScroll(text[i][j]);
      }
    }
    str += gif();
  }
  return str;
}

var pages = fs.readdirSync("./text");
var dsStore = pages.indexOf(".DS_Store");
if(dsStore > -1) pages.splice(dsStore, 1);

pages.forEach(function(page){
  fs.writeFileSync(page.replace(".txt", ".html"), pre + createPage("./text/" + page) + post);
})