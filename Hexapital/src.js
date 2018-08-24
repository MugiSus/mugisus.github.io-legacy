try {
//initialize
const canvas = document.getElementById("disp");
const ctx = canvas.getContext("2d");
canvas.height = document.body.clientHeight; canvas.width = document.body.clientWidth; // size
const ratioW = canvas.width / 1366 // 1366 is developer's display size
const perth = 1.04;
var chipW, chipH, dispChipW, dispChipH;
var defaultSize = 75;
var allData = [];
var allLifeLine = [];
var scrollX = scrollY = 0; // camera position
var imgName = ["focus", "flash", "undef", "unLL0", "unLL1", "drawLL", "LLfromHere", "n", "0", "1", "2a", "2b", "2c", "3a", "3b", "3c", "3d", "4a", "4b", "4c", "5", "6", "energy", "b00", "b01", "b10", "b11", "b12", "b20", "b21", "air00", "air10", "air11"]; //load images
var img = [] //load images
var roadArr = {"0":"000000", "1":"100000", "2a":"100100", "2b":"101000", "2c":"110000", "3a":"101010", "3b":"101100", "3c":"110100", "3d":"111000", "4a":"110110", "4b":"111010", "4c":"111100", "5":"111110", "6":"111111"}
var timers = [];
var mouseState = {"left":false, "wheel":false, "right":false};
var keydown = {};
var fadeAlpha = 0; var faded = false;
var mouseX, mouseY, beforeMouseX, beforeMouseY;
var focusedPos = [];
var LLmemory = [], lastLLM = [], correctLL = false;
var paletteArr = ["r", "drawLL", "energy", "b0", "b1", "b2", "air0"], paletteH = canvas.height * 0.9, selectedCommand = 0;;
var clockM = clock = 0; setInterval(() => clock = ++clock % 10000, 1000/60);
canvas.addEventListener("mousedown", (event)=>{mouseState[["left","wheel","right"][event.button]] = true;});
canvas.addEventListener("mouseup", (event)=>{mouseState[["left","wheel","right"][event.button]] = false;});
document.addEventListener("keydown", (event)=>{keydown[event.key] = true;});
document.addEventListener("keyup", (event)=>{keydown[event.key] = false;});
document.addEventListener("mousemove", (event)=>{mouseX = event.clientX; mouseY = event.clientY;});
canvas.addEventListener("touchstart", (event)=>{mouseState[["left","right"][(event.touches.length < 2) * 1]] = true;})
canvas.addEventListener("touchend", (event)=>{mouseState = {"left":false, "right":false};});
canvas.addEventListener('touchmove', (event)=>{mouseX = event.clientX; mouseY = event.clientY; event.preventDefault();});
canvas.oncontextmenu =()=> {return false;};

//-----------begin defining functions----------//

var waitUntil =(ce, func, sec = 0)=> {
  if (eval(ce)) setTimeout(func, sec);
  else setTimeout(waitUntil.bind(null, ce, func, sec), 1000/60);
}

var resizeChip =(size)=> {chipW = size; chipH = chipW / 3 ** 0.5 * 2; dispChipW = chipW * 0.97; dispChipH = chipH * 0.97;};

ctx.__proto__.drawChip =(s,x,y,d,alpha=1)=> {
  ctx.save();
  ctx.translate(x - (chipW - defaultSize) / 4 + dispChipW / 2, y - (chipH - defaultSize / 3 ** 0.5 * 2) / 4 + dispChipH / 2);
  ctx.rotate(d * 60 * Math.PI / 180);
  ctx.globalAlpha = alpha < 0 ? 0 : alpha > 1 ? 1 : alpha;
  ctx.drawImage(img[imgName.indexOf(s)], dispChipW / -2, dispChipH / -2, dispChipW, dispChipH);
  ctx.restore();
};

ctx.__proto__.line =(x0, y0, x1, y1)=> {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.closePath();
  ctx.stroke();
};

var changeCursor =(cursor, x = 0, y = 0)=> {
  canvas.style.cursor = `url(images/cursors/${cursor}.svg) ${x} ${y}, auto`;
}

var resetAllData =()=> {
  allData = new Array(1001); for (let i = 0; i < allData.length; i++) {allData[i] = new Array(1001).fill("n");}
  allLifeLine = new Array(1001); for (let i = 0; i < allLifeLine.length; i++) {allLifeLine[i] = new Array(1001).fill("n");}
}

var fade =(speed)=> {
  ctx.fillStyle = `rgba(240, 240, 240, ${fadeAlpha})`;
  ctx.fillRect(0,0,canvas.width,canvas.height)
  if ((fadeAlpha < 1 && speed > 0) || (fadeAlpha > 0 && speed < 0)) {faded = false; fadeAlpha += speed;}
  else {faded = true; fadeAlpha = (fadeAlpha >= 1)? 1 : 0;}
}

var getFPS =()=> {
  let d = new Date();
  timers.push(d.getTime());
  timers.forEach((x, y) => {if (d.getTime() - x > 1000) timers.shift()});
  ctx.font = `${15*ratioW}px 'ＭＳ　Ｐゴシック'`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText(timers.length + " FPS", 10, 25);
}

var build =(kind,x,y)=> {
  switch (kind) {
    case "air0":
      allData[y][x] = "air0";
      allData[y][x-1] = "air1"; allData[y-1][x-1+y%2] = "air1"; allData[y-1][x+y%2] = "air1"; allData[y][x+1] = "air1"; allData[y+1][x+y%2] = "air1"; allData[y+1][x-1+y%2] = "air1"
      break;
    default:
      allData[y][x] = kind;
  }
}

var getDist =(x0, y0, x1, y1, x2, y2)=> {
  if ((x0 - x1) * x0 + (y0 - y1) * y0 + -(x0 - x1) * x2 + -(y0 - y1) * y2 > 0 == (x0 - x1) * x1 + (y0 - y1) * y1 + -(x0 - x1) * x2 + -(y0 - y1) * y2 > 0) {
    if (((x0 - x2) ** 2 + (y0 - y2) ** 2) ** 0.5 < ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5) return ((x0 - x2) ** 2 + (y0 - y2) ** 2) ** 0.5;
    else return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5;
  }
  return Math.abs((y0 - y1) * x2 + (x1 - x0) * y2 + -(x1 - x0) * y0 + -(y0 - y1) * x0) / ((y0 - y1) ** 2 + (x1 - x0) ** 2) ** 0.5
}

var drawAll =(command = "n", game = true)=> {
  resizeChip(defaultSize);
  let drawData = [[]];
  var j = Math.ceil(-scrollY / canvas.height) * Math.ceil(canvas.height / (chipH * 0.75));
  for (let y = 0; y < Math.ceil(canvas.height / (chipH * 0.75)) + 3; y++) {
    var i = Math.ceil(scrollX / canvas.width) * Math.ceil(canvas.width / chipW);
    for (let x = 0; x < Math.ceil(canvas.width / chipW) + 2; x++) {
      var _x = x + i, _y = y + j;
      let xpos = (_x) * chipW + Math.abs((_y) % 2) * chipW / 2 - scrollX;
      let ypos = (_y) * chipH * 0.75 + scrollY;
      if (xpos > canvas.width + chipW * 1) { i -= Math.ceil(canvas.width / chipW) + 2; x--; continue; }
      if (ypos > canvas.height + chipH * 0.75) { j -= Math.ceil(canvas.height / (chipH * 0.75)) + 3; x--; continue; }
      if (!game) {drawData[0].push(["n", xpos, ypos, 0]); continue;}
      if (0 >= (_x) || (_x) >= allData[0].length - 1 || 0 >= (_y) || (_y) >= allData.length - 1) {drawData[0].push(["undef", xpos, ypos, 0]); continue;}
      switch (allData[_y][_x].charAt(0)) {
        case "r":
        var k = [allData[_y][_x-1], allData[_y-1][_x-1+_y%2], allData[_y-1][_x+_y%2], allData[_y][_x+1], allData[_y+1][_x+_y%2], allData[_y+1][_x-1+_y%2]].map(x => buildingArr[x].connectable * 1);
        for (var l = 0; l < 6; l++) {k.push(k.shift()); if (Object.values(roadArr).indexOf(k.join("")) > -1) break;}
        drawData[0].push([Object.keys(roadArr)[Object.values(roadArr).indexOf(k.join(""))], xpos, ypos, l+1]);
        break;
        default:
        if (Object.keys(buildingArr).indexOf(allData[_y][_x]) > -1) {
          if (buildingArr[allData[_y][_x]].height == 0) drawData[0].push([allData[_y][_x],xpos,ypos,0]);
          else {
            drawData[0].push(["n",xpos,ypos,0]);
            for (let l = m = n = 0; m < buildingArr[allData[_y][_x]].height; m++) {
              if (!drawData[m+1]) drawData[m+1] = [];
              while (m - l >= buildingArr[allData[_y][_x]].pattern[n]) {n = (n + 1) % buildingArr[allData[_y][_x]].pattern.length; l = m;}
              drawData[m+1].push([allData[_y][_x] + (n % buildingArr[allData[_y][_x]].images), canvas.width / 2 + ((xpos + (xpos - canvas.width / 2) * (perth ** m)) - canvas.width / 2) / 2, canvas.height / 2 + ((ypos + (ypos - canvas.height / 2) * (perth ** m)) - canvas.height / 2) / 2, 0]);
            }
          }
          if (buildingArr[allData[_y][_x]].needsLifeLine && allLifeLine[_y][_x] == "n") {
            let m = buildingArr[allData[_y][_x]].height;
            if (!drawData[m]) drawData[m] = [];
            drawData[m].push(["unLL" + (m > 0) * 1, canvas.width / 2 + ((xpos + (xpos - canvas.width / 2) * (perth ** m)) - canvas.width / 2) / 2, canvas.height / 2 + ((ypos + (ypos - canvas.height / 2) * (perth ** m)) - canvas.height / 2) / 2, 0]);
          }
        } else {
          drawData[0].push(["undef", xpos, ypos, 0]);
        }
      }
      if (command == "drawLL" && (buildingArr[allData[_y][_x]].supplyable == 2 || (buildingArr[allData[_y][_x]].supplyable == 1 && allLifeLine[_y][_x] == "1"))) {
        let m = buildingArr[allData[_y][_x]].height || 0;
        if (!drawData[m]) drawData[m] = [];
        drawData[m].push(["LLfromHere", canvas.width / 2 + ((xpos + (xpos - canvas.width / 2) * (perth ** m)) - canvas.width / 2) / 2, canvas.height / 2 + ((ypos + (ypos - canvas.height / 2) * (perth ** m)) - canvas.height / 2) / 2, 0, 0.45 + Math.sin(Math.PI * (clock % 200 / 100)) * 0.55]);
      }
      if (lastLLM.indexOf(`${_x}:${_y}`) > -1) {
        if (clock + (clockM[0]+clockM[1] >= 10000) * 10000 < clockM[0]+clockM[1]) {
          let m = buildingArr[allData[_y][_x]].height || 0;
          if (!drawData[m]) drawData[m] = [];
          drawData[m].push(["flash", canvas.width / 2 + ((xpos + (xpos - canvas.width / 2) * (perth ** m)) - canvas.width / 2) / 2, canvas.height / 2 + ((ypos + (ypos - canvas.height / 2) * (perth ** m)) - canvas.height / 2) / 2, 0, (clockM[0]+clockM[1] - clock + (clockM[0]+clockM[1] >= 10000) * 10000) / clockM[1]]);
        } else lastLLM = [];
      }
      if (getDist(beforeMouseX, beforeMouseY, mouseX, mouseY, xpos + chipW / 2, ypos + chipH / 2) < chipW * 0.51 || (focusedPos[0] == _x && focusedPos[1] == _y)) {
        focusedPos = [_x, _y];
        let m = buildingArr[allData[_y][_x]].height || 0;
        if (!drawData[m]) drawData[m] = [];
        drawData[m].push(["focus", canvas.width / 2 + ((xpos + (xpos - canvas.width / 2) * (perth ** m)) - canvas.width / 2) / 2, canvas.height / 2 + ((ypos + (ypos - canvas.height / 2) * (perth ** m)) - canvas.height / 2) / 2, 0]);  
        if (!mouseState.right && paletteH > mouseY) {
          switch (command) {
            case "+r":
            if (mouseState.left && allData[_y][_x] == "n") allData[_y][_x] = "r";
            break;
            case "-r":
            if (mouseState.left && allData[_y][_x] == "r") allData[_y][_x] = "n";
            break;
          }
        }
      }
      ctx.fillStyle = "#ffffff"; ctx.font = `${chipW*0.2}px 'ＭＳ　Ｐゴシック'`;
      if ((_x) % 10 == 1 && (_y) % 10 == 1) ctx.fillText(`${_x},${_y}`,xpos,ypos+chipH*0.4);
    }
  }
  switch (command) {
    case "drawLL":
    if (mouseState.left && paletteH > mouseY) {
      let x = focusedPos[0], y = focusedPos[1];
      if (!correctLL && LLmemory.indexOf(`${x}:${y}`) < 0 && ((LLmemory.length && LLmemory.length < buildingArr[allData[LLmemory[LLmemory.length-1].split(":")[1]][LLmemory[LLmemory.length-1].split(":")[0]]].LLlimit && (allData[y][x] == "r" || buildingArr[allData[y][x]].supplyable == 2 || (buildingArr[allData[y][x]].supplyable == 1 && allLifeLine[y][x] == "1")) && [`${x-1}:${y}`,`${x-1+y%2}:${y-1}`,`${x+y%2}:${y-1}`,`${x+1}:${y}`,`${x+y%2}:${y+1}`,`${x-1+y%2}:${y+1}`].indexOf(LLmemory[0]) > -1) || (!LLmemory.length && buildingArr[allData[y][x]].needsLifeLine && allLifeLine[y][x] == "n"))) {
        if (buildingArr[allData[y][x]].supplyable == 2 || (buildingArr[allData[y][x]].supplyable == 1 && allLifeLine[y][x] == "1")) correctLL = true;
        LLmemory.unshift(`${x}:${y}`);
      }
      if (LLmemory[1] == `${x}:${y}`) {LLmemory.shift(); correctLL = false}
      LLmemory.forEach((x, y, z) => {
        let xpos = x.split(":")[0] * chipW + Math.abs((x.split(":")[1]) % 2) * chipW / 2 - scrollX;
        let ypos = x.split(":")[1] * chipH * 0.75 + scrollY;
        let m = buildingArr[allData[x.split(":")[1]][x.split(":")[0]]].height || 1;
        if (!drawData[m]) drawData[m] = [];
        drawData[m].push([`drawLL@${buildingArr[allData[LLmemory[LLmemory.length-1].split(":")[1]][LLmemory[LLmemory.length-1].split(":")[0]]].LLlimit-(z.length-y)+1}`, canvas.width / 2 + ((xpos + (xpos - canvas.width / 2) * (perth ** m)) - canvas.width / 2) / 2, canvas.height / 2 + ((ypos + (ypos - canvas.height / 2) * (perth ** m)) - canvas.height / 2) / 2, 0, correctLL ? 0.7 + Math.sin(Math.PI * (clock % 50 / 25)) * 0.3 : 1]);
      });
    } else {
      if (LLmemory.length) {
        if (correctLL) {allLifeLine[firsty = LLmemory[LLmemory.length-1].split(":")[1]][LLmemory[LLmemory.length-1].split(":")[0]] = "1"; lastLLM = LLmemory; clockM = [clock, 15 + LLmemory.length * 3];}
        LLmemory = [], correctLL = false;
      }
    }
    break;
  }
  drawData.forEach((x, y) => {
    resizeChip(defaultSize * ((1 + (perth - 1) / 1.5) ** y)); x.forEach((x) => {
      ctx.drawChip(x[0].split("@")[0], x[1], x[2], x[3], x[4] || 1);
      if (x[0].split("@")[0] == "drawLL") {ctx.font = `${chipW*0.25}px 'ＭＳ　Ｐゴシック'`; ctx.fillText(`${x[0].split("@")[1]}`,x[1]+chipW*0.1,x[2]+chipH*0.42);}
    });
  });
}

var drawPalette =(scroll = 0)=> {
  resizeChip(defaultSize);
  if (paletteH < mouseY) paletteH += (canvas.height - dispChipH * 1.5 - paletteH) / 10;
  else paletteH += (canvas.height * 0.95 - paletteH) / 10;
  ctx.fillStyle = "rgba(128,128,128,0.5)";
  ctx.fillRect(0,paletteH,canvas.width,canvas.height);
  resizeChip(defaultSize);
  paletteArr.forEach((x,y)=>{
    if (x != "drawLL" && buildingArr[x].icon) buildingArr[x].icon.forEach((p,q)=>{ctx.drawChip(p, y * dispChipW * 1.5 - scroll, q * dispChipW * -0.125 + paletteH + dispChipH * 1.5 / 2 - dispChipH / 2 - (canvas.height - dispChipH * 1.5 - paletteH) * 0.5, 0);})
    else ctx.drawChip(x, y * dispChipW * 1.5 - scroll, paletteH + dispChipH * 1.5 / 2 - dispChipH / 2 - (canvas.height - dispChipH * 1.5 - paletteH) * 0.75, 0);
    if (selectedCommand == x || (!selectedCommand || selectedCommand == "r" || selectedCommand == "drawLL") && paletteH < mouseY && y * dispChipW * 1.5 - scroll < mouseX && mouseX < y * dispChipW * 1.5 + dispChipW - scroll) {
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillRect(y * dispChipW * 1.5 - scroll, paletteH, dispChipW, canvas.height);
      if (mouseState.left) selectedCommand = x;
    }
  });
  if (selectedCommand && !(selectedCommand == "r" || selectedCommand == "drawLL")) {
    if (buildingArr[selectedCommand].icon) buildingArr[selectedCommand].icon.forEach((p,q)=>{ctx.drawChip(p, mouseX - dispChipW / 2, mouseY - dispChipH / 2 + q * dispChipW * -0.125, 0);})
    else ctx.drawChip(selectedCommand, mouseX - dispChipW / 2, mouseY - dispChipH / 2, 0);
    if (!mouseState.left) {
      if (paletteH > mouseY) build(selectedCommand,focusedPos[0],focusedPos[1])
      selectedCommand = "";
    }
  }
}

//------------end defining functions-----------//

//-------------begin loading images------------//

imgName.forEach((x, y) => {
  let i = new Image();
  i.src = `images/chips/${x}.png`;
  i.onload =()=> {
    img[y] = i;
  };
});

//--------------end loading images-------------//

resetAllData();

var wayPos = [];
for (i = 0; i < 1000; i++) wayPos.push([[Math.floor(Math.random()*100)+500],[Math.floor(Math.random()*100)+500]])
wayPos.forEach(x => {
  allData[x[1]][x[0]] = `b${Math.floor(Math.random()*3)}`;
});

build("air0",503,503);
build("air0",596,503);
build("air0",503,596);
build("air0",596,596);
build("energy",507,507);

function startup(smoother = 0) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.lineWidth = 15 * ratioW;
  ctx.strokeStyle = "#cccccc";
  ctx.line(0, canvas.height * 0.9, canvas.width, canvas.height * 0.9);
  ctx.lineWidth = 7.5 * ratioW;
  ctx.strokeStyle = "#44dd44";
  ctx.line(0, canvas.height * 0.9, canvas.width * smoother, canvas.height * 0.9);
  ctx.lineWidth = 2 * ratioW;
  ctx.font = `${72*ratioW}px 'ＭＳ　Ｐゴシック'`;
  ctx.strokeText("Loading...", canvas.width / 2 - (150 * ratioW), canvas.height / 2);
  let increase = ((img.length / imgName.length) - smoother) / 10;
  if ( increase > 0.02 ) increase = 0.02;
  if ( smoother < 0.9999 ) {
    requestAnimationFrame(startup.bind(null, smoother + increase));
  } else {
    setTimeout("title()", 500);
  }
}

