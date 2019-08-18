cc.Class({
    extends: cc.Component,

    properties: {
        scoreDisplay: {
            default: null,
            type: cc.Label
       },
    },

    start () {
        this.scoreDisplay.string = "Your Finally Score is " + Global.finalScore;
    },

});
