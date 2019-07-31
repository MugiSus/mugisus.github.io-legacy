//canvas starter kit
var mouseState = {"wheel":0, "x":0, "y":0}, keydown = {}, time, fps, timeStamp = [], started = new Date().getTime();
const canvas = document.getElementById("disp");
const ctx = canvas.getContext("2d");
var ctxSet =(obj)=> Object.keys(obj).forEach(x=>ctx[x] = obj[x]);
var getFPS =(sec = 1)=> {
    time = (new Date().getTime() - started) / 1000;
    timeStamp.push(time);
    timeStamp = timeStamp.filter(x => time - x <= sec);
    fps = Math.floor((timeStamp.length / sec) * 10) / 10;
}
var ratio, resize =()=> {
    canvas.height = document.body.clientHeight; canvas.width = document.body.clientWidth;
    ratio = Math.min(canvas.width / 3200, canvas.height / 1800);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(ratio, ratio);
}
canvas.addEventListener("mousedown", (event)=>{mouseState[["left","wheel","right"][event.button]] = true;});
canvas.addEventListener("mouseup", (event)=>{mouseState[["left","wheel","right"][event.button]] = false;});
canvas.addEventListener("wheel", (event)=>{mouseState["wheel"] += event.deltaY > 0 ? 1 : -1});
document.addEventListener("keydown", (event)=>{keydown[event.key] = true;});
document.addEventListener("keyup", (event)=>{keydown[event.key] = false;});
document.addEventListener("mousemove", (event)=>{mouseState.x = (event.clientX - canvas.width / 2) / ratio; mouseState.y = (event.clientY - canvas.height / 2) / ratio; mouseState.cliX = event.clientX; mouseState.cliY = event.clientY;});
var updatePos =()=> {mouseState.x = (event.changedTouches[0].pageX - canvas.width / 2) / ratio; mouseState.y = (event.changedTouches[0].pageY - canvas.height / 2) / ratio; mouseState.cliX = event.changedTouches[0].pageX; mouseState.cliY = event.changedTouches[0].pageY};
document.addEventListener("touchstart", ()=>{mouseState["left"] = true; updatePos();});
document.addEventListener("touchmove", (event)=>{event.preventDefault(); updatePos();}, {passive: false});
document.addEventListener("touchend", ()=>{mouseState["left"] = false; updatePos();});
window.addEventListener("resize", ()=>{resize()});
canvas.oncontextmenu =()=> {return false;};
resize();
//end kit

var things = {}, clicked = false, offSet = [[0,0],[0,0]], stageMove = false, cameraX = 0, cameraY = 0, cameraZoom = 1, mouseXinStage, mouseYinStage, zindex = 0, thingId = 0, drawList = [], idList = [], lastWheel = 0, cursorAlpha = 0.1;

//start defining GATEs

var OR = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = ++zindex;
        this.bool = false;
        this.in0 = false;
        this.in1 = false;
        this.out0 = false;
        this.pinPos = [[[-250,-60],[-250,60]],[[250,0]]];
    }
    getPath(id) {
        this.out0 = this.in0 || this.in1;
        this.bool = this.out0;

        let path = new Path2D();
        path.moveTo(this.x-125, this.y-60);
        path.lineTo(this.x-250, this.y-60);
        path.moveTo(this.x-125, this.y+60);
        path.lineTo(this.x-250, this.y+60);
        path.moveTo(this.x+150, this.y);
        path.lineTo(this.x+250, this.y);
        path.moveTo(this.x-150, this.y-100);
        path.quadraticCurveTo(this.x+85, this.y-85, this.x+150, this.y);
        path.quadraticCurveTo(this.x+85, this.y+85, this.x-150, this.y+100);
        path.quadraticCurveTo(this.x-75, this.y, this.x-150, this.y-100);
        path.closePath();
        drawList.unshift({"type":"gate", "path":path, "style":this.bool?"#ff4444":"#6666ff"});
        dragger(path, id, this);
    }
};

var AND = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = ++zindex;
        this.bool = false;
        this.in0 = false;
        this.in1 = false;
        this.out0 = false;
        this.pinPos = [[[-250,-60],[-250,60]],[[250,0]]];
    }
    getPath(id) {
        this.out0 = this.in0 && this.in1;
        this.bool = this.out0;

        let path = new Path2D();
        path.moveTo(this.x-150, this.y-60);
        path.lineTo(this.x-250, this.y-60);
        path.moveTo(this.x-150, this.y+60);
        path.lineTo(this.x-250, this.y+60);
        path.moveTo(this.x+150, this.y);
        path.lineTo(this.x+250, this.y);
        path.moveTo(this.x-150, this.y-100);
        path.lineTo(this.x, this.y-100);
        path.quadraticCurveTo(this.x+150, this.y-100, this.x+150, this.y);
        path.quadraticCurveTo(this.x+150, this.y+100, this.x, this.y+100);
        path.lineTo(this.x-150, this.y+100);
        path.closePath();
        drawList.unshift({"type":"gate", "path":path, "style":this.bool?"#ff4444":"#6666ff"});
        dragger(path, id, this);
    }
};

