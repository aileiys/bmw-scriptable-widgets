// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: pink; icon-glyph: car-crash;
let WIDGET_VERSION = '20230427';
let MYBMW_VERSION = '3.3.1';
//新增短信登陆

let WIDGET_FONT = 'SF UI Display';
let WIDGET_FONT_BOLD = 'SF UI Display Bold';
let DEFAULT_BG_COLOR_LIGHT = '#FFFFFF';
let DEFAULT_BG_COLOR_DARK = '#2B2B2B';
let lib = "https://gitee.com/cvnc/BMW/raw/master/lib/Ow-230427.js"

    // lib = "http://192.168.3.200:5500/" + "宝马小组件/Ow-310-331-230401-测试.js"

let BMW_SERVER_HOST = 'https://myprofile.bmw.com.cn';
let DEFAULT_LOGO_LIGHT = 'https://z3.ax1x.com/2021/11/01/ICa7g1.png';
let BMW_HEADERS = {
    'Content-Type': 'application/json; charset=utf-8',
    'Accept-Language': 'zh-CN',
    'x-user-agent': 'ios(15.4.1);bmw;3.3.1(22431)', //3.3.1(22431) 3.1.0(22431)
};
let MY_BMW_REFRESH_TOKEN = 'MY_BMW_REFRESH_TOKEN';
let MY_BMW_TOKEN = 'MY_BMW_TOKEN';
let MY_BMW_TOKEN_UPDATE_LAST_AT = 'MY_BMW_TOKEN_UPDATE_LAST_AT';
let MY_BMW_LAST_CHECK_IN_AT = 'MY_BMW_LAST_CHECK_IN_AT';
let APP_USE_AGREEMENT = 'APP_USE_AGREEMENT';
let MY_BMW_VEHICLE_UPDATE_LAST_AT = 'MY_BMW_VEHICLE_UPDATE_LAST_AT';
let MY_BMW_VEHICLE_DATA = 'MY_BMW_VEHICLE_DATA';
let WIDGET_DANGER_COLOR = '#ff0000';

class Base {
    constructor(arg = '') {
        this.arg = arg;
        this._actions = {};
        this.init();
    }

    init(widgetFamily = config.widgetFamily) {
        // 组件大小：small,medium,large
        this.widgetFamily = widgetFamily;
        // 系统设置的key，这里分为三个类型：
        // 1. 全局
        // 2. 不同尺寸的小组件
        // 3. 不同尺寸+小组件自定义的参数
        // 当没有key2时，获取key1，没有key1获取全局key的设置
        // this.SETTING_KEY = this.md5(Script.name()+'@'+this.widgetFamily+"@"+this.arg)
        // this.SETTING_KEY1 = this.md5(Script.name()+'@'+this.widgetFamily)
        this.SETTING_KEY = this.md5(Script.name());
        // 文件管理器
        // 提示：缓存数据不要用这个操作，这个是操作源码目录的，缓存建议存放在local temp目录中
        this.FILE_MGR = FileManager[module.filename.includes('Documents/iCloud~') ? 'iCloud' : 'local']();
        // 本地，用于存储图片等
        this.FILE_MGR_LOCAL = FileManager.local();
        this.BACKGROUND_KEY = this.FILE_MGR_LOCAL.joinPath(
            this.FILE_MGR_LOCAL.documentsDirectory(),
            `bg_${this.SETTING_KEY}.jpg`
        );
        // this.BACKGROUND_KEY1 = this.FILE_MGR_LOCAL.joinPath(this.FILE_MGR_LOCAL.documentsDirectory(), `bg_${this.SETTING_KEY1}.jpg`)
        // this.BACKGROUND_KEY2 = this.FILE_MGR_LOCAL.joinPath(this.FILE_MGR_LOCAL.documentsDirectory(), `bg_${this.SETTING_KEY2}.jpg`)
        // // 插件设置
        this.settings = this.getSettings();
    }

    /**
     * 注册点击操作菜单
     * @param {string} name 操作函数名
     * @param {func} func 点击后执行的函数
     */
    registerAction(name, func) {
        this._actions[name] = func.bind(this);
    }

    /**
     * 生成操作回调URL，点击后执行本脚本，并触发相应操作
     * @param {string} name 操作的名称
     * @param {string} data 传递的数据
     */
    actionUrl(name = '', data = '') {
        let u = URLScheme.forRunningScript();
        let q = `act=${encodeURIComponent(name)}&data=${encodeURIComponent(data)}&__arg=${encodeURIComponent(
            this.arg
        )}&__size=${this.widgetFamily}`;
        let result = '';
        if (u.includes('run?')) {
            result = `${u}&${q}`;
        } else {
            result = `${u}?${q}`;
        }
        return result;
    }

    /**
     * base64 编码字符串
     * @param {string} str 要编码的字符串
     */
    base64Encode(str) {
        const data = Data.fromString(str);
        return data.toBase64String();
    }

    /**
     * base64解码数据 返回字符串
     * @param {string} b64 base64编码的数据
     */
    base64Decode(b64) {
        const data = Data.fromBase64String(b64);
        return data.toRawString();
    }

    /**
     * md5 加密字符串
     * @param {string} str 要加密成md5的数据
     */
    md5(str) {
        function d(n, t) {
            var r = (65535 & n) + (65535 & t);
            return (((n >> 16) + (t >> 16) + (r >> 16)) << 16) | (65535 & r);
        }
        function f(n, t, r, e, o, u) {
            return d(((c = d(d(t, n), d(e, u))) << (f = o)) | (c >>> (32 - f)), r);
            var c, f;
        }
        function l(n, t, r, e, o, u, c) {
            return f((t & r) | (~t & e), n, t, o, u, c);
        }
        function v(n, t, r, e, o, u, c) {
            return f((t & e) | (r & ~e), n, t, o, u, c);
        }
        function g(n, t, r, e, o, u, c) {
            return f(t ^ r ^ e, n, t, o, u, c);
        }
        function m(n, t, r, e, o, u, c) {
            return f(r ^ (t | ~e), n, t, o, u, c);
        }
        function i(n, t) {
            var r, e, o, u;
            (n[t >> 5] |= 128 << t % 32), (n[14 + (((t + 64) >>> 9) << 4)] = t);
            for (var c = 1732584193, f = -271733879, i = -1732584194, a = 271733878, h = 0; h < n.length; h += 16)
                (c = l((r = c), (e = f), (o = i), (u = a), n[h], 7, -680876936)),
                    (a = l(a, c, f, i, n[h + 1], 12, -389564586)),
                    (i = l(i, a, c, f, n[h + 2], 17, 606105819)),
                    (f = l(f, i, a, c, n[h + 3], 22, -1044525330)),
                    (c = l(c, f, i, a, n[h + 4], 7, -176418897)),
                    (a = l(a, c, f, i, n[h + 5], 12, 1200080426)),
                    (i = l(i, a, c, f, n[h + 6], 17, -1473231341)),
                    (f = l(f, i, a, c, n[h + 7], 22, -45705983)),
                    (c = l(c, f, i, a, n[h + 8], 7, 1770035416)),
                    (a = l(a, c, f, i, n[h + 9], 12, -1958414417)),
                    (i = l(i, a, c, f, n[h + 10], 17, -42063)),
                    (f = l(f, i, a, c, n[h + 11], 22, -1990404162)),
                    (c = l(c, f, i, a, n[h + 12], 7, 1804603682)),
                    (a = l(a, c, f, i, n[h + 13], 12, -40341101)),
                    (i = l(i, a, c, f, n[h + 14], 17, -1502002290)),
                    (c = v(c, (f = l(f, i, a, c, n[h + 15], 22, 1236535329)), i, a, n[h + 1], 5, -165796510)),
                    (a = v(a, c, f, i, n[h + 6], 9, -1069501632)),
                    (i = v(i, a, c, f, n[h + 11], 14, 643717713)),
                    (f = v(f, i, a, c, n[h], 20, -373897302)),
                    (c = v(c, f, i, a, n[h + 5], 5, -701558691)),
                    (a = v(a, c, f, i, n[h + 10], 9, 38016083)),
                    (i = v(i, a, c, f, n[h + 15], 14, -660478335)),
                    (f = v(f, i, a, c, n[h + 4], 20, -405537848)),
                    (c = v(c, f, i, a, n[h + 9], 5, 568446438)),
                    (a = v(a, c, f, i, n[h + 14], 9, -1019803690)),
                    (i = v(i, a, c, f, n[h + 3], 14, -187363961)),
                    (f = v(f, i, a, c, n[h + 8], 20, 1163531501)),
                    (c = v(c, f, i, a, n[h + 13], 5, -1444681467)),
                    (a = v(a, c, f, i, n[h + 2], 9, -51403784)),
                    (i = v(i, a, c, f, n[h + 7], 14, 1735328473)),
                    (c = g(c, (f = v(f, i, a, c, n[h + 12], 20, -1926607734)), i, a, n[h + 5], 4, -378558)),
                    (a = g(a, c, f, i, n[h + 8], 11, -2022574463)),
                    (i = g(i, a, c, f, n[h + 11], 16, 1839030562)),
                    (f = g(f, i, a, c, n[h + 14], 23, -35309556)),
                    (c = g(c, f, i, a, n[h + 1], 4, -1530992060)),
                    (a = g(a, c, f, i, n[h + 4], 11, 1272893353)),
                    (i = g(i, a, c, f, n[h + 7], 16, -155497632)),
                    (f = g(f, i, a, c, n[h + 10], 23, -1094730640)),
                    (c = g(c, f, i, a, n[h + 13], 4, 681279174)),
                    (a = g(a, c, f, i, n[h], 11, -358537222)),
                    (i = g(i, a, c, f, n[h + 3], 16, -722521979)),
                    (f = g(f, i, a, c, n[h + 6], 23, 76029189)),
                    (c = g(c, f, i, a, n[h + 9], 4, -640364487)),
                    (a = g(a, c, f, i, n[h + 12], 11, -421815835)),
                    (i = g(i, a, c, f, n[h + 15], 16, 530742520)),
                    (c = m(c, (f = g(f, i, a, c, n[h + 2], 23, -995338651)), i, a, n[h], 6, -198630844)),
                    (a = m(a, c, f, i, n[h + 7], 10, 1126891415)),
                    (i = m(i, a, c, f, n[h + 14], 15, -1416354905)),
                    (f = m(f, i, a, c, n[h + 5], 21, -57434055)),
                    (c = m(c, f, i, a, n[h + 12], 6, 1700485571)),
                    (a = m(a, c, f, i, n[h + 3], 10, -1894986606)),
                    (i = m(i, a, c, f, n[h + 10], 15, -1051523)),
                    (f = m(f, i, a, c, n[h + 1], 21, -2054922799)),
                    (c = m(c, f, i, a, n[h + 8], 6, 1873313359)),
                    (a = m(a, c, f, i, n[h + 15], 10, -30611744)),
                    (i = m(i, a, c, f, n[h + 6], 15, -1560198380)),
                    (f = m(f, i, a, c, n[h + 13], 21, 1309151649)),
                    (c = m(c, f, i, a, n[h + 4], 6, -145523070)),
                    (a = m(a, c, f, i, n[h + 11], 10, -1120210379)),
                    (i = m(i, a, c, f, n[h + 2], 15, 718787259)),
                    (f = m(f, i, a, c, n[h + 9], 21, -343485551)),
                    (c = d(c, r)),
                    (f = d(f, e)),
                    (i = d(i, o)),
                    (a = d(a, u));
            return [c, f, i, a];
        }
        function a(n) {
            for (var t = '', r = 32 * n.length, e = 0; e < r; e += 8)
                t += String.fromCharCode((n[e >> 5] >>> e % 32) & 255);
            return t;
        }
        function h(n) {
            var t = [];
            for (t[(n.length >> 2) - 1] = void 0, e = 0; e < t.length; e += 1) t[e] = 0;
            for (var r = 8 * n.length, e = 0; e < r; e += 8) t[e >> 5] |= (255 & n.charCodeAt(e / 8)) << e % 32;
            return t;
        }
        function e(n) {
            for (var t, r = '0123456789abcdef', e = '', o = 0; o < n.length; o += 1)
                (t = n.charCodeAt(o)), (e += r.charAt((t >>> 4) & 15) + r.charAt(15 & t));
            return e;
        }
        function r(n) {
            return unescape(encodeURIComponent(n));
        }
        function o(n) {
            return a(i(h((t = r(n))), 8 * t.length));
            var t;
        }
        function u(n, t) {
            return (function (n, t) {
                var r,
                    e,
                    o = h(n),
                    u = [],
                    c = [];
                for (u[15] = c[15] = void 0, 16 < o.length && (o = i(o, 8 * n.length)), r = 0; r < 16; r += 1)
                    (u[r] = 909522486 ^ o[r]), (c[r] = 1549556828 ^ o[r]);
                return (e = i(u.concat(h(t)), 512 + 8 * t.length)), a(i(c.concat(e), 640));
            })(r(n), r(t));
        }
        function t(n, t, r) {
            return t ? (r ? u(t, n) : e(u(t, n))) : r ? o(n) : e(o(n));
        }
        return t(str);
    }