function title(n = 0, mouse = mouseState.left) {
  let num = (n + 1) % 120;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawAll(null, false);
  getFPS();
  ctx.lineWidth = 2 * ratioW;
  ctx.font = `${120*ratioW}px 'ＭＳ　Ｐゴシック'`;
  ctx.fillStyle = "#ffffff"; ctx.fillText("Hexapital", canvas.width / 2 - (280 * ratioW), canvas.height * 0.4);
  ctx.strokeStyle = "#94ed01"; ctx.strokeText("Hexapital", canvas.width / 2 - (280 * ratioW), canvas.height * 0.4);
  ctx.font = `${35*ratioW}px 'ＭＳ　Ｐゴシック'`;
  ctx.lineWidth = 0.5 * ratioW;
  ctx.fillStyle = `rgba(255, 255, 255, ${1 - Math.abs(num - 60) / 60 * 0.5})`; ctx.fillText("- Click to Start -", canvas.width / 2 - (140 * ratioW), canvas.height * 0.75 + Math.abs(num - 60) / 60 * 15);
  ctx.strokeStyle = `rgba(150, 240, 0, ${1 - Math.abs(num - 60) / 60 * 0.5})`; ctx.strokeText("- Click to Start -", canvas.width / 2 - (140 * ratioW), canvas.height * 0.75 + Math.abs(num - 60) / 60 * 15);
  scrollX+=1; scrollY-=1;
  if ((!mouse && mouseState.left) || 0 < fadeAlpha) fade(0.04);
  if (faded) {
    scrollX = chipW * 500;
    scrollY = chipH * 500 * -0.75;
    waitUntil("!mouseState.left", game, 500);
    return;
  }
  requestAnimationFrame(title.bind(null, num, mouse? mouseState.left : false));
}

var velx = vely = 0, startX = mouseX, startY = mouseY, startScrollX, startScrollY, beforeMouse = false, beforeKey = false;
function game(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawAll(selectedCommand);
  if (selectedCommand == "+r") {
    selectedCommand = "r"
  }
  drawPalette(defaultSize * -0.5);
  if (selectedCommand == "r") {
    selectedCommand = "+r"
  }
  getFPS();
  fade(-0.04);
  scrollX += velx; scrollY += vely;
  velx *= 0.95; vely *= 0.95;
  if (beforeMouse != mouseState.right) {
    if (mouseState.right) {startScrollX = scrollX; startScrollY = scrollY; startX = mouseX; startY = mouseY;}
    else {velx = beforeMouseX - mouseX; vely = mouseY - beforeMouseY;}
    beforeMouse = mouseState.right;
  }
  if (mouseState.right) {scrollX = startScrollX + (mouseX - startX) * -1; scrollY = startScrollY + (mouseY - startY); changeCursor("all-move", 16, 16)}
  else {changeCursor("default")}
  beforeMouseX = mouseX; beforeMouseY = mouseY;
  requestAnimationFrame(game);
}

startup();

} catch(error) {
  document.getElementById("showErr").innerHTML = error;
  throw new Error(error);
}