//canvas starter kit
let mouseState = {wheel:1, x:0, y:0}, keydown = {}, time, fps, timeStamp = [], started = new Date().getTime();
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
canvas.addEventListener("mousedown", (event)=>{mouseState[["left","wheel","right"][event.button]] = true;});
canvas.addEventListener("mouseup", (event)=>{mouseState[["left","wheel","right"][event.button]] = false;});
canvas.addEventListener("wheel", (event)=>{mouseState["wheel"] += event.deltaY > 0 ? 1 : -1});
document.addEventListener("keydown", (event)=>{keydown[event.key] = true;});
document.addEventListener("keyup", (event)=>{keydown[event.key] = false;});
document.addEventListener("mousemove", (event)=>{mouseState.x = (event.clientX - canvas.width / 2) / ratio; mouseState.y = (event.clientY - canvas.height / 2) / ratio; mouseState.cliX = event.clientX; mouseState.cliY = event.clientY;});
let updatePos =()=> {mouseState.x = (event.changedTouches[0].pageX - canvas.width / 2) / ratio; mouseState.y = (event.changedTouches[0].pageY - canvas.height / 2) / ratio; mouseState.cliX = event.changedTouches[0].pageX; mouseState.cliY = event.changedTouches[0].pageY};
document.addEventListener("touchstart", ()=>{mouseState["left"] = true; updatePos();});
document.addEventListener("touchmove", (event)=>{event.preventDefault(); updatePos();}, {passive: false});
document.addEventListener("touchend", ()=>{mouseState["left"] = false; updatePos();});
window.addEventListener("resize", ()=>{resize()});
canvas.oncontextmenu =()=> {return false;};
resize();
//end kit

let things = {}, clicked = false, offSet = [[0,0],[0,0]], stageMove = false, cameraX = 0, cameraY = 0, zoom = 0.75, cameraZoom = zoom ** mouseState.wheel, mouseXinStage, mouseYinStage, zindex = 0, thingId = 0, drawList = [], idList = [], lastWheel = mouseState.wheel, menuY = -700;

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
        drawList.unshift({type:"gate", path:path, style:this.bool?color.gTrue:color.gFalse});
        dragger(path, id, this);
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
        drawList.unshift({type:"gate", path:path, style:this.bool?color.gTrue:color.gFalse});
        dragger(path, id, this);
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
        drawList.unshift({type:"gate", path:path, style:this.bool?color.gTrue:color.gFalse});
        dragger(path, id, this);
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
        drawList.unshift({type:"gate", path:path, style:this.bool?color.gTrue:color.gFalse});
        dragger(path, id, this);
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
        drawList.unshift({type:"gate", path:path, style:this.bool?color.gTrue:color.gFalse});
        dragger(path, id, this);
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
        drawList.unshift({type:"gate", path:path, style:this.bool?color.gTrue:color.gFalse});
        dragger(path, id, this);
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
        drawList.unshift({type:"gate", path:path, style:this.bool?color.gTrue:color.gFalse});
        dragger(path, id, this);
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
        drawList.unshift({type:"gate", path:path, style:this.bool?color.gTrue:color.gFalse});
        dragger(path, id, this);
    }
};