    /**
     * 获取远程图片内容
     * @param {string} url 图片地址
     * @param {bool} useCache 是否使用缓存（请求失败时获取本地缓存）
     */
    async getImageByUrl(url, useCache = true) {
        const cacheKey = this.md5(url);
        const cacheFile = FileManager.local().joinPath(FileManager.local().temporaryDirectory(), cacheKey);
        // 判断是否有缓存
        if (useCache && FileManager.local().fileExists(cacheFile)) {
            return Image.fromFile(cacheFile);
        }
        try {
            const req = new Request(url);
            const img = await req.loadImage();
            // 存储到缓存
            FileManager.local().writeImage(cacheFile, img);
            return img;
        } catch (e) {
            // 没有缓存+失败情况下，返回自定义的绘制图片（红色背景）
            throw new Error('加载图片失败');
        }
    }

    /**
     * 渲染标题内容
     * @param {object} widget 组件对象
     * @param {string} icon 图标地址
     * @param {string} title 标题内容
     * @param {bool|color} color 字体的颜色（自定义背景时使用，默认系统）
     */
    async renderHeader(widget, icon, title, color = false) {
        widget.addSpacer(10);
        let header = widget.addStack();
        header.centerAlignContent();
        let _icon = header.addImage(await this.getImageByUrl(icon));
        _icon.imageSize = new Size(14, 14);
        _icon.cornerRadius = 4;
        header.addSpacer(10);
        let _title = header.addText(title);
        if (color) _title.textColor = color;
        _title.textOpacity = 0.7;
        _title.font = Font.boldSystemFont(12);
        widget.addSpacer(10);
        return widget;
    }

    /**
     * 弹出一个通知
     * @param {string} title 通知标题
     * @param {string} body 通知内容
     * @param {string} url 点击后打开的URL
     */
    async notify(title, body, url = null, opts = {}) {
        let n = new Notification();
        n = Object.assign(n, opts);
        n.title = title;
        n.body = body;
        if (url) n.openURL = url;
        return await n.schedule();
    }

    /**
     * 给图片加一层半透明遮罩
     * @param {Image} img 要处理的图片
     * @param {string} color 遮罩背景颜色
     * @param {float} opacity 透明度
     */
    async shadowImage(img, color = '#000000', opacity = 0.7) {
        let ctx = new DrawContext();
        // 获取图片的尺寸
        ctx.size = img.size;

        ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']));
        ctx.setFillColor(new Color(color, opacity));
        ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']));

        let res = await ctx.getImage();
        return res;
    }

    /**
     * 获取当前插件的设置
     * @param {boolean} json 是否为json格式
     */
    getSettings(json = true) {
        let res = json ? {} : '';
        let cache = '';
        // if (global && Keychain.contains(this.SETTING_KEY2)) {
        //   cache = Keychain.get(this.SETTING_KEY2)
        // } else if (Keychain.contains(this.SETTING_KEY)) {
        //   cache = Keychain.get(this.SETTING_KEY)
        // } else if (Keychain.contains(this.SETTING_KEY1)) {
        //   cache = Keychain.get(this.SETTING_KEY1)
        // } else if (Keychain.contains(this.SETTING_KEY2)){
        if (Keychain.contains(this.SETTING_KEY)) {
            cache = Keychain.get(this.SETTING_KEY);
        }
        if (json) {
            try {
                res = JSON.parse(cache);
            } catch (e) {}
        } else {
            res = cache;
        }

        return res;
    }

    /**
     * 存储当前设置
     * @param {bool} notify 是否通知提示
     */
    saveSettings(notify = true) {
        let res = typeof this.settings === 'object' ? JSON.stringify(this.settings) : String(this.settings);
        Keychain.set(this.SETTING_KEY, res);
        if (notify) this.notify('设置成功', '桌面组件稍后将自动刷新');
    }
}
const Running = async (Widget, default_args = '') => {
    let M = null;
    if (config.runsInWidget) {
        M = new Widget(args.widgetParameter || '');
        const W = await M.render();
        Script.setWidget(W);
        Script.complete();
    } else {
        let {act, data, __arg, __size} = args.queryParameters;
        M = new Widget(__arg || default_args || '');
        if (__size) M.init(__size);
        if (!act || !M['_actions']) {
            // 弹出选择菜单
            const actions = M['_actions'];
            const _actions = [];
            const alert = new Alert();
            alert.title = M.name;
            alert.message = M.desc;

            for (let _ in actions) {
                alert.addAction(_);
                _actions.push(actions[_]);
            }
            alert.addCancelAction('取消操作');
            const idx = await alert.presentSheet();
            if (_actions[idx]) {
                const func = _actions[idx];
                await func();
            }
            return;
        }
        let _tmp = act
            .split('-')
            .map((_) => _[0].toUpperCase() + _.substr(1))
            .join('');
        let _act = `action${_tmp}`;
        if (M[_act] && typeof M[_act] === 'function') {
            const func = M[_act].bind(M);
            await func(data);
        }
    }
};
class Widget extends Base {
    
