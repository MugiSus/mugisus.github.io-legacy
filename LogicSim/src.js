//canvas starter kit
let mouseState = {wheel:10, x:0, y:0, left:false, middle:false, right:false}, keydown = {}, time, fps, timeStamp = [], started = new Date().getTime();
const canvas = document.getElementById("disp");
const ctx = canvas.getContext("2d");
let ctxSet =(obj)=> Object.keys(obj).forEach(x=>ctx[x] = obj[x]);
let getFPS =(sec = 1)=> {
    time = (new Date().getTime() - started) / 1000;
    timeStamp.push(time);
    timeStamp = timeStamp.filter(x => time - x <= sec);
    fps = Math.floor((timeStamp.length / sec) * 10) / 10;
}
let ratio, resize =()=> {
    canvas.height = document.body.clientHeight; canvas.width = document.body.clientWidth;
    ratio = Math.min(canvas.width / 3200, canvas.height / 1800);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(ratio, ratio);
}
canvas.addEventListener("mousedown", (event)=>{mouseState[["left","middle","right"][event.button]] = true;});
canvas.addEventListener("mouseup", (event)=>{mouseState[["left","middle","right"][event.button]] = false;});
canvas.addEventListener("wheel", (event)=>{mouseState["wheel"] += event.deltaY > 0 ? -1 : 1});
document.addEventListener("keydown", (event)=>{keydown[event.key] = true;});
document.addEventListener("keyup", (event)=>{keydown[event.key] = false;});
document.addEventListener("mousemove", (event)=>{mouseState.x = (event.clientX - canvas.width / 2) / ratio; mouseState.y = (event.clientY - canvas.height / 2) / ratio; mouseState.cliX = event.clientX; mouseState.cliY = event.clientY;});
let updatePos =()=> {mouseState.x = (event.changedTouches[0].pageX - canvas.width / 2) / ratio; mouseState.y = (event.changedTouches[0].pageY - canvas.height / 2) / ratio; mouseState.cliX = event.changedTouches[0].pageX; mouseState.cliY = event.changedTouches[0].pageY};
document.addEventListener("touchstart", ()=>{mouseState["left"] = true; updatePos();});
document.addEventListener("touchmove", (event)=>{event.preventDefault(); updatePos();}, {passive: false});
document.addEventListener("touchend", ()=>{mouseState["left"] = false; updatePos();});
window.addEventListener("resize", ()=>{resize()});
canvas.oncontextmenu =()=> {return false};
resize();
//end kit

let things = {}, clicked = false, offSet = [[0,0],[0,0]], stageMove = false, cameraX = 0, cameraY = 0, zoom = 0.95, cameraZoom = zoom ** mouseState.wheel, mouseXinStage, mouseYinStage, zindex = 0, thingId = 0, drawList = [], idList = [], lastWheel = mouseState.wheel, menuY = -100, menuYvel = 0, tcRadius = 0, tcRvel = 0, deleteThing, pinClicked = false, exportClicked = false, changed = true, timeUnits = [6,15,30,60,300];
window.onbeforeunload =()=> {return changed ? true : null};

//start defining things

let OR = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = ++zindex;
        this.bool = false;
        this.in0 = false;
        this.in1 = false;
        this.out0 = false;
        this.pinPos = [[[-250,-60],[-250,60]],[[250,0]]];
        this.wireId = {};
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
        dragger(path, id, this);
        if (id) makeWire(id, this);

        return {type:"gate", path:path, style:this.bool?color.gTrue:color.gFalse};
    }
};

let AND = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = ++zindex;
        this.bool = false;
        this.in0 = false;
        this.in1 = false;
        this.out0 = false;
        this.pinPos = [[[-250,-60],[-250,60]],[[250,0]]];
        this.wireId = {};
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
        dragger(path, id, this);
        if (id) makeWire(id, this);

        return {type:"gate", path:path, style:this.bool?color.gTrue:color.gFalse};
    }
};

let XOR = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = ++zindex;
        this.bool = false;
        this.in0 = false;
        this.in1 = false;
        this.out0 = false;
        this.pinPos = [[[-250,-60],[-250,60]],[[250,0]]];
        this.wireId = {};
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
        dragger(path, id, this);
        if (id) makeWire(id, this);
        
        return {type:"gate", path:path, style:this.bool?color.gTrue:color.gFalse};
    }
};

