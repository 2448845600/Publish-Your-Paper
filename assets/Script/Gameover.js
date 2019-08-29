cc.Class({
    extends: cc.Component,

    properties: {
        scoreDisplay: {
            default: null,
            type: cc.Label
        },

        restartButton: {
            default: null,
            type: cc.Button
        },
    },

    onTouchStart: function(){
        cc.director.loadScene('game');
    },

    start() {
        this.scoreDisplay.string = "Your Finally Score is " + Global.finalScore;

        var interval = 1;// 以秒为单位的时间间隔
        var repeat = 1;// 重复次数
        var delay = 3;// 开始延时

        // cc.delayTime(3);
        // this.schedule(function () {
        // cc.director.loadScene('leaderboard');
        // }, interval, repeat, delay);

        this.restartButton.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        
    },

});