    DeviceSize = {
        '428x926': {
            small: {width: 176, height: 176},
            medium: {width: 374, height: 176},
            large: {width: 374, height: 391}
        },
        '390x844': {
            small: {width: 161, height: 161},
            medium: {width: 342, height: 161},
            large: {width: 342, height: 359}
        },
        '414x896': {
            small: {width: 169, height: 169},
            medium: {width: 360, height: 169},
            large: {width: 360, height: 376}
        },
        '375x812': {
            small: {width: 155, height: 155},
            medium: {width: 329, height: 155},
            large: {width: 329, height: 345}
        },
        '414x736': {
            small: {width: 159, height: 159},
            medium: {width: 348, height: 159},
            large: {width: 348, height: 357}
        },
        '375x667': {
            small: {width: 148, height: 148},
            medium: {width: 322, height: 148},
            large: {width: 322, height: 324}
        },
        '320x568': {
            small: {width: 141, height: 141},
            medium: {width: 291, height: 141},
            large: {width: 291, height: 299}
        }
    };

    userConfigData = {
        username: '',
        password: '',
        custom_name: '',
        custom_vehicle_image: null,
        custom_logo_image: null,
        vin: '',
        map_api_key: null,
        show_control_checks: 0,
        force_dark_theme: null
    };

    appColorData = {
        light: {
            startColor: DEFAULT_BG_COLOR_LIGHT,
            endColor: DEFAULT_BG_COLOR_LIGHT,
            fontColor: DEFAULT_BG_COLOR_DARK
        },
        dark: {
            startColor: DEFAULT_BG_COLOR_DARK,
            endColor: DEFAULT_BG_COLOR_DARK,
            fontColor: DEFAULT_BG_COLOR_LIGHT
        }
    };

    constructor(arg) {
        super(arg);
        this.name = '宝马小组件';
        this.desc = 'My BMW ' + MYBMW_VERSION  + "\n" + '更新时间:' + WIDGET_VERSION;

        this.userConfigData = {...this.userConfigData, ...this.settings['UserConfig']};

        let colorSettings = this.settings['AppColorConfig'];
        if (typeof colorSettings == 'string') {
            try {
                colorSettings = JSON.parse(colorSettings);
            } catch (e) {
                colorSettings = {};
            }
        }
        this.appColorData = {...this.appColorData, ...colorSettings};

        if (config.runsInApp) {
            this.registerAction('退出登录', this.userCleanAlert);
            this.registerAction('配置小组件', this.userConfigInput);
            this.registerAction('登录My BMW', this.userLoginInput);
        }
    }

    async userLoginInput() {
        const confirmationAlert = new Alert();

        confirmationAlert.title = '郑重声明';
        confirmationAlert.message = `小组件需要使用到您的BMW账号\n\r\n首次登录请配置账号、密码进行令牌获取\n\r\n小组件不会收集您的个人账户信息，所有账号信息将存在iCloud或者iPhone上但也请您妥善保管自己的账号\n\r\n小组件是开源、并且完全免费的，由BMW车主开发，所有责任与BMW公司无关`;

        confirmationAlert.addAction('同意');
        confirmationAlert.addCancelAction('不同意');

        const userSelection = await confirmationAlert.presentAlert();
        if (userSelection == -1) {
            Keychain.set(APP_USE_AGREEMENT, 'false');
            return;
        }
        Keychain.set(APP_USE_AGREEMENT, 'true');

        return await this.userLoginCredentials();
    }

    async userCleanAlert() {
        const confirmationAlert = new Alert();

        confirmationAlert.title = '提示';
        confirmationAlert.message = '您的所有账户信息与设置将会从小组件中移除';

        confirmationAlert.addAction('退出登录');
        confirmationAlert.addCancelAction('取消');

        const userSelection = await confirmationAlert.presentAlert();
        if (userSelection == -1) {
            return;
        }

        try {
            if (this.SETTING_KEY && Keychain.contains(this.SETTING_KEY)) {
                Keychain.remove(this.SETTING_KEY);
            }
        } catch (e) {
            console.error('Clean User: ' + e.message);
        }

        try {
            let _fileKey = this.md5(Script.name());
            if (_fileKey && Keychain.contains(_fileKey)) {
                Keychain.remove(_fileKey);
            }
        } catch (e) {
            console.error('Clean User: ' + e.message);
        }

        let vin = this.userConfigData.vin || '';

        let lastUpdateKey = vin + MY_BMW_VEHICLE_UPDATE_LAST_AT;
        let localVehicleDataKey = vin + MY_BMW_VEHICLE_DATA;

        let keyStoreArray = [
            MY_BMW_LAST_CHECK_IN_AT,
            MY_BMW_REFRESH_TOKEN,
            MY_BMW_TOKEN,
            MY_BMW_TOKEN_UPDATE_LAST_AT,
            MY_BMW_VEHICLE_UPDATE_LAST_AT,
            APP_USE_AGREEMENT,
            lastUpdateKey,
            localVehicleDataKey
        ];
        for (const key of keyStoreArray) {
            try {
                if (Keychain.contains(key)) {
                    Keychain.remove(key);
                }
            } catch (e) {}
        }

        this.notify('退出成功', '账户设置信息已经从小组件中删除');
    }

    async userLoginCredentials() {
        const userLoginAlert = new Alert();
        userLoginAlert.title = '配置BMW登录';
        userLoginAlert.message = '使用密码授权登录';

        userLoginAlert.addTextField('账号(您的电话)', this.userConfigData['username']);
        userLoginAlert.addAction('使用密码登陆');
        userLoginAlert.addAction('使用短信登陆');
        userLoginAlert.addCancelAction('取消');

        const id = await userLoginAlert.presentAlert();

        this.userConfigData['username'] = this.formatUserMobile(userLoginAlert.textFieldValue(0));
        let username = this.userConfigData['username']
        let Login = new Alert();

        
        let url = encodeURI(`${lib}`)
        let req = new Request(url)
        let Code = await req.loadString()

        if (id == 0) {
            console.log('准备使用密码登陆');
            Login.title = '配置BMW登录';
            Login.message = '使用账户密码登录';
            Login.addTextField('密码', this.userConfigData['password']);
            Login.addAction('登录');
            Login.addCancelAction('取消');
            let id = await Login.presentAlert();
            if (id == -1) {
                return;
            }
            this.userConfigData['password'] = Login.textFieldValue(0);
            let password = this.userConfigData['password']
            let encryptPassword = await new Function(`${Code}return getEncryptedPassword;`)()(password);
            let verifyId = await new Function(`${Code}return getLoginVerifyId;`)()(username);
            return this.myBMWLogin(Code, "pwd", username, encryptPassword, verifyId)
        }

        if (id == 1) {
            console.log('准备使用短信登陆');
            let verifyId = await new Function(`${Code}return getLoginVerifyId;`)()(username);
            let otpID = await new Function(`${Code}return getSMSotpID;`)()(username, verifyId);
            Login.title = '配置BMW登录';
            Login.message = '使用短信验证码登录';
            Login.addTextField('验证码已发送,请输入验证码');
            Login.addAction('登陆');
            Login.addCancelAction('取消');
            let id = await Login.presentAlert();
            if (id == -1) {
                return;
            }
            let otpMsg = Login.textFieldValue(0);
            return this.myBMWLogin(Code, "sms", username, otpID, otpMsg)
        }

        if (id == -1) {
            return;
        }

    }

    async myBMWLogin(Code, pwd_sms, username, encryptPassword_otpID, verifyId_otpMsg) {

        let deviceId = this.md5(this.userConfigData.username.slice(0, 16))
        let nonce = await new Function(`${Code}return getNonce;`)()(username);
        let loginResult = await new Function(`${Code}return LoginWithPWD_SMS;`)()(pwd_sms, username, encryptPassword_otpID, verifyId_otpMsg, deviceId, nonce);

        if (!loginResult || loginResult.code != 200 || !loginResult['data']['refresh_token']) {
            let ErrorText ='登录失败'
            console.error(ErrorText + loginResult['description']);
            const messageAlert = new Alert();
            messageAlert.title = '登录失败';
            messageAlert.message = loginResult['description']
            messageAlert.addCancelAction('取消');
            await messageAlert.presentAlert();

            return this.userLoginCredentials();
        }

        this.settings['UserConfig'] = this.userConfigData;
        this.saveSettings(false);

        console.log('登录成功');
        console.log(loginResult);

        Keychain.set(MY_BMW_REFRESH_TOKEN, loginResult['data']['refresh_token']);

        let vehicle = this.getData(true);
        if (!vehicle) {
            return null;
        }

        const messageAlert = new Alert();
        messageAlert.title = '登录成功';
        messageAlert.message = '请在桌面添加小组件';
        messageAlert.addCancelAction('确定');
        await messageAlert.presentAlert();

        return true;
    }

    formatUserMobile(mobileStr) {

        mobileStr = mobileStr.replace(/\D/g, '');

        if (mobileStr.startsWith('86')) {
            return mobileStr;
        }

        if (mobileStr.length == 11) {
            return '86' + mobileStr;
        }

        return mobileStr;
    }

