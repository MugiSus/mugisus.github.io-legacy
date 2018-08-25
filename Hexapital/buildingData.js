//images : 使用する画像数
//pattern : 建造物の画像パターン
//height : 建造物の高さ(0なら床パネル)
//connectable : 道路が接続可能か
//needsLifeLine : ライフラインが必要か
//supplyable : ライフラインを供給できるか (1 : 自身への供給により供給可能, 2 : 単体で供給可能, 定義無し : 不可能)
//LLlimit : ライフラインを伸ばせる長さ
//icon : パレットで表示する画像名（定義が無けば画像"部品名"を表示）
//buildArea : 建造物の全部品の相対座標（定義なしなら[[0,0]]で記録）

const buildingArr = {
    "n":{
        height:0,
        connectable:false
    },
    "energy":{
        height:0,
        connectable:true,
        needsLifeLine:true,
        supplyable:1,
        LLlimit:10
    },
    "r":{
        length:0,
        connectable:true,
        icon:["2a"]
    },
    "b0":{
        images:2,
        pattern:[1,1],
        height:6,
        connectable:false,
        needsLifeLine:true,
        LLlimit:4,
        icon:["b00","b01"]
    },
    "b1":{
        images:3,
        pattern:[2,1,0,1,1,0,1,1,2],
        height:9,
        connectable:false,
        needsLifeLine:true,
        LLlimit:5,
        icon:["b10","b11","b12"]
    },
    "b2":{
        images:2,
        pattern:[9,1],
        height:10,
        connectable:false,
        needsLifeLine:true,
        LLlimit:6,
        icon:["b20","b20","b21"]
    },
    "air0":{
        images:1,
        pattern:[4],
        height:4,
        connectable:true,
        supplyable:2,
        icon:["air10","air10","air00"],
        buildArea:[[0,0],[-1,0],[-1,-1],[0,-1],[1,0],[0,1],[-1,1]]
    },
    "air1":{
        images:2,
        pattern:[3,1],
        height:4,
        connectable:true,
        supplyable:2
    }
};