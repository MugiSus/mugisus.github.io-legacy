let luxury = true;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

mouse = {
    wheel: 0,
    x: 0,
    y: 0,
    left: false,
    middle: false,
    right: false,
}

document.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});
document.addEventListener("wheel", (event) => {
    mouse.wheel += event.deltaY > 0 ? 1 : -1;
});
canvas.addEventListener("mousedown", (event) => {
    mouse[["left","middle","right"][event.button]] = true;
});
canvas.addEventListener("mouseup", (event) => {
    mouse[["left","middle","right"][event.button]] = false;
});

let Resize =()=> {
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;
}
window.addEventListener("resize", Resize);
Resize();

class EntityInfo {
    constructor(path, inputPins, outputPins, evaluater, filler) {
        this.path = new Path2D(path);
        this.inputPins = inputPins;
        this.outputPins = outputPins;
        this.evaluate = evaluater;
        this.fill = filler || function() {};
    }
}

class Entity {
    constructor(entityName, entityInfo, x, y, bool) {
        this.name = entityName;
        this.info = entityInfo;
        this.x = x;
        this.y = y;
        this.input = 0;
        this.output = bool || 0;
        this.draftInput = 0;
    }
}

class Wire {
    constructor(entityOut, entityIn, outputPinNumber, inputPinNumber) {
        this.entityOut = entityOut;
        this.entityIn = entityIn;
        this.outputPinNumber = outputPinNumber;
        this.inputPinNumber = inputPinNumber;
        this.bool = 0;
    }
}

let clickedInThisFrame = false;
let entityID = 0, entitiesArray = [], wiresArray = [];

let InitalizeField =()=> {
    entityID = 0;
    entitiesArray = [];
    wiresArray = []
}
let CreateEntity =(entityName, x, y, bool)=> entitiesArray[entityID++] = new Entity(entityName, ENTITY_INFOES[entityName], x, y, bool);
let CreateWire =(entityOut, entityIn, outputPinNumber, inputPinNumber)=> wiresArray.push(new Wire(entityOut, entityIn, outputPinNumber, inputPinNumber))

let Export =(entities, wires)=> {
    let result = 
        entities.map(entity => `${entity.name},${entity.x.toString(36)},${entity.y.toString(36)},${(entity.output * 1).toString(36)}`).join(";") + 
        ";;" + 
        wires.map(wire => `${wire.entityOut.toString(36)},${wire.entityIn.toString(36)},${wire.outputPinNumber.toString(36)},${wire.inputPinNumber.toString(36)}`).join(";");
    return result;
}

let Import =(string)=> {
    InitalizeField();
    string.split(";;")[0].split(";").forEach(entity => {
        let entityArray = entity.split(",");
        CreateEntity(
            entityArray[0],
            parseInt(entityArray[1], 36),
            parseInt(entityArray[2], 36),
            parseInt(entityArray[3], 36)
        );
    })
    string.split(";;")[1].split(";").forEach(wire => {
        let wireArray = wire.split(",");
        CreateWire(
            parseInt(wireArray[0], 36),
            parseInt(wireArray[1], 36),
            parseInt(wireArray[2], 36),
            parseInt(wireArray[3], 36)
        );
    })
    return 0;
}

function EvaluateWires() {
    wiresArray.forEach(item => {
        if (entitiesArray[item.entityOut].output & (1 << item.outputPinNumber)) {
            item.bool = true;
            entitiesArray[item.entityIn].draftInput |= (1 << item.inputPinNumber);
        } else
            item.bool = false;
    })
}

function EvaluateEntities() {
    entitiesArray.forEach(item => {
        item.input = item.draftInput;
        item.draftInput = 0;
        item.output = item.info.evaluate(item.input, item);
    })
}

function DrawEntities() {

    let path = new Path2D();

    entitiesArray.forEach(item => {
        path.addPath(item.info.path, new DOMMatrix([
            1, 0,
            0, 1,
            item.x, item.y,
        ]));
    });

    ctx.lineCap = "butt";
    ctx.lineJoin = "bevel";

    ctx.strokeStyle = "#808080";
    ctx.lineWidth = 5;
    ctx.stroke(path);

    ctx.strokeStyle = "#d8d8d8";
    ctx.lineWidth = 1.5;
    ctx.stroke(path);

    if (luxury) {
        ctx.globalCompositeOperation = "lighter"
        ctx.filter = "blur(15px)";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 5;
        ctx.stroke(path);
        ctx.globalCompositeOperation = "source-over"
        ctx.filter = "none";
    }
}

