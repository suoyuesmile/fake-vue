function FakeVue(options) {
    this._init(options)
}
FakeVue.prototype = {
    constructor: FakeVue,
    _init(options) {
        console.log('fv init start!')
        
        options = this.$options = options;
        console.log(options);
        this._initData();
    },
    _initData() {
        let data = this.$options.data;
        data = this._data = typeof data === 'function' ? data() : data || {};

        const keys = Object.keys(data);

        // 代理
        keys.forEach(key => {
            this._proxy(this, '_data', key);
        })

        // console.log(this.message);

        observe(this._data);
    },

    _proxy(target, sourceKey, key) {
        Object.defineProperty(target, key, {
            enumerable: true,
            configurable: true,
            get() {
                return this[sourceKey][key];
            },
            set(val) {
                this[sourceKey][key] = val;
            }
        })
    }
}

function observe(value) {
    if (!value || typeof value !== 'object') {
        return;
    }

    new Observer(value)
}

function Observer(value) {
    this.value = value;
    

    if (Array.isArray(value)) {
        // this.observeArray(value);
    } else {
        this.walk(value)
    }
}

// 管理watcher
let uid = 0;
Dep.target = null;
function Dep() {
    this.id = uid++;
    this.subs = [];
}

Dep.prototype = {
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    },
    notify() {
        console.log('notify');
        // this.subs.forEach(watcher => {
        //     watcher.update();
        // })
    }
}

Observer.prototype.walk = function (obj) {
    for (let key in obj) {
        defineReactive(obj, key, obj[key]);
    }
}

function defineReactive(obj, key, val) {
    const dep = new Dep();
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            if (Dep.target) {
                dep.depend();
            }
            // 递归劫持
            // 劫持数组
            return val;
        },
        set(newVal) {
            if (val === newVal) {
                return;
            }

            val = newVal;
            // 递归劫持
            dep.notify();
        }
    })
}