let NOT = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = ++zindex;
        this.bool = true;
        this.in0 = false;
        this.out0 = true;
        this.pinPos = [[[-225,0]],[[225,0]]];
        this.wireId = {};
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
        dragger(path, id, this);
        if (id) makeWire(id, this);

        return {type:"gate", path:path, style:this.bool?color.gTrue:color.gFalse};
    }
};

let NOR = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = ++zindex;
        this.bool = true;
        this.in0 = false;
        this.in1 = false;
        this.out0 = true;
        this.pinPos = [[[-250,-60],[-250,60]],[[250,0]]];
        this.wireId = {};
    }
    getPath(id) {
        this.out0 = !(this.in0 || this.in1);
        this.bool = this.out0;

        let path = new Path2D();
        path.moveTo(this.x-125, this.y-60);
        path.lineTo(this.x-250, this.y-60);
        path.moveTo(this.x-125, this.y+60);
        path.lineTo(this.x-250, this.y+60);
        path.moveTo(this.x+175, this.y);
        path.lineTo(this.x+250, this.y);
        path.moveTo(this.x-150, this.y-100);
        path.quadraticCurveTo(this.x+60, this.y-85, this.x+125, this.y);
        path.quadraticCurveTo(this.x+60, this.y+85, this.x-150, this.y+100);
        path.quadraticCurveTo(this.x-75, this.y, this.x-150, this.y-100);
        path.closePath();
        path.moveTo(this.x+175, this.y);
        path.arc(this.x+150, this.y, 25, 0, Math.PI*2);
        dragger(path, id, this);
        if (id) makeWire(id, this);

        return {type:"gate", path:path, style:this.bool?color.gTrue:color.gFalse};
    }
};

let NAND = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = ++zindex;
        this.bool = false;
        this.in0 = false;
        this.in1 = false;
        this.out0 = false;
        this.pinPos = [[[-250,-60],[-250,60]],[[250,0]]];
        this.wireId = {};
    }
    getPath(id) {
        this.out0 = !(this.in0 && this.in1);
        this.bool = this.out0;

        let path = new Path2D();
        path.moveTo(this.x-150, this.y-60);
        path.lineTo(this.x-250, this.y-60);
        path.moveTo(this.x-150, this.y+60);
        path.lineTo(this.x-250, this.y+60);
        path.moveTo(this.x+175, this.y);
        path.lineTo(this.x+250, this.y);
        path.moveTo(this.x-150, this.y-100);
        path.lineTo(this.x-25, this.y-100);
        path.quadraticCurveTo(this.x+125, this.y-100, this.x+125, this.y);
        path.quadraticCurveTo(this.x+125, this.y+100, this.x-25, this.y+100);
        path.lineTo(this.x-150, this.y+100);
        path.closePath();
        path.moveTo(this.x+175, this.y);
        path.arc(this.x+150, this.y, 25, 0, Math.PI*2);
        dragger(path, id, this);
        if (id) makeWire(id, this);
        
        return {type:"gate", path:path, style:this.bool?color.gTrue:color.gFalse};
    }
};

let XNOR = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = ++zindex;
        this.bool = true;
        this.in0 = false;
        this.in1 = false;
        this.out0 = true;
        this.pinPos = [[[-250,-60],[-250,60]],[[250,0]]];
        this.wireId = {};
    }
    getPath(id) {
        this.out0 = this.in0 == this.in1;
        this.bool = this.out0;

        let path = new Path2D();
        path.moveTo(this.x-125, this.y-60);
        path.lineTo(this.x-250, this.y-60);
        path.moveTo(this.x-125, this.y+60);
        path.lineTo(this.x-250, this.y+60);
        path.moveTo(this.x+175, this.y);
        path.lineTo(this.x+250, this.y);
        path.moveTo(this.x-150, this.y-100);
        path.quadraticCurveTo(this.x+60, this.y-85, this.x+125, this.y);
        path.quadraticCurveTo(this.x+60, this.y+85, this.x-150, this.y+100);
        path.quadraticCurveTo(this.x-75, this.y, this.x-150, this.y-100);
        path.closePath();
        path.moveTo(this.x+175, this.y);
        path.arc(this.x+150, this.y, 25, 0, Math.PI*2);
        path.moveTo(this.x-200, this.y+100);
        path.quadraticCurveTo(this.x-100, this.y, this.x-200, this.y-100);
        path.quadraticCurveTo(this.x-100, this.y, this.x-200, this.y+100);
        dragger(path, id, this);
        if (id) makeWire(id, this);

        return {type:"gate", path:path, style:this.bool?color.gTrue:color.gFalse};
    }
};

