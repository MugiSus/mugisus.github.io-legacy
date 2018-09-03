const version = "v2.0.201809040502";

//images : 使用する画像数
//pattern : 建造物の画像パターン
//height : 建造物の高さ(0なら床パネル)
//connectable : 道路が接続可能か
//needsLifeLine : ライフラインが必要か
//supplyable : ライフラインを繋がれてから供給できるライフラインの数（定義なしなら一切供給不可）
//LLlimit : ライフラインを伸ばせる長さ
//icon : パレットで表示する画像名（定義が無けば画像"部品名"を表示）
//buildArea : 建造物の全部品の相対座標（定義なしなら[[0,0]]で記録）
//overWrite : 被上書き可能か
//cost : 建設費
//keep : 維持費
//income : 収入(*人口)
//popuation : 建設によって増加する人口(雇用とか？)

const buildingArr = {
    "n":{
        height:0,
        connectable:false,
        overWrite:true
    },
    "energy":{
        height:0,
        connectable:true,
        needsLifeLine:true,
        supplyable:6,
        LLlimit:10
    },
    "r":{
        length:0,
        connectable:true,
        icon:["2a"],
        overWrite:true,
        cost:1
    },
    "b0":{
        images:2,
        pattern:[1,1],
        height:6,
        connectable:false,
        needsLifeLine:true,
        LLlimit:4,
        icon:["b00","b01"],
        cost:50,
        keep:10,
        population:30
    },
    "b1":{
        images:3,
        pattern:[2,1,0,1,1,0,1,1,2],
        height:9,
        connectable:false,
        needsLifeLine:true,
        LLlimit:5,
        icon:["b10","b11","b12"],
        cost:80,
        keep:20,
        population:40
    },
    "b2":{
        images:2,
        pattern:[9,1],
        height:10,
        connectable:false,
        needsLifeLine:true,
        LLlimit:6,
        icon:["b20","b20","b21"],
        cost:120,
        keep:40,
        population:60
    },
    "air0":{
        images:1,
        pattern:[4],
        height:4,
        icon:["air10","air10","air00"],
        buildArea:[[0,0],[-1,0],[-1,-1],[0,-1],[1,0],[0,1],[-1,1]],
        cost:10000,
        keep:100,
        income:1
    },
    "air1":{
        images:2,
        pattern:[3,1],
        height:4,
        connectable:true,
        supplyable:3
    }
};