var XOR = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = ++zindex;
        this.bool = false;
        this.in0 = false;
        this.in1 = false;
        this.out0 = false;
        this.pinPos = [[[-250,-60],[-250,60]],[[250,0]]];
    }
    getPath(id) {
        this.out0 = this.in0 != this.in1;
        this.bool = this.out0;

        let path = new Path2D();
        path.moveTo(this.x-125, this.y-60);
        path.lineTo(this.x-250, this.y-60);
        path.moveTo(this.x-125, this.y+60);
        path.lineTo(this.x-250, this.y+60);
        path.moveTo(this.x+150, this.y);
        path.lineTo(this.x+250, this.y);
        path.moveTo(this.x-150, this.y-100);
        path.quadraticCurveTo(this.x+85, this.y-85, this.x+150, this.y);
        path.quadraticCurveTo(this.x+85, this.y+85, this.x-150, this.y+100);
        path.quadraticCurveTo(this.x-75, this.y, this.x-150, this.y-100);
        path.closePath();
        path.moveTo(this.x-200, this.y+100);
        path.quadraticCurveTo(this.x-100, this.y, this.x-200, this.y-100);
        path.quadraticCurveTo(this.x-100, this.y, this.x-200, this.y+100);
        drawList.unshift({"type":"gate", "path":path, "style":this.bool?"#ff4444":"#6666ff"});
        dragger(path, id, this);
    }
};

var NOT = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = ++zindex;
        this.bool = true;
        this.in0 = false;
        this.out0 = false;
        this.pinPos = [[[-225,0]],[[225,0]]];
    }
    getPath(id) {
        this.out0 = !this.in0;
        this.bool = this.out0;

        let path = new Path2D();
        path.moveTo(this.x-125, this.y);
        path.lineTo(this.x-225, this.y);
        path.moveTo(this.x+125, this.y);
        path.lineTo(this.x+225, this.y);
        path.moveTo(this.x-125, this.y-100);
        path.lineTo(this.x+70, this.y);
        path.lineTo(this.x-125, this.y+100);
        path.closePath();
        path.moveTo(this.x+125, this.y);
        path.arc(this.x+100, this.y, 25, 0, Math.PI*2);
        drawList.unshift({"type":"gate", "path":path, "style":this.bool?"#ff4444":"#6666ff"});
        dragger(path, id, this);
    }
};

var OUTPUT = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = ++zindex;
        this.bool = false;
        this.in0 = false;
        this.out0 = false;
        this.pinPos = [[[-175,0]],[[150,0]]];
    }
    getPath(id) {
        this.bool = this.in0;

        let path = new Path2D();
        path.arc(this.x, this.y, 75, 0, Math.PI*2);
        path.moveTo(this.x + 75, this.y);
        path.lineTo(this.x + 150, this.y);
        path.moveTo(this.x - 75, this.y);
        path.lineTo(this.x - 175, this.y);
        drawList.unshift({"type":"gate", "path":path, "style":this.bool?"#ff4444":"#6666ff"});
        dragger(path, id, this);
    }
};

var INPUT = class {
    constructor(x, y, def = false) {
        this.x = x;
        this.y = y;
        this.z = ++zindex;
        this.bool = def;
        this.out0 = def;
        this.pinPos = [[[0,0]],[[175,0]]];
        this.lastClicked = 0;
    }
    getPath(id) {
        let color;
        if (((mouseXinStage - this.x) ** 2 + (mouseYinStage - this.y) ** 2) ** 0.5 < 75) {
            if (mouseState.left && !this.lastClicked) this.lastClicked = new Date().getTime();
            else if (!mouseState.left && this.lastClicked) {
                if (new Date().getTime() - this.lastClicked < 300) this.out0 = this.out0 ? false : true;
                this.lastClicked = 0;
            }
            color = this.bool ? "#ff8888" : "#aaaaff";
        } else color = this.bool ? "#ff4444" : "#6666ff";

        this.bool = this.out0;

        let path = new Path2D();
        path.arc(this.x, this.y, 40, 0, Math.PI*2);
        path.moveTo(this.x + 75, this.y);
        path.arc(this.x, this.y, 75, 0, Math.PI*2);
        path.moveTo(this.x + 75, this.y);
        path.lineTo(this.x + 175, this.y);
        drawList.unshift({"type":"gate", "path":path, "style":color});
        dragger(path, id, this);
    }
};