let OUTPUT = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.z = ++zindex;
        this.bool = false;
        this.in0 = false;
        this.out0 = false;
        this.pinPos = [[[-175,0]],[[150,0]]];
        this.wireId = {};
    }
    getPath(id) {
        this.out0 = this.in0;
        this.bool = this.out0;

        let path = new Path2D();
        path.arc(this.x, this.y, 75, 0, Math.PI*2);
        path.moveTo(this.x + 75, this.y);
        path.lineTo(this.x + 150, this.y);
        path.moveTo(this.x - 75, this.y);
        path.lineTo(this.x - 175, this.y);
        dragger(path, id, this);
        if (id) makeWire(id, this);

        return {type:"gate", path:path, style:this.bool?color.gTrue:color.gFalse};
    }
};

let INPUT = class {
    constructor(x, y, def = false) {
        this.x = x;
        this.y = y;
        this.z = ++zindex;
        this.bool = def;
        this.out0 = def;
        this.pinPos = [[],[[175,0]]];
        this.lastClicked = 0;
        this.wireId = {};
    }
    getPath(id) {
        let gateColor;
        if (((mouseXinStage - this.x) ** 2 + (mouseYinStage - this.y) ** 2) ** 0.5 < 75) {
            if (mouseState.left && !this.lastClicked) this.lastClicked = new Date().getTime();
            else if (!mouseState.left && this.lastClicked) {
                if (new Date().getTime() - this.lastClicked < 300) this.out0 = this.out0 ? false : true;
                this.lastClicked = 0;
            }
            gateColor = this.bool ? color.gTrueFocus : color.gFalseFocus;
        } else gateColor = this.bool ? color.gTrue : color.gFalse;

        this.bool = this.out0;

        let path = new Path2D();
        path.arc(this.x, this.y, 40, 0, Math.PI*2);
        path.moveTo(this.x + 75, this.y);
        path.arc(this.x, this.y, 75, 0, Math.PI*2);
        path.moveTo(this.x + 75, this.y);
        path.lineTo(this.x + 175, this.y);
        dragger(path, id, this);
        if (id) makeWire(id, this);

        return {type:"gate", path:path, style:gateColor};
    }
};

