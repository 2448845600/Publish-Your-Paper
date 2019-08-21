cc.Class({
    extends: cc.Component,

    properties: {

        cardPrefab: {
            default: null,
            type: cc.Prefab
        },

        maxTrackNum: 9,
        destroyY: 0,
        blockWidth: 120,
        blockHeight: 120,
        cardsSize: [],

        tray: {
            default: null,
            type: cc.Node
        },

        scoreDisplay: {
            default: null,
            type: cc.Label
        },

        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },

        publishDisplay: {
            default: null,
            type: cc.Label
        },

        timerDisplay: {
            default: null,
            type: cc.Label
        },

    },

    spawnNewCard: function () {
        var newCard = cc.instantiate(this.cardPrefab);

        if (this.score <=5 ) {
            newCard.getComponent('Card').fallSpeed = 2;
        }
        if (this.score > 5) {
            newCard.getComponent('Card').fallSpeed = 4;
        } else if (this.score > 5 && this.score < 12) {
            newCard.getComponent('Card').fallSpeed = 6;
        } else if (this.score > 12 && this.score >24) {
            newCard.getComponent('Card').fallSpeed = 8;
        } else if (this.score > 24) {
            newCard.getComponent('Card').fallSpeed = 12;
        }

        this.node.addChild(newCard);

        newCard.setPosition(this.getNewBlockPosition());
        newCard.getComponent('Card').game = this;
    },

    getNewBlockPosition: function () {
        // 竖屏，屏幕分为 maxTrackNum+1 个赛道(track)，生成随机的 trackId
        // 生成 [0, maxTrackNum]间的随机整数，round函数使得 0和 maxTrackNum的几率少一半。
        var delta_w = this.node.width / (this.maxTrackNum + 1);
        var trackId = Math.round(Math.random() * this.maxTrackNum);

        var randX = -this.node.width / 2 + delta_w * trackId + this.blockWidth / 2 + (delta_w - this.blockWidth) / 2;
        var randY = this.node.height / 2 - this.blockHeight / 2;

        return cc.v2(randX, randY);
    },


    onTouchStart: function (event) {
        this.startY = event.getLocation().y;
    },

    onTouchMove: function (event) {
        var nowLocationY = event.getLocation().y;
        var delta_y = nowLocationY - this.startY;

        // 效果明天设想的好
        // 希望实现满足投稿要求后，投稿由灰变绿，然后上滑变得越来越亮
        // if (this.publish) {
        //     cc.find('Canvas/publishDisplay').opacity = 55 + delta_y;;
        // }

        if (this.publish && delta_y > 200) {
            this.gainScore();
            this.resetLabels();
        }
    },

    /** 
     * onLoad()
     * 
     * 1. 按照定时器，定时生成大量 block
     * 2. 调整检测线(destroyY)的位置
     */
    onLoad() {

        console.info("in OnLoad function()")

        this.timer = 0;
        this.score = 0;
        this.cards = [];
        this.matchedConferenceList = [];
        this.publish = false;
        this.currtCardsScore = 0;
        this.remainingSeconds = 60;

        this.cardsSize = [1, 1, 1, 1, 1, 1];

        // 资源加载后，按照定时器，定时生成大量block
        var interval = 1;// 以秒为单位的时间间隔
        var repeat = 20;// 重复次数
        var delay = 2;// 开始延时

        this.schedule(function () {
            this.spawnNewCard();// 这里的 this 指向 component
        }, interval, repeat, delay);

        this.schedule(function () {
            this.spawnNewCard();// 这里的 this 指向 component
        }, 2, 1000, 22);

        console.info("in OnLoad function, before change timerDisplay")

        this.schedule(function () {
            this.remainingSeconds -= 1;
            cc.find('Canvas/timerDisplay').getComponent(cc.Label).string = this.remainingSeconds;
        }, interval, 60, 3);

        // 调整检测线的位置
        this.destroyY = this.tray.y + this.blockHeight / 2;

        // 监听向上滑动
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);

    },

    getLabelsStr: function () {
        var newStr = [];
        for (var i = 0; i < 6; i++) {
            newStr.push(cc.find('Canvas/tray/label' + i).getComponent(cc.Label).string);
        }
        return newStr;
    },

    resetLabels: function () {
        for (var i = 0; i < 6; i++) {
            cc.find('Canvas/tray/label' + i).getComponent(cc.Label).string = '-';
            cc.find('Canvas/tray/label' + i).color = new cc.color(255, 255, 255, 255);
        }

        cc.find('Canvas/publishDisplay').color = new cc.color(211, 211, 211, 255);
        cc.find('Canvas/publishDisplay').opacity = 120;
        this.cards = [];
    },

    gainScore: function () {
        cc.audioEngine.playEffect(this.scoreAudio, false);
        this.score += this.currtCardsScore;
        this.currtCardsScore = 0;
        this.scoreDisplay.string = "score: " + this.score;
    },

    update(dt) {
        if (this.remainingSeconds == 0) {
            this.gameOver();
            return;
        }

        var newStr = this.getLabelsStr();
        if (newStr === this.cards) {
            return;
        }

        this.cards = newStr;
    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    },

    gameOver: function () {
        this.unscheduleAllCallbacks();

        Global.finalScore = this.score;

        console.info("in gameOver function")

        cc.director.loadScene('gameover');
    },

});