let INPUT = class {
    constructor(x, y, def = false) {
        this.x = x;
        this.y = y;
        this.z = ++zindex;
        this.bool = def;
        this.out0 = def;
        this.def = def;
        this.pinPos = [[[0,0]],[[175,0]]];
        this.lastClicked = 0;
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
        drawList.unshift({type:"gate", path:path, style:gateColor});
        dragger(path, id, this);
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
    getPath() {
        this.bool = things[this.in0][`out${this.inNum}`];
        things[this.out0][`in${this.outNum}`] = this.bool;

        let p = [things[this.in0].x + things[this.in0].pinPos[1][this.inNum][0], things[this.in0].y + things[this.in0].pinPos[1][this.inNum][1], things[this.out0].x + things[this.out0].pinPos[0][this.outNum][0], things[this.out0].y + things[this.out0].pinPos[0][this.outNum][1]];
        let path = new Path2D();
        path.moveTo(p[0], p[1]);
        if (p[0] < p[2]) path.bezierCurveTo(p[0] + (p[2] - p[0]) * 0.5, p[1], p[0] + (p[2] - p[0]) * 0.5, p[3], p[2], p[3]);
        else path.bezierCurveTo(p[0], p[1] + (p[3] - p[1]) * 0.5, p[2], p[1] + (p[3] - p[1]) * 0.5, p[2], p[3]);

        drawList.unshift({type:"wire", path:path, style:this.bool?color.wTrue:color.wFalse});
    }
};

//end defining GATEs

let dragger =(path, id, obj)=> {
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

let exportCode =()=> {
    sort();
    let code = [];
    idList.forEach(x=>{
        if (things[x].constructor.name == "WIRE") code.push([idList.indexOf(things[x].in0.toString())+1, things[x].inNum, idList.indexOf(things[x].out0.toString())+1, things[x].outNum])
        else code.push([["OR","AND","XOR","NOT","NOR","NAND","XNOR","OUTPUT","INPUT","-"].indexOf(things[x].constructor.name)+(things[x].constructor.name=="INPUT" && things[x].def ? 1 : 0), Math.floor(things[x].x), Math.floor(things[x].y)])
    });
    return code.map(x=>x.join(",")).join(";");
}

let importCode =(code)=> {
    let importArr = code.split(";").map(x=>x.split(","))
    zindex = 0;
    things = {};
    importArr.forEach((x,y)=>{
        if (x.length == 4) things[y+1] = new WIRE(...x);
        else things[y+1] = new [OR,AND,XOR,NOT,NOR,NAND,XNOR,OUTPUT,INPUT,INPUT][x[0]](x[1]*1,x[2]*1,x[0]==9?true:null);
    });
    sort();
}

let sort =()=> idList = Object.keys(things).sort((a,b)=>{return things[a].z < things[b].z ? 1 : (things[a].z > things[b].z ? -1 : 0)});

let make =(thing, id = ++thingId)=> {things[id] = thing; sort();}

let drawStage =()=> {
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
                ctx.strokeStyle = color.contour;
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

}

//importCode("7,1500,500;7,1500,-500;0,500,500;1,500,0;2,500,-500;1,-500,0;2,-500,-500;9,-1500,500;8,-1500,0;9,-1500,-500;10,0,7,0;9,0,7,1;10,0,6,0;9,0,6,1;7,0,4,0;8,0,4,1;7,0,5,0;8,0,5,1;4,0,3,0;6,0,3,1;5,0,2,0;3,0,1,0");
importCode("3,-1000,-1000;7,-1000,-600;7,-1000,-200;7,-1000,200;7,-1000,600;7,-1000,1000;7,-600,1000;7,-200,1000;7,200,1000;7,600,1000;7,1000,1000;7,1000,600;7,1000,200;7,1000,-200;7,1000,-600;7,1000,-1000;7,600,-1000;7,200,-1000;7,-200,-1000;7,-600,-1000;1,0,2,0;2,0,3,0;3,0,4,0;4,0,5,0;5,0,6,0;6,0,7,0;7,0,8,0;8,0,9,0;9,0,10,0;10,0,11,0;11,0,12,0;12,0,13,0;13,0,14,0;14,0,15,0;15,0,16,0;16,0,17,0;17,0,18,0;18,0,19,0;19,0,20,0;20,0,1,0")

function main() {
    ctx.clearRect(canvas.width / -2 / ratio, canvas.height / -2 / ratio, canvas.width / ratio , canvas.height / ratio);
    cameraSet();
    drawStage();
    drawMenu();
    requestAnimationFrame(main);
}

main();