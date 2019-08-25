// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        // var rule = " 基本概念
        // 牌
        
        // 大牌
        
        // 论文主要包括标题 摘要 正文 引用，按照得到这四个结构，就可以publish。
        
        // 在标题和摘要之间，可以加入作者，在引用后面，还可以加入附录。
        
        // publish后计算符数和番数，得分为符数*番数
        
        // 符数
        // 标题 摘要 正文 引用 1符
        // 标题 作者 摘要 正文 引用 2符
        // 标题 摘要 正文 引用 附录 2符
        // 标题 作者 摘要 正文 引用 附录 4符
        
        // 番数:
        // 满足标题 摘要 正文 引用计1番
        // 标题 摘要 正文 引用4牌相连，中间没有空格没有其它牌 计1番 “结构紧凑”
        // 三个相同的牌得到一张“大牌”，计1番，可累计
        // 标题 摘要 正文 正文 正文 引用 计2番 “三段论”
        // 三个正文全都是大牌，计6番 “文思泉涌” "

    },

    // start () {
    //     " cc.director.loadScene('gameover');"
    // },

    // update (dt) {},
});