let WIRE = class {
    constructor(in0, inNum, out0, outNum) {
        this.bool = false;
        this.in0 = in0;
        this.out0 = out0;
        this.inNum = inNum;
        this.outNum = outNum;
        this.z = 0;
    }
    getPath(id) {
        if ((this.in0 == "_" || this.out0 == "_") && !pinFocused && !pinFocused[2] && (mouseState.left || mouseState.middle)) {
            if (this.in0 == "_") things[things[id].out0].wireId[`in${things[id].outNum}`] = (things[things[id].out0].wireId[`in${things[id].outNum}`] || []).filter(y=>y!=id);
            else things[things[id].in0].wireId[`out${things[id].inNum}`] = (things[things[id].in0].wireId[`out${things[id].inNum}`] || []).filter(y=>y!=id);
            delete things[id];
            pinClicked[3] = true;
            sort();
            return {type:"wire", path:new Path2D()};
        }
        if (this.in0 == "_") {
            this.bool = false;
            if (mouseState.left && pinFocused && !pinClicked[2] && pinFocused[1] == "out") {
                this.in0 = pinFocused[0];
                this.inNum = pinFocused[2];
                pinClicked[3] = true;
                changed = true;
            }
        } else {
            if ((things[this.in0].wireId[`out${this.inNum}`] || []).indexOf(id) == -1) {
                if (!things[this.in0].wireId[`out${this.inNum}`]) things[this.in0].wireId[`out${this.inNum}`] = [];
                things[this.in0].wireId[`out${this.inNum}`].push(id);
            }
            this.bool = things[this.in0][`out${this.inNum}`];
        }
        if (this.out0 == "_") {
            if (mouseState.left && pinFocused && !pinClicked[2] && pinFocused[1] == "in" && !(things[pinFocused[0]].wireId[`in${pinFocused[2]}`]||[]).length) {
                this.out0 = pinFocused[0];
                this.outNum = pinFocused[2];
                pinClicked[3] = true;
                changed = true;
            }
        } else {
            if ((things[this.out0].wireId[`in${this.outNum}`] || []).indexOf(id) == -1) {
                if (!things[this.out0].wireId[`in${this.outNum}`]) things[this.out0].wireId[`in${this.outNum}`] = [];
                things[this.out0].wireId[`in${this.outNum}`].push(id);
            }
            things[this.out0][`in${this.outNum}`] = this.bool;
        }

        let p;
        if (this.in0 == "_") p = [mouseXinStage, mouseYinStage, things[this.out0].x + things[this.out0].pinPos[0][this.outNum][0], things[this.out0].y + things[this.out0].pinPos[0][this.outNum][1]];
        else if (this.out0 == "_") p = [things[this.in0].x + things[this.in0].pinPos[1][this.inNum][0], things[this.in0].y + things[this.in0].pinPos[1][this.inNum][1], mouseXinStage, mouseYinStage];
        else p = [things[this.in0].x + things[this.in0].pinPos[1][this.inNum][0], things[this.in0].y + things[this.in0].pinPos[1][this.inNum][1], things[this.out0].x + things[this.out0].pinPos[0][this.outNum][0], things[this.out0].y + things[this.out0].pinPos[0][this.outNum][1]];
        let path = new Path2D();
        path.moveTo(p[0], p[1]);
        if (qual == "low") path.lineTo(p[2],p[3]);
        else {
            if (p[0] < p[2]) path.bezierCurveTo(p[0] + (p[2] - p[0]) * 0.5, p[1], p[0] + (p[2] - p[0]) * 0.5, p[3], p[2], p[3]);
            else path.bezierCurveTo(p[0], p[1] + (p[3] - p[1]) * 0.5, p[2], p[1] + (p[3] - p[1]) * 0.5, p[2], p[3]);
        }

        return {type:"wire", path:path, style:this.bool?color.wTrue:color.wFalse};
    }
};

//end defining GATEs

let dragger =(path, id, obj)=> {
    if ((ctx.isPointInPath(path, mouseState.cliX, mouseState.cliY) && !clicked || clicked == id) && mouseState.left && mouseState.y+canvas.height/2/ratio > menuY) {
        if (!clicked) {
            if (obj.z != zindex) obj.z = ++zindex;
            sort();
            clicked = id;
            offSet[0] = [mouseXinStage - obj.x, mouseYinStage - obj.y];
            changed = true;
        }
        if (mouseState.right) offSet[0] = [mouseXinStage - obj.x, mouseYinStage - obj.y];
        else {
            obj.x = mouseXinStage - offSet[0][0];
            obj.y = mouseYinStage - offSet[0][1];
        }
        return true;
    } else if (!mouseState.left && clicked) clicked = false;
    return false;
}

let makeWire =(id, obj)=> {
    if (pinClicked[3] || clicked) return;
    if (pinClicked && pinClicked[2] && !mouseState.left) pinClicked[2] = false;
    obj.pinPos.forEach((x,i)=>x.forEach((x, y)=>{
        if (((mouseXinStage - (obj.x + x[0])) ** 2 + (mouseYinStage - (obj.y + x[1])) ** 2) ** 0.5 < 15 / cameraZoom) {
            pinFocused = [id, i?"out":"in", y, false];
            if ((mouseState.left || mouseState.middle) && !pinClicked) {
                pinClicked = [id, `${i?"out":"in"}${y}`, true];
                if ((i == 0 && (obj.wireId[`in${y}`] || []).length) || (obj.wireId[`${i?"out":"in"}${y}`] || []).length && mouseState.middle) obj.wireId[`${i?"out":"in"}${y}`].forEach(x=>{
                    if (i == 0) things[things[x].out0][`in${things[x].outNum}`] = false;
                    things[things[x][`${i?"in":"out"}0`]].wireId[`${i?"out":"in"}${things[x].outNum}`] = things[things[x][`${i?"in":"out"}0`]].wireId[`${i?"out":"in"}${things[x][`${i?"in":"out"}Num`]}`].filter(y=>y!=x);
                    things[x][`${i?"in":"out"}0`] = "_";
                });
                else make(new WIRE(i?id:"_",y,i?"_":id,y));
            }
        }
    }));
}