    async userConfigInput() {
        const userCustomConfigAlert = new Alert();
        userCustomConfigAlert.title = '自定义小组件';
        userCustomConfigAlert.message = '以下可以不用填写，留空信息会从系统自动获取';


        let configSet = {
            custom_name: '自定义车名（默认自动获取）',
            custom_vehicle_image: '车辆图片URL（默认自动获取）',
            custom_logo_image: 'LOGO URL(默认自动获取）',
            vin: '车架号(多辆BMW时填写)',
            map_api_key: '高德地图API_KEY（非必要）',
            force_dark_theme: '总是深色主题（是or否）'
        };

        for (const key in configSet) {
            if (!configSet[key] || !this.userConfigData.hasOwnProperty(key)) {
                continue;
            }

            if (key == 'force_dark_theme') {
                userCustomConfigAlert.addTextField(configSet[key], this.userConfigData[key] ? '是' : null);
                continue;
            }

            userCustomConfigAlert.addTextField(configSet[key], this.userConfigData[key]);
        }

        userCustomConfigAlert.addCancelAction('跳过');
        userCustomConfigAlert.addAction('下一步');

        let result = await userCustomConfigAlert.presentAlert();

        if (result == -1) {
            return;
        }


        for (const key in configSet) {
            if (!configSet[key] || !this.userConfigData.hasOwnProperty(key)) {
                continue;
            }

            let index = Object.keys(configSet).indexOf(key);
            this.userConfigData[key] = userCustomConfigAlert.textFieldValue(index);

            if (key != 'custom_name') {
                this.userConfigData[key] = this.userConfigData[key].replace(' ', '');
            }
            if (key == 'force_dark_theme') {
                this.userConfigData[key] = this.userConfigData[key] && this.userConfigData[key] == '是';
            }
        }


        this.settings['UserConfig'] = this.userConfigData;
        this.saveSettings(false);

        await this.controlCheckSetup();
        await this.colorSetPickUp();
    }

    async colorSetPickUp() {
        const colorSetPickup = new Alert();

        colorSetPickup.title = '选取背景颜色';
        colorSetPickup.message = `请根据车辆颜色选取背景`;

        let systemColorSet = {
            白色: {
                light: {
                    startColor: '#c7c7c7',
                    endColor: '#fff',
                    fontColor: '#1d1d1d'
                },
                dark: {
                    startColor: '#232323',
                    endColor: '#5b5d61',
                    fontColor: '#fff'
                }
            },
            黑色: {
                light: {
                    startColor: '#5e627d',
                    endColor: '#fff',
                    fontColor: '#1d1d1d'
                },
                dark: {
                    startColor: '#2d2f40',
                    endColor: '#666878',
                    fontColor: '#fff'
                }
            },
            蓝色: {
                light: {
                    startColor: '#6887d1',
                    endColor: '#fff',
                    fontColor: '#1d1d1d'
                },
                dark: {
                    startColor: '#23345e',
                    endColor: '#526387',
                    fontColor: '#fff'
                }
            },
            红色: {
                light: {
                    startColor: '#b16968',
                    endColor: '#fff',
                    fontColor: '#1d1d1d'
                },
                dark: {
                    startColor: '#a84242',
                    endColor: '#540101',
                    fontColor: '#fff'
                }
            },
            橙色: {
                light: {
                    startColor: '#ffc699',
                    endColor: '#fff',
                    fontColor: '#1d1d1d'
                },
                dark: {
                    startColor: '#bd5608',
                    endColor: '#732600',
                    fontColor: '#fff'
                }
            }
        };

        for (const key in systemColorSet) {
            colorSetPickup.addAction(key);
        }


        colorSetPickup.addAction('自定义');

        const userSelection = await colorSetPickup.presentAlert();


        for (const key in systemColorSet) {
            if (!systemColorSet[key]) {
                continue;
            }

            let index = Object.keys(systemColorSet).indexOf(key);
            if (index == userSelection) {
                this.settings['AppColorConfig'] = systemColorSet[key];
            }
        }

        if (userSelection >= Object.keys(systemColorSet).length) {
            this.settings['AppColorConfig'] = await this.colorConfigInput();
        }

        this.saveSettings();
    }

    async controlCheckSetup() {
        const controlCheckAlert = new Alert();

        controlCheckAlert.title = '是否显示车辆检查';
        controlCheckAlert.message = '是否显示额外的车辆检查信息？\n\r\n如机油保养、轮胎压力检查或者ALL GOOD。';

        controlCheckAlert.addAction('不显示');
        // last index alway be the custom
        controlCheckAlert.addAction('显示所有检查信息');
        controlCheckAlert.addAction('只显示ALL GOOD');

        const userSelection = await controlCheckAlert.presentAlert();

        this.userConfigData['show_control_checks'] = Number(userSelection);
        this.settings['UserConfig'] = this.userConfigData;

        // write to local
        this.saveSettings(false);
    }

    async colorConfigInput() {
        const bgColorAlert = new Alert();

        bgColorAlert.title = '配置背景颜色';
        bgColorAlert.message = '请输入16进制RBG颜色代码, 留空小组件将自动从系统获取';

        bgColorAlert.addTextField('顶部颜色（如#FFFFFF）', this.appColorData['light']['startColor']);
        bgColorAlert.addTextField('底部颜色（如#FFFFFF）', this.appColorData['light']['endColor']);
        bgColorAlert.addTextField('字体颜色（如#000000）', this.appColorData['light']['fontColor']);

        bgColorAlert.addAction('确定');
        bgColorAlert.addCancelAction('取消');

        const id = await bgColorAlert.presentAlert();

        if (id == -1) {
            return this.appColorData;
        }

        let appColorConfig = {
            startColor: bgColorAlert.textFieldValue(0),
            endColor: bgColorAlert.textFieldValue(1),
            fontColor: bgColorAlert.textFieldValue(2)
        };

        return {light: appColorConfig, dark: appColorConfig};
    }

    async render() {
 

        await this.renderError('载入中...');

        if (
            (!this.userConfigData.username || this.userConfigData.username == '') &&
            (!this.userConfigData.custom_name || this.userConfigData.custom_name == '')
        ) {
            return await this.renderError('请先配置用户');
        }

        let data = await this.getData();

        if (
            !data &&
            (!this.userConfigData.username || this.userConfigData.username == '') &&
            this.userConfigData.custom_name &&
            this.userConfigData.custom_name != ''
        ) {
            // put default data
            data = {
                status: {
                    doorsGeneralState: '已上锁',
                    lastUpdatedAt: new Date(),
                    fuelIndicators: [
                        {
                            rangeValue: '888',
                            levelValue: '99',
                            rangeUnits: 'km',
                            levelUnits: '%'
                        }
                    ],
                    currentMileage: {mileage: 2233, units: 'km'}
                }
            };
        }

        if (!data) {
            return await this.renderError('获取车辆信息失败，请检查授权');
        }


        try {
            let screenSize = Device.screenResolution();
            let scale = Device.screenScale();
            data.size =
                this.DeviceSize[`${screenSize.width / scale}x${screenSize.height / scale}`] ||
                this.DeviceSize['375x812'];
        } catch (e) {
            console.log('显示错误: ' + e.message);
            await this.renderError('显示错误：' + e.message);
        }
        //console.log(JSON.stringify(data))
        switch (this.widgetFamily) {
            case 'large':
                return await this.renderLarge(data);
            case 'medium':
                return await this.renderMedium(data);
            default:
                return await this.renderSmall(data);
        }
    }

    async getAppLogo() {
        let logoURL = DEFAULT_LOGO_LIGHT;

        // not load dynamically have to re add the widget
        let darkModel = Device.isUsingDarkAppearance();
        if (darkModel) {
            //  logoURL = DEFAULT_LOGO_DARK;
        }

        if (this.userConfigData.custom_logo_image) {
            logoURL = this.userConfigData.custom_logo_image;
        }

        return await this.getImageByUrl(logoURL);
    }

    async renderError(errMsg) {
        let w = new ListWidget();
        w.backgroundGradient = this.getBackgroundColor();

        const padding = 16;
        w.setPadding(padding, padding, padding, padding);
        w.addStack().addText(errMsg);
        return w;
    }

    getFontColor() {
        if (this.userConfigData.force_dark_theme) {
            return Color.white();
        }
        if (this.validColorString(this.appColorData.light.fontColor)) {
            return Color.dynamic(
                new Color(this.appColorData['light']['fontColor'], 1),
                new Color(this.appColorData['dark']['fontColor'], 1)
            );
        }
        return Color.dynamic(new Color('#2B2B2B', 1), Color.white());
    }

    getBackgroundColor() {
        const bgColor = new LinearGradient();

        let startColor = Color.dynamic(new Color(DEFAULT_BG_COLOR_LIGHT, 1), new Color(DEFAULT_BG_COLOR_DARK, 1));
        let endColor = Color.dynamic(new Color(DEFAULT_BG_COLOR_LIGHT, 1), new Color(DEFAULT_BG_COLOR_DARK, 1));

        try {
            if (this.userConfigData.force_dark_theme) {
                startColor = new Color(this.appColorData['dark']['startColor'], 1);
                endColor = new Color(this.appColorData['dark']['endColor'], 1);
            } else if (
                this.appColorData.light.startColor != DEFAULT_BG_COLOR_LIGHT ||
                this.appColorData.light.endColor != DEFAULT_BG_COLOR_LIGHT
            ) {
                // if user override
                if (
                    this.validColorString(this.appColorData['light'].startColor) &&
                    this.validColorString(this.appColorData['light'].endColor)
                ) {
                    startColor = Color.dynamic(
                        new Color(this.appColorData['light']['startColor'], 1),
                        new Color(this.appColorData['dark']['startColor'], 1)
                    );

                    endColor = Color.dynamic(
                        new Color(this.appColorData['light']['endColor'], 1),
                        new Color(this.appColorData['dark']['endColor'], 1)
                    );
                }
            }
        } catch (e) {
            console.error(e.message);
        }

        bgColor.colors = [startColor, endColor];

        bgColor.locations = [0.0, 1.0];

        return bgColor;
    }

