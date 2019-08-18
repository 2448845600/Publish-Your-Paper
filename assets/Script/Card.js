cc.Class({
    extends: cc.Component,

    properties: {
        blockWidth: 120,
        blockHeight: 120,
        fallSpeed: 4,

        letter: 'A',

        code: {
            default: null,
            type: cc.Label
        },

    },

    spawnRandLetter: function () {
        var letterList = [
            "标题", "作者", "摘要", "正文", "引用", "附录",
            "标题", "摘要", "正文", "引用"
        ];

        return letterList[Math.floor(Math.random() * letterList.length)];
    },

    onLoad() {
        this.letter = this.spawnRandLetter();
        this.code.string = this.letter;

        /***
         * 通过颜色增加区分度
         * 
         * 方案一: 一个色系，颜色逐渐加深
         * 
         * 方案二: 多个差异大的颜色: 红(橙)黄蓝绿(湖蓝)
         * 
         */

        switch (this.code.string) {
            case "标题": this.node.color =  cc.color(180, 240, 200, 255); break;
            case "作者": this.node.color =  cc.color(135, 206, 250, 255); break;
            case "摘要": this.node.color =  cc.color(120, 210, 150, 255); break;
            case "正文": this.node.color =  cc.color(75, 175, 107, 255); break;
            case "引用": this.node.color =  cc.color(25, 135, 65, 255); break;
            case "附录": this.node.color =  cc.color(30, 144, 255, 255); break;
        }

    },

    detectTrayLabel: function () {
        // 稍稍陷入tray里面一点
        if (this.node.y > this.game.destroyY - 2) {
            return;
        }

        var blockCenterX = this.node.getPosition().x;
        var trayCenterX = this.game.tray.getPosition().x;
        var trayWidth = this.game.tray.width
        var labelWidth = trayWidth / 6; // 6 是一个tray包含的label的数量

        var delta_x = blockCenterX - trayCenterX;
        var labelId = -1;

        /** Todo
         * 得到该block属于tray中哪个label
         * 实际逻辑应该稍微复杂一点
         * 比如说增加炸弹，大方块（一次修改两个相邻格子）等等
         */
        if (delta_x <= trayWidth / 2 && delta_x > -trayWidth / 2) {
            labelId = Math.floor(3 + delta_x / labelWidth);
        }

        return labelId;
    },

    setBigLabel: function (id) {
        cc.find('Canvas/tray/label' + id).getComponent(cc.Label).FrontSize = 64;
        cc.find('Canvas/tray/label' + id).color = new cc.color(124, 3, 3, 255);
    },

    setNormalLabel: function (id) {
        cc.find('Canvas/tray/label' + id).getComponent(cc.Label).FrontSize = 48;
        cc.find('Canvas/tray/label' + id).color = new cc.color(255, 255, 255, 255);
    },

    changeTrayLabel: function (labelId) {
        var matchedCard = cc.find('Canvas/tray/label' + labelId).getComponent(cc.Label);

        if (this.letter != matchedCard.string) {
            matchedCard.string = this.letter;
            this.setNormalLabel(labelId);

            var cards = [];
            for (var i = 0; i < 6; i++) {
                cards.push(cc.find('Canvas/tray/label' + i).getComponent(cc.Label).string);
            }

            for (var i = 1; i < 5; i++) {
                if (cards[i - 1] === cards[i] && cards[i] === cards[i + 1] && cards[i] != "-") {
                    this.game.cardsSize[i - 1] = 1;
                    this.game.cardsSize[i] = 3;
                    this.game.cardsSize[i + 1] = 1;

                    this.setBigLabel(i);
                    this.setNormalLabel(i - 1);
                    this.setNormalLabel(i + 1);
                    cc.find('Canvas/tray/label' + (i - 1)).getComponent(cc.Label).string = "-";
                    cc.find('Canvas/tray/label' + (i + 1)).getComponent(cc.Label).string = "-";
                }
            }

        } else if (this.letter === matchedCard.string) {
            // 左边检测
            if (labelId > 0) {
                var leftCard = cc.find('Canvas/tray/label' + (labelId - 1)).getComponent(cc.Label)
                if (leftCard.string === this.letter) {
                    leftCard.string = "-";
                    this.game.cardsSize[(labelId - 1)] = 1;
                    this.game.cardsSize[labelId] = 3;

                    this.setBigLabel(labelId);
                    this.setNormalLabel(labelId - 1);
                }
            }
            // 右边检测
            if (labelId < 5) {
                var rightCard = cc.find('Canvas/tray/label' + (labelId + 1)).getComponent(cc.Label)
                if (rightCard.string === this.letter) {
                    rightCard.string = "-";
                    this.game.cardsSize[(labelId + 1)] = 1;
                    this.game.cardsSize[labelId] = 3;
                    this.setBigLabel(labelId);
                    this.setNormalLabel(labelId + 1);
                }
            }
        }

    },

    LCS: function (str1, str2) {
        var arr = [];

        for (var i = 0; i < str1.length + 1; i++) {
            arr[i] = [];
            for (var j = 0; j < str2.length + 1; j++) {
                arr[i][j] = 0;
            }
        }

        for (var i = 1; i < str1.length + 1; i++) {
            for (var j = 1; j < str2.length + 1; j++) {
                if (str1[i - 1] == str2[j - 1]) {
                    arr[i][j] = arr[i - 1][j - 1] + 1;
                } else if (arr[i - 1][j] >= arr[i][j - 1]) {
                    arr[i][j] = arr[i - 1][j];
                } else {
                    arr[i][j] = arr[i][j - 1];
                }
            }
        }

        return arr[str1.length][str2.length];
    },

    /**
     * result = {
            "isHuCard": true,
            "isPlus": matchCardsNum == 5,
            "isPlusPlus": matchCardsNum == 6,
            "TripletNum": TripletNum,
            "times":times,
            "score":times * baseScore
        }
     */
    searchTrack: function () {
        var cards = [];
        var cardsSize = this.game.cardsSize;
        for (var i = 0; i < 6; i++) {
            cards.push(cc.find('Canvas/tray/label' + i).getComponent(cc.Label).string);
        }

        var win = false;
        var baseScore = 0;
        var times = 1;
        var winSeq = ["-", "标题", "作者", "摘要", "正文", "引用", "附录"]
        var baseHuCardSeq = "1345";
        var plusHuCardSeq = ["12345", "13456"];
        var plusplusHuCardSeq = "123456";
        var TripletNum = 0;

        /**
         * 0. 胡牌(win)
         * 1. 基本分(baseScore)
         * 2. 倍数(times)
         */
        var cardsSeq = "";
        for (var i = 0; i < cards.length; i++) {
            for (var j = 0; j < winSeq.length; j++) {
                if (cards[i] === winSeq[j]) {
                    cardsSeq += j;
                    continue;
                }
            }
        }

        console.info("baseHuCardSeq=", baseHuCardSeq, ", cardsSeq=", cardsSeq);

        if (baseHuCardSeq.length != this.LCS(baseHuCardSeq, cardsSeq)) {
            return { "isHuCard": false };
        }

        baseScore = 2;
        var matchCardsNum = this.LCS(plusplusHuCardSeq, cardsSeq);
        baseScore += (matchCardsNum > 5) ? 3 : 1;

        for (var i = 0; i < cardsSize.length; i++) {
            if (cardsSize[i] == 3) {
                TripletNum += 1;
            }
        }
        times += TripletNum;

        var result = {
            "isHuCard": true,
            "isPlus": matchCardsNum == 5,
            "isPlusPlus": matchCardsNum == 6,
            "TripletNum": TripletNum,
            "times": times,
            "score": times * baseScore
        }

        return result;

    },

    update(dt) {

        // 判断Block是否与Tray接触，并且修改Tray中的Label
        var labelId = this.detectTrayLabel();
        if (labelId >= 0 && labelId <= 5) {
            this.changeTrayLabel(labelId);
            var result = this.searchTrack();

            if (result["isHuCard"]) {
                this.game.publish = true;
                this.game.currtCardsScore = result["score"];

                cc.find('Canvas/publishDisplay').color = new cc.color(146, 180, 130, 255);
                cc.find('Canvas/publishDisplay').opacity = 255;

            } else {
                this.game.publish = false;

                cc.find('Canvas/publishDisplay').color = new cc.color(211, 211, 211, 255);
                cc.find('Canvas/publishDisplay').opacity = 120;
            }
        }

        /** Todo
         * 可以考虑增加左右碰撞，左边撞一下，label依次右移
         */
        var pre_pos = this.node.getPosition();
        if (pre_pos.y < this.game.destroyY) {
            this.game.existBlockNum = this.game.existBlockNum - 1;
            this.node.destroy();
        }

        this.node.setPosition(pre_pos.x, pre_pos.y - this.fallSpeed);

    },
});
