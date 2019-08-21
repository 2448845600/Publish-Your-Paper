cc.Class({
    extends: cc.Component,

    properties: {
        label0: {
            default: null,
            type: cc.Label
        },

        label1: {
            default: null,
            type: cc.Label
        },

        label2: {
            default: null,
            type: cc.Label
        },

        label3: {
            default: null,
            type: cc.Label
        },

        label4: {
            default: null,
            type: cc.Label
        },

        label5: {
            default: null,
            type: cc.Label
        },

        
    },

    onTouchMove(event) {
        var now_location = event.getLocation();
        var pre_location = event.getPreviousLocation();

        // 得到在x轴方向上的位移x，player移动y
        this.delta_x = now_location.x - pre_location.x;
    },

    onLoad() {
        this.delta_x = 0;
        
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    },

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
    },

    update(dt) {
        // this.node.x += this.delta_x;
        // this.delta_x = 0;
    },
});