    validColorString(colorStr) {
        return colorStr && colorStr.search('#') == 0 && (colorStr.length == 4 || colorStr.length == 7); // TODO: change to regex
    }

    async renderSmall(data) {
        let w = new ListWidget();
        let fontColor = this.getFontColor();
        w.backgroundGradient = this.getBackgroundColor();

        const width = data.size['small']['width'];
        const paddingLeft = Math.round(width * 0.07);

        w.setPadding(0, 0, 0, 0);

        const topBox = w.addStack();
        topBox.layoutHorizontally();
        topBox.setPadding(0, 0, 0, 0);

        // ---顶部左边部件---
        const topLeftContainer = topBox.addStack();

        const vehicleNameContainer = topLeftContainer.addStack();
        vehicleNameContainer.setPadding(paddingLeft, paddingLeft, 0, 0);

        let vehicleNameStr = `${data.brand} ${data.model}`;
        if (this.userConfigData.custom_name && this.userConfigData.custom_name.length > 0) {
            vehicleNameStr = this.userConfigData.custom_name;
        }
        const vehicleNameText = vehicleNameContainer.addText(vehicleNameStr);

        // get dynamic size
        let vehicleNameSize = Math.round(width * 0.12);

        if (vehicleNameStr.length >= 10) {
            vehicleNameSize = vehicleNameSize - Math.round(vehicleNameStr.length / 4);
        }

        vehicleNameText.leftAlignText();
        vehicleNameText.font = this.getFont(`${WIDGET_FONT_BOLD}`, vehicleNameSize);
        vehicleNameText.textColor = fontColor;
        // ---顶部左边部件完---

        topBox.addSpacer();

        // ---顶部右边部件---
        const topRightBox = topBox.addStack();
        topRightBox.setPadding(6, 0, 0, paddingLeft);

        if (!this.userConfigData.custom_logo_image) {
            topRightBox.setPadding(paddingLeft, 0, 0, paddingLeft);
        }

        try {
            let logoImage = await this.getAppLogo();
            let logoImageWidget = topRightBox.addImage(logoImage);

            let logoContainerWidth = Math.round(width * 0.1);
            let imageSize = this.getImageSize(
                logoImage.size.width,
                logoImage.size.height,
                Math.round(logoContainerWidth * 2.5),
                logoContainerWidth,
                0.99
            );

            logoImageWidget.imageSize = new Size(imageSize.width, imageSize.width);
        } catch (e) {}
        // ---顶部右边部件完---

        // ---中间部件---
        const carInfoContainer = w.addStack();
        carInfoContainer.layoutVertically();
        carInfoContainer.setPadding(8, paddingLeft, 0, 0);

        const kmContainer = carInfoContainer.addStack();
        kmContainer.layoutHorizontally();
        kmContainer.bottomAlignContent();

        try {
            const {levelValue, levelUnits, rangeValue, rangeUnits} = this.getFuelIndicators(data.status.fuelIndicators);

            const kmText = kmContainer.addText(`${rangeValue + ' ' + rangeUnits}`);
            kmText.font = this.getFont(`${WIDGET_FONT}`, 17);
            kmText.textColor = fontColor;

            const levelContainer = kmContainer.addStack();
            const separator = levelContainer.addText(' / ');
            separator.font = this.getFont(`${WIDGET_FONT}`, 12);
            separator.textColor = fontColor;
            separator.textOpacity = 0.6;

            const levelText = levelContainer.addText(`${levelValue}${levelUnits}`);
            levelText.font = this.getFont(`${WIDGET_FONT}`, 14);
            levelText.textColor = fontColor;
            levelText.textOpacity = 0.6;
        } catch (e) {
            console.error(e.message);
            kmContainer.addText(`获取里程失败`);
        }

        const carStatusContainer = carInfoContainer.addStack();
        carStatusContainer.setPadding(2, 0, 0, 0);

        const carStatusBox = carStatusContainer.addStack();
        carStatusBox.setPadding(3, 3, 3, 3);
        carStatusBox.layoutHorizontally();
        carStatusBox.centerAlignContent();
        carStatusBox.cornerRadius = 4;
        carStatusBox.backgroundColor = this.getFocusedBackgroundColor();

        try {
            const carStatusTxt = carStatusBox.addText(`${data.status.doorsGeneralState}`);

            let displayFont = WIDGET_FONT;
            let displayFontColor = fontColor;
            if (data.properties && !data.properties.areDoorsClosed) {
                displayFontColor = new Color(WIDGET_DANGER_COLOR, 1);
                displayFont = WIDGET_FONT_BOLD;
            }

            carStatusTxt.font = this.getFont(displayFont, 10);
            carStatusTxt.textColor = displayFontColor;
            carStatusTxt.textOpacity = 0.7;
            carStatusBox.addSpacer(5);

            let statusLabel = this.formatStatusLabel(data);
            const updateTxt = carStatusBox.addText(statusLabel);
            updateTxt.font = this.getFont(`${WIDGET_FONT}`, 10);
            updateTxt.textColor = fontColor;
            updateTxt.textOpacity = 0.5;
        } catch (e) {
            console.error(e);
            carStatusBox.addText(`获取车门状态失败`);
        }

        // ---中间部件完---

        w.addSpacer();

        // ---底部部件---

        const carImageContainer = w.addStack();
        let canvasWidth = Math.round(width * 0.85);
        let canvasHeight = Math.round(width * 0.4);

        carImageContainer.setPadding(0, paddingLeft, 6, 0);
        if (!this.userConfigData.show_control_checks) {
            carImageContainer.layoutHorizontally();
            carImageContainer.addSpacer();
            carImageContainer.setPadding(6, paddingLeft, 6, paddingLeft);
        }

        let image = await this.getCarCanvasImage(data, canvasWidth, canvasHeight, 0.95);
        let carStatusImage = carImageContainer.addImage(image);
        carStatusImage.resizable = !this.userConfigData.show_control_checks;
        // ---底部部件完---

        w.url = 'de.bmw.connected.mobile20.cn://'; // BASEURL + encodeURI(SHORTCUTNAME);

        return w;
    }

