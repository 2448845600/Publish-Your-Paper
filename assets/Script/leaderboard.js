/**
 * wx api: https://developers.weixin.qq.com/minigame/dev/document/open-api/user-info/wx.createUserInfoButton.html
 */
cc.Class({
    extends: cc.Component,

    properties: {
        wxSubContextView: cc.Node,
    
        avatar: cc.Sprite,
        nickName: cc.Label,

        background: cc.Node
    },

    start () {
        this.initAction();
        this.initUserInfoButton();
        // this.initUserInfoLabel();
    },

    // initUserInfoLabel () {
    //     if (typeof wx === 'undefined') {
    //         return;
    //     }

    //     let systemInfo = wx.getSystemInfoSync();

    //     wx.getUserInfo({
    //         openIdList: ['selfOpenId', 'ownAP0b9qt6AzvYOSWOX8VX8KMq0', 'ownAP0QJHIN2w3X60EUsj2Vah5Ig', 'ownAP0f8ANWUCcloXN1oZPfxtz0g'],
    //         lang: 'zh_CN',
    //         success: (res) => {
    //           console.log('success', res.data)
    //         },
    //         fail: (res) => {
    //           reject(res)
    //         }
    //       })

    //       wx.getOpenDataContext().postMessage({
    //         message: "User info get success."
    //     });
    // },

    initAction () {
        this._isShow = false;
        this.wxSubContextView.y = -600;
        this._showAction = cc.moveTo(0.5, this.wxSubContextView.x, -540);
        this._hideAction = cc.moveTo(0.5, this.wxSubContextView.x, 1600);

        this.background.on('touchstart', this.onClick, this);
        // this.wxSubContextView.runAction(this._showAction)
    },

    initUserInfoButton () {
        if (typeof wx === 'undefined') {
            return;
        }

        let systemInfo = wx.getSystemInfoSync();
        let width = systemInfo.windowWidth;
        let height = systemInfo.windowHeight;
        let button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: 0,
                top: 0,
                width: width,
                height: height,
                lineHeight: 40,
                backgroundColor: '#00000000',
                color: '#00000000',
                textAlign: 'center',
                fontSize: 10,
                borderRadius: 4
            }
        });

        button.onTap((res) => {

            console.info("in onTap")

            let userInfo = res.userInfo;

            console.info("userInfo.nickName", userInfo.nickName)

            if (!userInfo) {
                this.tips.string = res.errMsg;
                return;
            }

            this.nickName.string = userInfo.nickName;

            cc.loader.load({url: userInfo.avatarUrl, type: 'png'}, (err, texture) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this.avatar.spriteFrame = new cc.SpriteFrame(texture);
            });

            wx.getOpenDataContext().postMessage({
                message: "User info get success."
            });

            this.wxSubContextView.runAction(this._showAction);
            this._isShow = true;

            button.hide();
            button.destroy();

        });
    },

    onClick () {
        this._isShow = !this._isShow;
        if (this._isShow) {
            this.wxSubContextView.runAction(this._showAction);
        }
        else {
            this.wxSubContextView.runAction(this._hideAction);
        }
    },

});