let exportCode =()=> {
    sort();
    let importArr = [cameraX, cameraY, mouseState.wheel].map(x=>Math.floor(x));
    idList.forEach(x=>{
        switch (things[x].constructor.name) {
            case "WIRE": importArr.push([idList.indexOf(things[x].in0.toString())+1, things[x].inNum, idList.indexOf(things[x].out0.toString())+1, things[x].outNum]); break;
            default: importArr.push([["OR","AND","XOR","NOT","NOR","NAND","XNOR","OUTPUT","INPUT","-"].indexOf(things[x].constructor.name)+(things[x].constructor.name=="INPUT" && things[x].bool ? 1 : 0), Math.floor(things[x].x), Math.floor(things[x].y)]);
        }
    });
    changed = false;
    return importArr.map(x=>typeof(x)=="number"?x:x.join(",")).join(";");
}

let importCode =(code)=> {
    let importArr = code.split(";")
    cameraX = parseInt(importArr.shift());
    cameraY = parseInt(importArr.shift());
    mouseState.wheel = parseInt(importArr.shift());
    importArr = importArr.map(x=>x.split(","));
    cameraZoom = zoom ** mouseState.wheel;
    thingId = importArr.length;
    zindex = 0;
    things = {};
    importArr.forEach((x,y)=>{
        if (x.length == 4) things[y+1] = new WIRE(...x);
        else if (x[0] != "") things[y+1] = new [OR,AND,XOR,NOT,NOR,NAND,XNOR,OUTPUT,INPUT,INPUT][x[0]](x[1]*1,x[2]*1,x[0]==9?true:false);
    });
    sort();
    changed = false;
}

let sort =()=> {
    idList = Object.keys(things).sort((a,b)=>{return things[a].z < things[b].z ? 1 : (things[a].z > things[b].z ? -1 : 0)});
    changed = true;
}

let make =(thing, id = ++thingId)=> {things[id] = thing; sort(); return id};

let drawStage =()=> {
    ctx.save();
    ctx.scale(cameraZoom, cameraZoom);
    ctx.translate(-cameraX, -cameraY);
    drawList = [];
    pinFocused = false;
    idList.forEach(x=>drawList.unshift(things[x].getPath(x)));
    if (pinClicked[3] && !(mouseState.left || mouseState.middle)) pinClicked = false;
    drawList.forEach(x=>{
        switch (x.type) {
            case "gate": {
                ctx.fillStyle = x.style;
                ctx.lineWidth = 10;
                ctx.strokeStyle = color.contour;
                ctx.fill(x.path);
                ctx.stroke(x.path);
            } break;
            case "wire": {
                ctx.strokeStyle = x.style;
                ctx.lineWidth = 20;
                ctx.stroke(x.path);
            } break;
        }
    });
    ctx.restore();
}

let cameraSet =()=> {
    mouseXinStage = (mouseState.x - (-cameraX * cameraZoom)) / cameraZoom;
    mouseYinStage = (mouseState.y - (-cameraY * cameraZoom)) / cameraZoom;
    if (mouseState.wheel != lastWheel) {
        cameraZoom = zoom ** mouseState.wheel;
        if (lastWheel > mouseState.wheel) {
            cameraX += (mouseXinStage - cameraX) * (1 - zoom);
            cameraY += (mouseYinStage - cameraY) * (1 - zoom);
        } else {
            cameraX += (mouseXinStage - cameraX) * -(1 / zoom - 1);
            cameraY += (mouseYinStage - cameraY) * -(1 / zoom - 1);
        }
        lastWheel = mouseState.wheel;
    }
    if (mouseState.right) {
        if (!stageMove) {
            stageMove = true;
            offSet[1] = [mouseState.x, mouseState.y, cameraX, cameraY];
        }
        cameraX = offSet[1][2] + -(mouseState.x - offSet[1][0]) / cameraZoom;
        cameraY = offSet[1][3] + -(mouseState.y - offSet[1][1]) / cameraZoom;
    } else if (stageMove && !mouseState.right) stageMove = false;
}