    async renderMedium(data, renderLarge = false) {
        let w = new ListWidget();
        let fontColor = this.getFontColor();
        w.backgroundGradient = this.getBackgroundColor();

        w.setPadding(0, 0, 0, 0);
        const {width, height} = data.size['medium'];

        let paddingTop = Math.round(height * 0.09);
        let paddingLeft = Math.round(width * 0.055);

        let renderMediumContent = !renderLarge || this.userConfigData.map_api_key;

        const topContainer = w.addStack();
        topContainer.layoutHorizontally();

        const vehicleNameContainer = topContainer.addStack();
        vehicleNameContainer.layoutHorizontally();
        vehicleNameContainer.setPadding(paddingTop, paddingLeft, 0, 0);

        let vehicleNameStr = `${data.brand} ${data.model}`;
        if (this.userConfigData.custom_name && this.userConfigData.custom_name.length > 0) {
            vehicleNameStr = this.userConfigData.custom_name;
        }
        const vehicleNameText = vehicleNameContainer.addText(vehicleNameStr);

        let vehicleNameSize = 24;

        if (vehicleNameStr.length >= 10) {
            vehicleNameSize = vehicleNameSize - Math.round(vehicleNameStr.length / 4);
        }

        vehicleNameText.font = this.getFont(`${WIDGET_FONT_BOLD}`, vehicleNameSize);
        vehicleNameText.textColor = fontColor;
        vehicleNameContainer.addSpacer();

        const logoImageContainer = topContainer.addStack();
        logoImageContainer.layoutHorizontally();
        logoImageContainer.setPadding(paddingTop, 0, 0, paddingTop);

        try {
            let logoImage = logoImageContainer.addImage(await this.getAppLogo());
            logoImage.rightAlignImage();
        } catch (e) {}

        const bodyContainer = w.addStack();
        bodyContainer.layoutHorizontally();
        const leftContainer = bodyContainer.addStack();

        leftContainer.layoutVertically();
        leftContainer.size = new Size(Math.round(width * 0.85), Math.round(height * 0.75));
        if (renderMediumContent) {
            leftContainer.size = new Size(Math.round(width * 0.5), Math.round(height * 0.75));
        }
        leftContainer.addSpacer();

        const kmContainer = leftContainer.addStack();
        kmContainer.setPadding(0, paddingLeft, 0, 0);
        kmContainer.bottomAlignContent();

        try {
            const {levelValue, levelUnits, rangeValue, rangeUnits} = this.getFuelIndicators(data.status.fuelIndicators);
            const kmText = kmContainer.addText(`${rangeValue + ' ' + rangeUnits}`);
            kmText.font = this.getFont(`${WIDGET_FONT}`, 20);
            kmText.textColor = fontColor;

            const levelContainer = kmContainer.addStack();
            const separator = levelContainer.addText(' / ');
            separator.font = this.getFont(`${WIDGET_FONT}`, 16);
            separator.textColor = fontColor;
            separator.textOpacity = 0.6;

            const levelText = levelContainer.addText(`${levelValue}${levelUnits}`);
            levelText.font = this.getFont(`${WIDGET_FONT}`, 18);
            levelText.textColor = fontColor;
            levelText.textOpacity = 0.6;

            const mileageContainer = leftContainer.addStack();
            mileageContainer.setPadding(0, paddingLeft, 0, 0);

            let mileageText = mileageContainer.addText(
                `总里程: ${data.status.currentMileage.mileage} ${data.status.currentMileage.units}`
            );
            mileageText.font = this.getFont(`${WIDGET_FONT}`, 9);
            mileageText.textColor = fontColor;
            mileageText.textOpacity = 0.7;
        } catch (e) {
            console.error(e.message);
            kmContainer.addText(`获取里程失败`);
        }

        const carStatusContainer = leftContainer.addStack();
        carStatusContainer.setPadding(8, paddingLeft, 0, 0);

        const carStatusBox = carStatusContainer.addStack();
        carStatusBox.setPadding(3, 3, 3, 3);
        carStatusBox.layoutHorizontally();
        carStatusBox.centerAlignContent();
        carStatusBox.cornerRadius = 4;
        carStatusBox.backgroundColor = this.getFocusedBackgroundColor();

        try {
            const carStatusTxt = carStatusBox.addText(`${data.status.doorsGeneralState}`);

            let displayFont = WIDGET_FONT;
            let displayFontColor = fontColor;
            if (data.properties && !data.properties.areDoorsClosed) {
                displayFontColor = new Color(WIDGET_DANGER_COLOR, 1);
                displayFont = WIDGET_FONT_BOLD;
            }

            carStatusTxt.font = this.getFont(displayFont, 10);
            carStatusTxt.textColor = displayFontColor;
            carStatusTxt.textOpacity = 0.7;
            carStatusBox.addSpacer(5);

            let statusLabel = this.formatStatusLabel(data);
            const updateTxt = carStatusBox.addText(statusLabel);
            updateTxt.font = this.getFont(`${WIDGET_FONT}`, 10);
            updateTxt.textColor = fontColor;
            updateTxt.textOpacity = 0.5;
        } catch (e) {
            console.error(e.message);
            carStatusBox.addText(`获取车门状态失败`);
        }

        let locationStr = '';
        try {
            locationStr = data.properties.vehicleLocation.address.formatted;
        } catch (e) {}

        leftContainer.addSpacer();

        const locationContainer = leftContainer.addStack();
        locationContainer.setPadding(0, paddingLeft, 0, 0);
        if (renderMediumContent) {
            locationContainer.setPadding(0, paddingLeft, 16, 0);
        }
        const locationText = locationContainer.addText(locationStr);
        locationText.font = this.getFont(`${WIDGET_FONT}`, 10);
        locationText.textColor = fontColor;
        locationText.textOpacity = 0.5;
        locationText.url = this.buildMapURL(data);

        if (renderMediumContent) {
            const rightContainer = bodyContainer.addStack();
            rightContainer.setPadding(0, 0, 0, 0);
            rightContainer.layoutVertically();
            rightContainer.size = new Size(Math.round(width * 0.5), Math.round(height * 0.75));

            const carImageContainer = rightContainer.addStack();
            carImageContainer.bottomAlignContent();
            if (!this.userConfigData.show_control_checks) {
                carImageContainer.setPadding(0, 6, 0, paddingLeft);
            }

            let canvasWidth = Math.round(width * 0.45);
            let canvasHeight = Math.round(height * 0.55);

            let image = await this.getCarCanvasImage(data, canvasWidth, canvasHeight, 0.95);
            let carStatusImage = carImageContainer.addImage(image);
            carStatusImage.resizable = !this.userConfigData.show_control_checks;

            if (data.status && data.status.doorsAndWindows && data.status.doorsAndWindows.length > 0) {
                let doorWindowStatus = data.status.doorsAndWindows[0];

                let windowStatusContainer = rightContainer.addStack();
                windowStatusContainer.setPadding(6, 0, 12, 0);

                windowStatusContainer.layoutHorizontally();
                windowStatusContainer.addSpacer();

                let windowStatus = `${doorWindowStatus.title} ${doorWindowStatus.state} `;
                let windowStatusText = windowStatusContainer.addText(windowStatus);

                let displayFont = WIDGET_FONT;
                let displayFontColor = fontColor;
                if (data.properties && !data.properties.areWindowsClosed) {
                    displayFontColor = new Color(WIDGET_DANGER_COLOR, 1);
                    displayFont = WIDGET_FONT_BOLD;
                }

                windowStatusText.font = this.getFont(displayFont, 10);
                windowStatusText.textColor = displayFontColor;
                windowStatusText.textOpacity = 0.5;

                windowStatusContainer.addSpacer();
            }
        }

        w.url = 'de.bmw.connected.mobile20.cn://';

        return w;
    }

    async renderLarge(data) {
        let w = await this.renderMedium(data, true);
        const {width, height} = data.size['large'];
        w.setPadding(0, 0, 0, 0);
        w.addSpacer();
        let fontColor = this.getFontColor();

        let mapWidth = Math.ceil(width);
        let mapHeight = Math.ceil(height * 0.5);

        let paddingLeft = Math.round(width * 0.055);

        let largeExtraContainer = w.addStack();
        largeExtraContainer.layoutVertically();
        largeExtraContainer.bottomAlignContent();

        largeExtraContainer.size = new Size(mapWidth, mapHeight);

        if (this.userConfigData.map_api_key && this.userConfigData.map_api_key.length > 0) {
            let latLng = null;
            try {
                latLng =
                    data.properties.vehicleLocation.coordinates.longitude +
                    ',' +
                    data.properties.vehicleLocation.coordinates.latitude;
            } catch (e) {}

            let mapImage = await this.loadMapView(latLng, mapWidth, mapHeight, true);
            let widget = largeExtraContainer.addImage(mapImage);
            widget.centerAlignImage();
            widget.imageSize = new Size(mapWidth, mapHeight);
            largeExtraContainer.url = this.buildMapURL(data);

            return w;
        }

        const carImageContainer = largeExtraContainer.addStack();
        carImageContainer.setPadding(0, paddingLeft, 0, paddingLeft);

        if (!this.userConfigData.show_control_checks) {
            carImageContainer.layoutHorizontally();
            carImageContainer.addSpacer();
            carImageContainer.setPadding(paddingLeft, 0, paddingLeft, 0);
        }

        carImageContainer.bottomAlignContent();

        try {
            let canvasWidth = Math.round(width * 0.9);
            let canvasHeight = Math.round(height * 0.45);

            let image = await this.getCarCanvasImage(data, canvasWidth, canvasHeight, 0.85);
            let carStatusImage = carImageContainer.addImage(image);

            carStatusImage.resizable = !this.userConfigData.show_control_checks;
            carStatusImage.centerAlignImage();
            if (!this.userConfigData.show_control_checks) {
                carImageContainer.addSpacer();
            }
            carStatusImage.url = 'de.bmw.connected.mobile20.cn://';
        } catch (e) {
            console.log(e.message);
        }

        if (data.status && data.status.doorsAndWindows && data.status.doorsAndWindows.length > 0) {
            let doorWindowStatus = data.status.doorsAndWindows[0];

            let windowStatusContainer = largeExtraContainer.addStack();
            windowStatusContainer.setPadding(2, 0, 16, 0);

            windowStatusContainer.layoutHorizontally();
            windowStatusContainer.addSpacer();

            let windowStatus = `${doorWindowStatus.title} ${doorWindowStatus.state} `;
            let windowStatusText = windowStatusContainer.addText(windowStatus);

            let displayFont = WIDGET_FONT;
            let displayFontColor = fontColor;
            if (data.properties && !data.properties.areWindowsClosed) {
                displayFontColor = new Color(WIDGET_DANGER_COLOR, 1);
                displayFont = WIDGET_FONT_BOLD;
            }

            windowStatusText.font = this.getFont(displayFont, 10);
            windowStatusText.textColor = displayFontColor;
            windowStatusText.textOpacity = 0.5;

            windowStatusContainer.addSpacer();
        }

        return w;
    }

    getImageSize(imageWidth, imageHeight, canvasWidth, canvasHeight, resizeRate = 0.85) {
        let a = imageWidth;
        let b = imageHeight;

        if (a > canvasWidth || b > canvasHeight) {
            if (resizeRate >= 1) {
                resizeRate = 0.99;
            }
            a *= resizeRate;
            b *= resizeRate;
            return this.getImageSize(a, b, canvasWidth, canvasHeight);
        }

        return {width: a, height: b};
    }