function DrawWires() {

    let pathLow = new Path2D();
    let pathHigh = new Path2D();

    let fillLow = new Path2D();
    let fillHigh = new Path2D();
    let fillHighest = new Path2D();

    wiresArray.forEach(item => {
        let linePositions = [
            entitiesArray[item.entityOut].info.outputPins[item.outputPinNumber][2] + entitiesArray[item.entityOut].x,
            entitiesArray[item.entityOut].info.outputPins[item.outputPinNumber][3] + entitiesArray[item.entityOut].y,
            entitiesArray[item.entityIn].info.inputPins[item.inputPinNumber][2] + entitiesArray[item.entityIn].x,
            entitiesArray[item.entityIn].info.inputPins[item.inputPinNumber][3] + entitiesArray[item.entityIn].y,
        ];

        let path = item.bool ? pathHigh : pathLow;
        
        if (linePositions[0] < linePositions[2]) {
            path.moveTo(linePositions[0], linePositions[1]);
            path.bezierCurveTo(
                (linePositions[0] + linePositions[2]) / 2, 
                linePositions[1],
                (linePositions[0] + linePositions[2]) / 2,
                linePositions[3],
                linePositions[2],
                linePositions[3]
            );
        } else {
            path.moveTo(linePositions[0] - 0.0001, linePositions[1]);
            path.lineTo(linePositions[0], linePositions[1]);
            path.bezierCurveTo(
                linePositions[0],
                (linePositions[1] + linePositions[3]) / 2, 
                linePositions[2],
                (linePositions[1] + linePositions[3]) / 2,
                linePositions[2],
                linePositions[3]
            );
            path.lineTo(linePositions[2] + 0.0001, linePositions[3]);
        }
    });

    entitiesArray.forEach(item => {
        item.info.inputPins.forEach((linePositions, index) => {
            let path = item.input & (1 << index) ? pathHigh : pathLow;

            path.moveTo(linePositions[0] + item.x, linePositions[1] + item.y);
            path.lineTo(linePositions[2] + item.x, linePositions[3] + item.y);
        });

        item.info.outputPins.forEach((linePositions, index) => {
            let path = item.output & (1 << index) ? pathHigh : pathLow;

            path.moveTo(linePositions[0] + item.x, linePositions[1] + item.y);
            path.lineTo(linePositions[2] + item.x, linePositions[3] + item.y);
        });
        
        item.info.fill(item, fillLow, fillHigh, fillHighest);
    });

    ctx.lineJoin = "round";

    ctx.strokeStyle = "#404040";
    ctx.fillStyle = "#282828";
    ctx.lineWidth = 5;
    ctx.stroke(pathLow);
    ctx.fill(fillLow);

    ctx.strokeStyle = "#9b1616";
    ctx.fillStyle = "#9b1616";
    ctx.lineWidth = 8;
    ctx.stroke(pathHigh);
    ctx.fill(fillHigh);

    ctx.strokeStyle = "#f86e6e";
    ctx.fillStyle = "#f85050";
    ctx.lineWidth = 3;
    ctx.stroke(pathHigh);
    ctx.fill(fillHighest);

    if (luxury) {
        ctx.globalCompositeOperation = "lighter"
        ctx.lineCap = "square";
        ctx.filter = "blur(15px)";
        ctx.strokeStyle = "#f86e6e";
        ctx.lineWidth = 10;
        ctx.stroke(pathHigh);
        ctx.fill(fillHigh);
        ctx.globalCompositeOperation = "source-over"
        ctx.filter = "none";
    }
}

function ControlCamera() {
    
}

function Main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 50; i++) {
        EvaluateWires();
        EvaluateEntities();
    }

    ControlCamera();

    DrawWires();
    DrawEntities();

    requestAnimationFrame(Main);
}

window.addEventListener("load", Main);