let drawMenu =()=> {
    if (clicked) {
        menuYvel += (-50 - menuY) / 5;
        menuYvel *= 0.6;
    } else if (mouseState.y+canvas.height/2/ratio < menuY) {
        menuYvel += (300 - menuY) / 10;
        menuYvel *= 0.8;
    } else {
        menuYvel += (75 - menuY) / 10;
        menuYvel *= 0.6;
    }
    menuY += menuYvel;
    ctx.fillStyle = color.menu;
    ctx.beginPath()
    ctx.moveTo(-1600,-canvas.height/2/ratio);
    ctx.lineTo(-1600,menuY-canvas.height/2/ratio-50);
    ctx.quadraticCurveTo(-1600,menuY-canvas.height/2/ratio,-1550,menuY-canvas.height/2/ratio);
    ctx.lineTo(1550,menuY-canvas.height/2/ ratio);
    ctx.quadraticCurveTo(1600,menuY-canvas.height/2/ratio,1600,menuY-canvas.height/2/ratio-50);
    ctx.lineTo(1600,-canvas.height/2/ratio);
    ctx.fill();
    drawList = [];
    [OR,AND,XOR,NOT,NOR,NAND,XNOR,OUTPUT,INPUT].forEach((x,y,z)=>drawList.unshift([new x((-1400 + (y/z.length) * 2800) * 2, (menuY - 150 -canvas.height/2/ratio) * 2).getPath(), x]));
    ctx.save();
    ctx.scale(0.5,0.5);
    drawList.forEach(x=>{
        ctx.fillStyle = x[0].style;
        ctx.lineWidth = 10;
        ctx.strokeStyle = color.contour;
        ctx.fill(x[0].path);
        ctx.stroke(x[0].path);
        if (ctx.isPointInPath(x[0].path,mouseState.cliX,mouseState.cliY) && mouseState.left && !clicked) clicked = make(new x[1](Infinity, Infinity));
    });
    ctx.restore();
    ctx.lineWidth = 16;
    ctx.strokeStyle = color.menu;
    ctx.fillStyle = color.menuItem;
    let p = [1400,menuY-150-canvas.height/2/ratio];
    if (((mouseState.x - p[0]) ** 2 + (mouseState.y - p[1]) ** 2) ** 0.5 < 75) {
        if (mouseState.left && changed) {
            if (!exportClicked) {
                exportClicked = true;
                window.history.pushState(null, null, location.pathname + `?theme=${themeName}&qual=${qual}&import=${exportCode()}`);
            }
            p[1] -= 5;
        } else {
            if (!mouseState.left) exportClicked = false;
            p[1] -= 10;
        }
    }
    ctx.beginPath();
    ctx.moveTo(p[0]-70,p[1]-25);
    ctx.lineTo(p[0]-70,p[1]+70);
    ctx.lineTo(p[0]+70,p[1]+70);
    ctx.lineTo(p[0]+70,p[1]-25);
    ctx.lineTo(p[0],p[1]-25);
    ctx.lineTo(p[0]-10,p[1]-40);
    ctx.lineTo(p[0]-60,p[1]-40);
    ctx.lineTo(p[0]-70,p[1]-25);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(p[0]-62,p[1]+70);
    ctx.lineTo(p[0]-40,p[1]);
    ctx.lineTo(p[0]+90,p[1]);
    ctx.lineTo(p[0]+70,p[1]+70);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(p[0]+10,p[1]-50);
    ctx.lineTo(p[0]+10,p[1]+15);
    ctx.lineTo(p[0]-10,p[1]+15);
    ctx.lineTo(p[0]+25,p[1]+50);
    ctx.lineTo(p[0]+55,p[1]+15);
    ctx.lineTo(p[0]+40,p[1]+15);
    ctx.lineTo(p[0]+40,p[1]-50);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    if (!changed) {
        ctx.textAlign = "center";
        ctx.lineWidth = 10;
        ctx.font = "30px sans-serif";
        ctx.strokeText("< Copy link to save >", p[0], p[1]+20);
        ctx.fillText("< Copy link to save >", p[0], p[1]+20);
    }
}