    async getCarCanvasImage(data, canvasWidth, canvasHeight, resizeRate) {
        if (!this.userConfigData.show_control_checks) {
            try {
                let carImage = await this.getVehicleImage(data);

                return carImage;
            } catch (e) {
                console.log(e);
            }
        }

        let canvas = new DrawContext();
        canvas.size = new Size(canvasWidth, canvasHeight);
        canvas.opaque = false;
        canvas.setFont(this.getFont(WIDGET_FONT_BOLD, Math.round(canvasHeight / 3.5)));
        canvas.setTextColor(this.getFontColor());
        canvas.respectScreenScale = true;

            try {
                let checkControlMessages = this.getControlMessages(data);

                if (checkControlMessages && checkControlMessages.length == 0) {
                    canvas.drawTextInRect(
                        'ALL',
                        new Rect(
                            0, //
                            0,
                            Math.round(canvasWidth * 0.5),
                            Math.round(canvasWidth * 0.5)
                        )
                    );
                    canvas.drawTextInRect(
                        'GOOD',
                        new Rect(
                            0,
                            Math.round(canvasHeight / 4),
                            Math.round(canvasWidth * 0.5),
                            Math.round(canvasWidth * 0.5)
                        )
                    );
                } else {
                    let messageFontSize = Math.round(canvasHeight / 9);
                    let messageOffset = Math.round(messageFontSize * 1.5);

                    let exclamation = SFSymbol.named('exclamationmark.circle').image;
                    canvas.drawImageInRect(
                        exclamation,
                        new Rect(0, messageOffset, Math.round(messageFontSize * 1.2), Math.round(messageFontSize * 1.2))
                    );

                    canvas.setFont(this.getFont(WIDGET_FONT, messageFontSize));
                    canvas.setTextColor(this.getFontColor());

                    for (const checkControlMessage of checkControlMessages) {
                        canvas.drawTextInRect(
                            checkControlMessage.title,
                            new Rect(
                                Math.round(messageFontSize * 1.5),
                                messageOffset,
                                Math.round(canvasWidth * 0.5),
                                Math.round(canvasWidth * 0.5)
                            )
                        );

                        messageOffset = messageOffset + messageFontSize;
                    }
                }
            } catch (e) {
                console.log(e.message);
            }

        let carImage = await this.getVehicleImage(data);
        let imageSize = this.getImageSize(
            carImage.size.width,
            carImage.size.height,
            canvasWidth,
            canvasHeight,
            resizeRate
        );

        console.log('rate ' + imageSize.width / imageSize.height);
        console.log('imageSize ' + JSON.stringify(imageSize));

        canvas.drawImageInRect(
            carImage,
            new Rect(
                canvasWidth - imageSize.width, //
                canvasHeight - imageSize.height,
                imageSize.width,
                imageSize.height
            )
        );

        return canvas.getImage();
    }

    getFocusedBackgroundColor() {
        if (this.userConfigData.force_dark_theme) {
            return new Color('#fff', 0.2);
        }
        return Color.dynamic(new Color('#f5f5f8', 0.45), new Color('#fff', 0.2));
    }

    async loadMapView(latLng, width, height, useCache = true) {
        try {
            if (!this.userConfigData.map_api_key) {
                throw '获取地图失败，请检查API KEY';
            }

            width = parseInt(width);
            height = parseInt(height);

            let mapApiKey = this.userConfigData.map_api_key;

            let url = `https://restapi.amap.com/v3/staticmap?location=${latLng}&scale=2&zoom=15&size=${width}*${height}&markers=large,0x00CCFF,:${latLng}&key=${mapApiKey}`;

            console.log('load map from URL: ' + url);
            const cacheKey = this.md5(url);
            const cacheFile = FileManager.local().joinPath(FileManager.local().temporaryDirectory(), cacheKey);

            if (useCache && FileManager.local().fileExists(cacheFile)) {
                console.log('load map from cache');
                let data = Data.fromFile(cacheFile);
                let img = Image.fromData(data);
                return img;
            }

            console.log('load map from API');

            let req = new Request(url);

            req.method = 'GET';

            //const img = await req.loadImage();
            const res = await req.load();

            try {
                let fileManager = FileManager.local();
                fileManager.write(cacheFile, res);
                console.log(cacheFile + ' downloaded');
            } catch (e) {
                console.error(e.message);
            }

            // 存储到缓存
            //FileManager.local().writeImage(cacheFile, img);
            let data = Data.fromFile(cacheFile);
            let img = Image.fromData(data);
            return img;
        } catch (e) {
            console.log('load map failed');
            console.error(e.message);
            let canvas = new DrawContext();
            canvas.size = new Size(width, height);

            canvas.setFillColor(new Color('#eee'));
            canvas.fillRect(new Rect(0, 0, width, height));
            canvas.drawTextInRect(e.message || '获取地图失败', new Rect(20, 20, width, height));

            return await canvas.getImage();
        }
    }