var WIRE = class {
    constructor(in0, inNum, out0, outNum) {
        this.bool = false;
        this.in0 = in0;
        this.out0 = out0;
        this.inNum = inNum;
        this.outNum = outNum;
        this.z = 0;
    }
    getPath(id) {
        this.bool = things[this.in0][`out${this.inNum}`];
        things[this.out0][`in${this.outNum}`] = this.bool;

        let p = [things[this.in0].x + things[this.in0].pinPos[1][this.inNum][0], things[this.in0].y + things[this.in0].pinPos[1][this.inNum][1], things[this.out0].x + things[this.out0].pinPos[0][this.outNum][0], things[this.out0].y + things[this.out0].pinPos[0][this.outNum][1]];
        let path = new Path2D();
        path.moveTo(p[0], p[1]);
        if (p[0] < p[2]) path.bezierCurveTo(p[0] + (p[2] - p[0]) * 0.5, p[1], p[0] + (p[2] - p[0]) * 0.5, p[3], p[2], p[3]);
        else path.bezierCurveTo(p[0], p[1] + (p[3] - p[1]) * 0.5, p[2], p[1] + (p[3] - p[1]) * 0.5, p[2], p[3]);

        drawList.unshift({"type":"wire", "path":path, "style":this.bool?"#cc6666":"#666688"});
    }
};

//end defining GATEs

var dragger =(path, id, obj)=> {
    if ((ctx.isPointInPath(path, mouseState.cliX, mouseState.cliY) && !clicked || clicked == id) && mouseState.left) {
        if (!clicked) {
            if (obj.z != zindex) obj.z = ++zindex;
            sort();
            clicked = id;
            offSet[0] = [mouseXinStage - obj.x, mouseYinStage - obj.y];
        }
        if (mouseState.right) offSet[0] = [mouseXinStage - obj.x, mouseYinStage - obj.y];
        else {
            obj.x = mouseXinStage - offSet[0][0];
            obj.y = mouseYinStage - offSet[0][1];
        }
    } else if (!mouseState.left && clicked) clicked = false;
}

var sort =()=> idList = Object.keys(things).sort((a,b)=>{return things[a].z < things[b].z ? 1 : (things[a].z > things[b].z ? -1 : 0)});

var make =(thing, id = ++thingId)=> {things[id] = thing; sort();}

make(new INPUT(-1500,-500,true),"input1");
make(new INPUT(-1500,0),"input2");
make(new INPUT(-1500,500,true),"input3");
make(new XOR(-500,-500),"xor1");
make(new AND(-500,0),"and1");
make(new XOR(500,-500),"xor2");
make(new AND(500,-60),"and2");
make(new OR(500,500),"or1");
make(new OUTPUT(1500,-500),"digit1");
make(new OUTPUT(1500,500),"digit2");
make(new WIRE("input1",0,"xor1",0));
make(new WIRE("input2",0,"xor1",1));
make(new WIRE("input1",0,"and1",0));
make(new WIRE("input2",0,"and1",1));
make(new WIRE("xor1",0,"and2",0));
make(new WIRE("input3",0,"and2",1));
make(new WIRE("xor1",0,"xor2",0));
make(new WIRE("input3",0,"xor2",1));
make(new WIRE("and2",0,"or1",0));
make(new WIRE("and1",0,"or1",1));
make(new WIRE("xor2",0,"digit1",0));
make(new WIRE("or1",0,"digit2",0));

function main() {
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    ctx.strokeStyle = "#888888"
    ctx.globalAlpha = (cursorAlpha += (0.25 - cursorAlpha) / 25);
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-100,0);
    ctx.lineTo(-40,0);
    ctx.moveTo(40,0);
    ctx.lineTo(100,0);
    ctx.moveTo(0,-100);
    ctx.lineTo(0,-40);
    ctx.moveTo(0,40);
    ctx.lineTo(0,100);
    ctx.stroke();
    ctx.globalAlpha = 1;
    mouseXinStage = (mouseState.x - (-cameraX * cameraZoom)) / cameraZoom;
    mouseYinStage = (mouseState.y - (-cameraY * cameraZoom)) / cameraZoom;
    if (mouseState.wheel != lastWheel) {
        cursorAlpha = 1
        cameraZoom = 1.2 ** -mouseState.wheel;
        lastWheel = mouseState.wheel;
    }
    if (mouseState.right) {
        if (!stageMove) {
            stageMove = true;
            offSet[1] = [mouseState.x - (-cameraX * cameraZoom), mouseState.y - (-cameraY * cameraZoom)];
        }
        cameraX = (mouseState.x - offSet[1][0]) * -1 / cameraZoom;
        cameraY = (mouseState.y - offSet[1][1]) * -1 / cameraZoom;
    } else if (stageMove && !mouseState.right) stageMove = false;
    ctx.save();
    ctx.scale(cameraZoom, cameraZoom);
    ctx.translate(-cameraX, -cameraY);
    drawList = [];
    idList.forEach(x=>things[x].getPath(x));
    drawList.forEach(x=>{
        switch (x.type) {
            case "gate" : {
                ctx.fillStyle = x.style;
                ctx.lineWidth = 10;
                ctx.strokeStyle = "#202020";
                ctx.fill(x.path);
                ctx.stroke(x.path);
            } break;
            case "wire" : {
                ctx.strokeStyle = x.style;
                ctx.lineWidth = 20;
                ctx.stroke(x.path);
            } break;
        }
    });
    ctx.restore();
    requestAnimationFrame(main);
}

main();