let drawTrashcan =()=> {
    ctx.fillStyle = color.menu;
    if (!clicked) {
        if (deleteThing) {
            Object.values(things[deleteThing].wireId).forEach(x=>x.forEach(x=>{
                if (things[x]) {
                    if (things[x].out0 == "_") pinClicked = false;
                    else {
                        things[things[x].out0].wireId[`in${things[x].outNum}`] = things[things[x].out0].wireId[`in${things[x].outNum}`].filter(y=>y!=x);
                        things[things[x].out0][`in${things[x].outNum}`] = false;
                    }
                    if (things[x].in0 == "_") pinClicked = false;
                    else {
                        things[things[x].in0].wireId[`out${things[x].inNum}`] = things[things[x].in0].wireId[`out${things[x].inNum}`].filter(y=>y!=x);
                        things[things[x].in0][`out${things[x].inNum}`] = false;
                    }
                    delete things[x];
                }
            }));
            delete things[deleteThing];
            sort();
            deleteThing = null;
        }
        tcRvel += (-50 - tcRadius) / 10;
        tcRvel *= 0.6;
    } else if (((-canvas.width/2/ratio - mouseState.x) ** 2 + (-canvas.height/2/ratio - mouseState.y) ** 2) ** 0.5 < tcRadius) {
        tcRvel += (500 - tcRadius) / 10;
        tcRvel *= 0.75;
        deleteThing = clicked;
    } else {
        deleteThing = false
        tcRvel += (200 - tcRadius) / 10;
        tcRvel *= 0.8;
    }
    tcRadius += tcRvel;
    ctx.fillStyle = color.menu;
    ctx.strokeStyle = color.menuItem;
    ctx.lineWidth = 20 * (tcRadius / 500);
    ctx.beginPath();
    ctx.moveTo(-canvas.width/2/ratio, -canvas.height/2/ratio);
    ctx.arc(-canvas.width/2/ratio, -canvas.height/2/ratio, Math.max(tcRadius,0), 0, Math.PI / 2);
    ctx.fill();
    let center = [-canvas.width/2/ratio + tcRadius * 0.3, -canvas.height/2/ratio + tcRadius * 0.3, 0.1]
    ctx.beginPath();
    ctx.moveTo(center[0]-tcRadius*center[2],center[1]-tcRadius*center[2]);
    ctx.lineTo(center[0]+tcRadius*center[2],center[1]+tcRadius*center[2]);
    ctx.moveTo(center[0]+tcRadius*center[2],center[1]-tcRadius*center[2]);
    ctx.lineTo(center[0]-tcRadius*center[2],center[1]+tcRadius*center[2]);
    ctx.stroke();
}

// main

let qual = (/qual=(.*?)(&|$)/i.exec(location.search) || [])[1] || "high";
ctx.lineCap = qual == "low" ? "butt" : "round";

let themeName = (/theme=(.*?)(&|$)/i.exec(location.search) || [])[1] || "light";
color = theme[themeName] || theme[themeName = "light"];
document.body.style.backgroundColor = color.bg;

if (/import=(.*?)(&|$)/i.exec(location.search)) importCode(/import=(.*?)(&|$)/i.exec(location.search)[1]);
else {
    importCode("0;0;10;7,1500,500;7,1500,-500;0,500,500;1,500,0;2,500,-500;1,-500,0;2,-500,-500;9,-1500,500;8,-1500,0;9,-1500,-500;10,0,7,0;9,0,7,1;10,0,6,0;9,0,6,1;7,0,4,0;8,0,4,1;7,0,5,0;8,0,5,1;4,0,3,0;6,0,3,1;5,0,2,0;3,0,1,0");
    //importCode("0;0;14;3,-1000,-1000;7,-1000,-600;7,-1000,-200;7,-1000,200;7,-1000,600;7,-1000,1000;7,-600,1000;7,-200,1000;7,200,1000;7,600,1000;7,1000,1000;7,1000,600;7,1000,200;7,1000,-200;7,1000,-600;7,1000,-1000;7,600,-1000;7,200,-1000;7,-200,-1000;7,-600,-1000;1,0,2,0;2,0,3,0;3,0,4,0;4,0,5,0;5,0,6,0;6,0,7,0;7,0,8,0;8,0,9,0;9,0,10,0;10,0,11,0;11,0,12,0;12,0,13,0;13,0,14,0;14,0,15,0;15,0,16,0;16,0,17,0;17,0,18,0;18,0,19,0;19,0,20,0;20,0,1,0")
}

function main() {
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    cameraSet();
    drawTrashcan();
    drawStage();
    drawMenu();
    requestAnimationFrame(main);
}

main();