    getControlMessages(data) {
        try {
            if (this.userConfigData.show_control_checks == 2) {
                return [];
            }

            let checkControlMessages = data.status.checkControlMessages.filter((checkControlMessage) => {
                return checkControlMessage['criticalness'] != 'nonCritical';
            });

            if (data.status.issues) {
                for (const key in data.status.issues) {
                    if (!data.status.issues[key]) {
                        continue;
                    }
                    if (data.status.issues[key]['title']) {
                        checkControlMessages.push(data.status.issues[key]);
                    }
                }
            }
            return checkControlMessages;
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    getFuelIndicators(fuelIndicators) {
        let _fuelObj = {
            levelValue: null,
            levelUnits: null,
            rangeValue: null,
            rangeUnits: null,
            chargingType: null
        };
        try {
            if (fuelIndicators.length == 1) {
                for (const key in _fuelObj) {
                    if (fuelIndicators[0][key] && !_fuelObj[key]) {
                        _fuelObj[key] = fuelIndicators[0][key];
                    }
                }
            } else {
                for (const fuelIndicator of fuelIndicators) {
                    if (!_fuelObj['rangeValue']) {
                        _fuelObj['rangeValue'] = Number(fuelIndicator['rangeValue']);
                        _fuelObj['rangeUnits'] = fuelIndicator['rangeUnits'];
                    }

                    if (Number(fuelIndicator['rangeValue']) >= _fuelObj['rangeValue']) {
                        _fuelObj['rangeValue'] = Number(fuelIndicator['rangeValue']);
                        _fuelObj['rangeUnits'] = fuelIndicator['rangeUnits'];
                    }
                }

                // if it is hyper vehicle, we are using range value as unit. eg 300km / 200km | 100km
                let unitText = '';
                for (const fuelIndicator of fuelIndicators) {
                    if (_fuelObj['rangeValue'] > fuelIndicator['rangeValue']) {
                        if (unitText != '') {
                            unitText += ' ';
                        }
                        unitText += `${fuelIndicator['rangeValue']}`;
                    }
                }
                _fuelObj['levelValue'] = unitText;
            }
        } catch (e) {}

        for (const key in _fuelObj) {
            if (!_fuelObj[key]) {
                _fuelObj[key] = '';
            }
        }

        return _fuelObj;
    }

    buildMapURL(data) {
        let locationStr = '';
        let latLng = '';

        try {
            locationStr = data.properties.vehicleLocation.address.formatted;
            latLng =
                data.properties.vehicleLocation.coordinates.longitude +
                ',' +
                data.properties.vehicleLocation.coordinates.latitude;
        } catch (e) {
            return '';
        }

        return `http://maps.apple.com/?address=${encodeURI(locationStr)}&ll=${latLng}&t=m`;
    }

    formatStatusLabel(data) {
        if (!data.status || !data.status.lastUpdatedAt) {
            return '';
        }

        let lastUpdated = new Date(data.status.lastUpdatedAt);
        const today = new Date();

        let formatter = 'MM-dd HH:mm';
        if (lastUpdated.getDate() == today.getDate()) {
            formatter = 'HH:mm';
        }

        let dateFormatter = new DateFormatter();
        dateFormatter.dateFormat = formatter;

        let dateStr = dateFormatter.string(lastUpdated);

        // get today

        return `${dateStr}更新`;
    }

    async getData(forceRefresh = false) {
        let accessToken = await this.getAccessToken(forceRefresh);

        if (!accessToken || accessToken == '') {
            return null;
        }

        try {
            await this.checkInDaily(accessToken);
        } catch (e) {
            console.error('Check In Error: ' + e.message);
        }

        return await this.getVehicleDetails(accessToken, forceRefresh);
    }

    async getAccessToken(forceRefresh = false) {
        let accessToken = '';
        let refreshToken = Keychain.get(MY_BMW_REFRESH_TOKEN);

        if (!forceRefresh && Keychain.contains(MY_BMW_TOKEN_UPDATE_LAST_AT)) {
            let lastUpdate = parseInt(Keychain.get(MY_BMW_TOKEN_UPDATE_LAST_AT));
            if (lastUpdate > new Date().valueOf() - 1000 * 60 * 50) {
                if (Keychain.contains(MY_BMW_TOKEN)) {
                    accessToken = Keychain.get(MY_BMW_TOKEN);
                }
            } else {
                if (Keychain.contains(MY_BMW_REFRESH_TOKEN)) {
                    // get refresh token
                    accessToken = await this.refreshToken(refreshToken);
                }
            }
        }

        if (accessToken && accessToken != '') {
            return accessToken;
        }

        accessToken = await this.refreshToken(refreshToken);

        return accessToken;
    }

    async ErrorPopup(ErrorText, Errormessage) {
        const messageAlert = new Alert();
        messageAlert.title = ErrorText;
        messageAlert.message = Errormessage;
        messageAlert.addCancelAction('取消');
        await messageAlert.presentAlert();
        Script.stop();
    }

    async refreshToken(refresh_token) {
        let req = new Request(BMW_SERVER_HOST + '/eadrax-coas/v1/oauth/token');
        req.headers = BMW_HEADERS;
        req.method = 'POST';
        req.body = `grant_type=refresh_token&refresh_token=${refresh_token}`;
        const res = await req.loadJSON();

        if (res.access_token !== undefined) {
            const {access_token, refresh_token} = res;

            Keychain.set(MY_BMW_TOKEN, access_token);
            Keychain.set(MY_BMW_REFRESH_TOKEN, refresh_token);
            Keychain.set(MY_BMW_TOKEN_UPDATE_LAST_AT, String(new Date().valueOf()));

            return access_token;
        } else {
            return '';
        }
    }

    async getVehicleDetails(accesstoken, forceRefresh = false) {
        let vin = this.userConfigData.vin || '';

        let lastUpdateKey = vin + MY_BMW_VEHICLE_UPDATE_LAST_AT;
        let localVehicleDataKey = vin + MY_BMW_VEHICLE_DATA;

        let cacheData = this.loadVehicleFromCache(vin);


        if (!forceRefresh && cacheData) {
            if (Keychain.contains(lastUpdateKey)) {
                let lastUpdate = parseInt(Keychain.get(lastUpdateKey));

                // if last check within 5 mins we return cache
                if (lastUpdate > new Date().valueOf() - 1000 * 60 * 5) {
                    console.log('从缓存中获取车辆数据');
                    // return cacheData;
                }
            }
        }

        let vehicleData = null;

        try {
            console.log('获取车辆信息');
            let req = new Request(BMW_SERVER_HOST + `/eadrax-vcs/v1/vehicles?appDateTime=${new Date().valueOf()}`);

            req.headers = {
                ...BMW_HEADERS,
                authorization: 'Bearer ' + accesstoken,
            };

            const vehicles = await req.loadJSON();

            if (vehicles && Array.isArray(vehicles) && vehicles.length > 0) {
                console.log('获取车辆VIN');
                if (vin && vin.length > 0) {
                    // if more than one vehicle
                    let vehicleFound = vehicles.find((vehicle) => {
                        return vehicle.vin && vehicle.vin.toUpperCase() == vin.toUpperCase();
                    });

                    if (vehicleFound) {
                        console.log('获取车辆VIN成功: ' + vin);

                        vehicleData = vehicleFound;
                    }
                }

                vehicleData = vehicleData || vehicles[0];

                if (vehicleData) {
                    Keychain.set(lastUpdateKey, String(new Date().valueOf()));
                    Keychain.set(localVehicleDataKey, JSON.stringify(vehicleData));

                    if (config.runsInApp) {
                        const confirmationAlert = new Alert();

                        confirmationAlert.title = '成功';
                        confirmationAlert.message =
                            '车辆信息获取成功，请在桌面配置小组件。更多小组件设置请点击 开始配置';

                        confirmationAlert.addCancelAction('跳过');
                        confirmationAlert.addAction('开始配置');

                        let userSelection = await confirmationAlert.presentAlert();

                        if (userSelection != -1) {
                            await this.userConfigInput();
                        }
                    }
                }
            }
        } catch (e) {
            if (config.runsInApp) {
                const confirmationAlert = new Alert();

                confirmationAlert.title = '错误';
                confirmationAlert.message = '尝试获取车辆信息失败，请重新尝试登录。';

                confirmationAlert.addCancelAction('确定');

                await confirmationAlert.presentAlert();
            }
        }

        // if vehicle data is not found we use cache
        return vehicleData && vehicleData.vin ? vehicleData : cacheData;
    }

    async loadVehicleFromCache(vin) {
        let localVehicleDataKey = vin + MY_BMW_VEHICLE_DATA;

        try {
            if (Keychain.contains(localVehicleDataKey)) {
                let cachedVehicleData = JSON.parse(Keychain.get(localVehicleDataKey));

                // load data every 5 mins
                if (cachedVehicleData && cachedVehicleData.vin) {
                    return cachedVehicleData;
                }
            }
        } catch (e) {
            console.log('从缓存加载车辆失败');
        }

        return null;
    }

    async checkInDaily(accesstoken) {
        let dateFormatter = new DateFormatter();
        const lastCheckIn = Keychain.contains(MY_BMW_LAST_CHECK_IN_AT) ? Keychain.get(MY_BMW_LAST_CHECK_IN_AT) : null;

        dateFormatter.dateFormat = 'yyyy-MM-dd';
        let today = dateFormatter.string(new Date());

        if (Keychain.contains(MY_BMW_LAST_CHECK_IN_AT)) {
            console.log('上次签到时间: ' + lastCheckIn);

            if (lastCheckIn == today) {
                console.log('用户今日已签到');

                return;
            }
        }

        console.log('开始JOY币自动签到');
        let req = new Request(BMW_SERVER_HOST + '/cis/eadrax-community/private-api/v1/mine/check-in');
        req.headers = {
            ...BMW_HEADERS,
            authorization: 'Bearer ' + accesstoken,
        };

        req.method = 'POST';
        req.body = JSON.stringify({signDate: null});

        const res = await req.loadJSON();

        if (Number(res.code) >= 200 && Number(res.code) <= 300) {
            Keychain.set(MY_BMW_LAST_CHECK_IN_AT, today);
        }

        let msg = `${res.message || ''}`;

        if (res.code != 200) {
            msg += `: ${res.businessCode || ''}, 上次签到: ${lastCheckIn || 'None'}.`;
            this.notify('My BMW签到', msg);
        }

        try {
            await this.fakeShareToGetMoreCoin(accesstoken);
        } catch (e) {
            console.error(e.message);
        }

        // check coin amount
        try {
            await this.getJoyCoinInfo(accesstoken);
        } catch (e) {
            console.error(e.message);
        }
    }

    async getJoyCoinInfo(accesstoken) {
        let req = new Request(BMW_SERVER_HOST + '/cis/eadrax-membership/api/v2/joy-list');

        req.headers = {
            ...BMW_HEADERS,
            authorization: 'Bearer ' + accesstoken,
        };

        req.method = 'POST';
        req.body = JSON.stringify({});

        const res = await req.loadJSON();
        if (res.code >= 200 && res.code < 300) {
            let message = `签到成功，当前共${res.data.joyCoin || 0} JOY币， ${res.data.joySocialHeader}`;
            console.log(message);
            this.notify('My BMW签到', message);
        }
    }

    async fakeShareToGetMoreCoin(accesstoken) {
        console.log('获取分享帖子');

        let req = new Request(BMW_SERVER_HOST + '/cis/eadrax-ocommunity/public-api/v1/article-list');
        req.headers = {
            ...BMW_HEADERS,
            authorization: 'Bearer ' + accesstoken,
        };

        req.method = 'POST';
        req.body = JSON.stringify({pageNum: 1, pageSize: 1, boardCode: 0});

        const res = await req.loadJSON();

        if (Number(res.code) >= 200 && Number(res.code) <= 300) {
            if (!res.data || !res.data.articleVos || !res.data.articleVos[0] || !res.data.articleVos[0].articleId) {
                throw 'No article found';
            }


            req = new Request(BMW_SERVER_HOST + '/cis/eadrax-oarticle/open/article/api/v2/share-article');

            req.headers = {
                ...BMW_HEADERS,
                authorization: 'Bearer ' + accesstoken,
            };

            req.method = 'POST';
            req.body = JSON.stringify({articleId: res.data.articleVos[0].articleId});

            const result = await req.loadJSON();

            return !!result;
        }

        return false;
    }

    async getBmwOfficialImage(data, useCache = true) {
        let url = `${BMW_SERVER_HOST}/eadrax-ics/v3/presentation/vehicles/${data.vin}/images?carView=VehicleStatus`;

        const cacheKey = this.md5(url);
        const cacheFile = FileManager.local().joinPath(FileManager.local().temporaryDirectory(), cacheKey);

        if (useCache && FileManager.local().fileExists(cacheFile)) {
            return Image.fromFile(cacheFile);
        }

        try {
            let accesstoken = '';
            if (Keychain.contains(MY_BMW_TOKEN)) {
                accesstoken = Keychain.get(MY_BMW_TOKEN);
            } else {
                throw new Error('没有token');
            }

            let req = new Request(url);

            req.method = 'GET';
            req.headers = {
                ...BMW_HEADERS,
                authorization: 'Bearer ' + accesstoken
            };

            const img = await req.loadImage();

            // 存储到缓存
            FileManager.local().writeImage(cacheFile, img);

            return img;
        } catch (e) {
            return this.loadDefaultImage();
        }
    }

    async getVehicleImage(data) {
        let imageCar = '';

        if (this.userConfigData.custom_vehicle_image) {
            try {
                imageCar = await this.getImageByUrl(this.userConfigData.custom_vehicle_image);
            } catch (e) {
                return this.loadDefaultImage();
            }
        } else {
            imageCar = await this.getBmwOfficialImage(data);
        }

        return imageCar;
    }

    async loadDefaultImage() {
        let defaultImage = "https://s1.ax1x.com/2023/03/19/ppYQKUg.png"

        let imageData = Data.fromBase64String(defaultImage);

        return Image.fromData(imageData);
    }

    getFont(fontName, fontSize) {
        if (fontName == 'SF UI Display') {
            return Font.systemFont(fontSize);
        }

        if (fontName == 'SF UI Display Bold') {
            return Font.semiboldSystemFont(fontSize);
        }
        return new Font(fontName, fontSize);
    }
}
await Running(Widget);
