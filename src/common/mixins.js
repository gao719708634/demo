//全局mixins
import { getAttribute } from '@/common/util.js';
import userReq from '@/api/user';
import LibIcon from '@/config/lib-icon';
import config from '@/config/default-setting';
import { mapState, mapActions, mapMutations } from 'vuex';
export const globalMixins = {
  components: {},
  data() {
    return {
      LibIcon,
      loadingObj: {}, //loading 对象
      successCode: 2000000 // 服务器返回成功code
    };
  },
  computed: {
    userinfo() {
      return this.$store.getters.userinfo;
    },
    appLang() {
      return this.$store.state.lang;
    }
  },
  created() {
    // console.log('mixins---height' this.clientHeight);
  },
  mounted() { },
  methods: {
    // 把json变成字符串
    _jsonToString(data) {
      try {
        return JSON.stringify(data);
      } catch (e) {
        this.$log(`jsonToString error: ${e.message}`);
      }
      return '';
    },
    _jsonParse(str) {
      if (str === '') {
        return {};
      } else {
        try {
          return JSON.parse(str);
        } catch (e) {
          this.$log(`jsonParse error: ${e.message}`);
        }
        return {};
      }
    },
    _clone(obj = {}) {
      try {
        return this._jsonParse(this._jsonToString(obj));
      } catch (e) {
        return '';
      }
    },
    //改变url 参数
    _changeParams(newParams, isKeep) {
      let querys = Object.assign(
        { ...this.$router.currentRoute.query },
        newParams
      );
      for (let key in querys) {
        if (
          querys[key] === '' ||
          (key === 'page' && querys[key] == '1') ||
          querys[key] == '' ||
          (key === 'cid' && querys[key] == '') ||
          (key === 'tab' && (querys[key] == '0' || querys[key] == '1'))
        ) {
          delete querys[key];
        }
      }
      // if (querys['keepObj']) {
      //   delete querys['keepObj'];
      // }
      this.$router.push({ query: querys });
    },
    // 获取地址栏page参数
    _getPage() {
      return Number(this.$route.query.page || 1);
    },
    //通过id获取对象name,如果key为真时key代替name
    getNameById(id, obj = {}, key) {
      id = Number(id);
      if (!key) {
        key = 'name';
      }
      for (let item of obj) {
        if (id == item.id) {
          return item[key];
        }
      }
      return '';
    },
    getArraysByKey(key, arr = []) {
      let res = [];
      if (arr.constructor === Object) {
        arr = [arr];
      }
      for (let item of arr) {
        if (item.hasOwnProperty(key)) {
          res.push(item[key]);
        }
      }
      return res;
    },
    getArrObjectIndex(arr, id, key = 'id') {
      for (let i = 0; i < arr.length; i++) {
        if (id === arr[i][key]) {
          return i;
        }
      }
      return -1;
    },
    //通过moment格式化时间
    formatTime(momentObj, format = 'YYYY-MM-DD HH:mm:ss') {
      return (momentObj || this.moment).format(format);
    },
    //事件分派
    operationClick(e, item) {
      const rel = getAttribute(e.target, 'rel', 2);
      if (rel) {
        this[`${rel}Event`](item);
      } else {
        console.log('null Event');
      }
    },
    //所有请求前置、过滤器
    reqFilter(reqName, params, configs, fn) {
      let method = '';
      let userExp = reqName.match(new RegExp(/^user\.([a-zA-Z0-9]*)/)); // 用户api
      if (userExp && userExp.length > 1) {
        method = userReq[userExp[1]];
      }
      try {
        return method(params, configs).then(r => {
          if (fn && typeof fn === 'function') {
            fn(r);
          } else {
            const code = r.state.code;
            if (code === -1) {
              //token过期
              this.$ls.remove('access_token');
              this.$router.replace({
                path: '/'
              });
              return r;
            } else if (code === -8) {
              // this.$message.warning(r.state.msg);
              return r;
            }
            if (code === -10) {
              console.log('cancel request');
            } else {
              return r;
            }
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
    //获取N位长度的随机字符
    getUuid(num = 17, hexDigits = '0123456789') {
      let s = [];
      for (let i = 0; i < num; i++) {
        let n = hexDigits.substr(Math.floor(Math.random() * 10), 1);
        s.push(n);
      }
      return s.join('');
    },
    _changeLang(lang) {
      console.log('in changeLanguage', lang, this.appLang);
      if (this.appLang !== lang) {
        localStorage.setItem('3i_lang', lang);
        this.$i18n.locale = lang;
        this.$Local(lang);
        window.location.reload();
      }
    },
    /**
     * 根据要配置的内容标识
     * @param {String} text
     * @param {String} key
     * @param {string} temp
     * @return {String} html
     */
    matchContent(cont, key) {
      if (!key) {
        return cont;
      }
      let reg = new RegExp('(' + key + ')', 'gim');
      return cont.replace(reg, '<span class="font-danger">$1</span>');
    },
    _decode(v = '') {
      return decodeURIComponent(v);
    },
    _encode(v = '') {
      return encodeURIComponent(v);
    },
    /**
     * 全局唯一标识 避免出现上传重复文件的问题，腾讯云是上传重复文件的时候会覆盖掉
     */
    guid() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return (
        S4() +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        S4() +
        S4()
      );
    },
    // 递归去掉联级选择器 最后一层有children
    getTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          delete data[i].children;
        } else {
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    // input textarea 输入字数控制， 参数($event, 长度， v-model对象， key)
    widthCheck(str, len, obj, key) {
      var temp = 0;
      for (var i = 0; i < str.length; i++) {
        if (/[\u4e00-\u9fa5]/.test(str[i])) {
          temp += 2;
        } else {
          temp++;
        }
        if (temp > len) {
          str = str.substr(0, i);
        }
      }
      obj[key] = str;
    },
    // tree 根据id获取路径
    getPathByKey(value, key, arr, getKey) {
      let temppath = [];
      try {
        let getNodPath = function (node) {
          temppthpush(getKey ? node[getKey] : node);
          if (Number(node[key]) === Number(value)) {
            throw 'GOT IT!';
          }
          if (node.children && node.children.length > 0) {
            for (var i = 0; i < node.children.length; i++) {
              getNodePath(node.children[i]);
            }
            temppath.pop();
          } else {
            temppath.pop();
          }
        };
        for (let i = 0; i < arr.length; i++) {
          getNodePath(arr[i]);
        }
      } catch (e) {
        return temppath;
      }
    },
    getSimpleText(html) {
      //富文本提取纯文本
      let re1 = new RegExp('<.+?>', 'g');
      return html ? html.replace(re1, '') : '';
    },
    getQueryStringByName(name) {
      var result = location.hash.match(
        new RegExp('[?&]' + name + '=([^&]+)', 'i')
      );
      if (result == null || result.length < 1) {
        return '';
      }
      return result[1];
    },
    // 下载资源，url资源地址，isPic图片为true， fileName下载的文件名
    downloadRes(url, isPic, fileName) {
      if (!url) {
        this.$message.warning('资源地址有误！');
        return;
      }
      if (isPic) {
        fetch(url).then(res =>
          res.blob().then(blob => {
            let a = document.createElement('a');
            let url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
          })
        );
      } else {
        let iframe = document.getElementById('download_iframe');
        if (iframe) {
          iframe.parentNode.removeChild(iframe);
          iframe = '';
        }
        iframe = document.createElement('iframe');
        iframe.id = 'download_iframe';
        iframe.src = url;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }
    }
  }
};
