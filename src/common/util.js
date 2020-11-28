//公共方法

/**
 * 获取
 * @param  {object} target 
 * @param  {String} attr 属性
 * @return {String}
 */
function getAttribute(target, attr, level) {
  let attrVal = target.getAttribute(attr);
  if (attrVal === null && level) {
    try {
      return arguments.callee(target.parentNode, attr, level - 1);
    } catch (e) {
      return '';
    }
  } else {
    return attrVal;
  }
};


/**
 * 计算字符长度
 * @param {String} text
 * @return {String} cutString
 */
function byteLen (text) {
  let len = text.length;
  let matcher = text.match(/[^\x00-\xff]/g);
  if (matcher) {
    len += matcher.length;
  }
  return len;
};


/**
 * 以字节为长度计算单位截取字符串，一个字两个字节
 * @param {String} text
 * @param {Number} length
 * @param {Boolean} ellipsis 是加省略号
 * @return {String} cutString
 */
function byteCut (str, length, addEllipsis) {
  let wlen = byteLen(str);
  if (wlen > length) {
    // 所有宽字用&&代替
    let c = str.replace(/&/g, ' ').replace(/[^\x00-\xff]/g, '&&');
    // c.slice(0, length)返回截短字符串位
    str = str.slice(0, c.slice(0, length)
      // 由位宽转为JS char宽
      .replace(/&&/g, ' ')
      // 除去截了半个的宽位
      .replace(/&/g, '').length
    );
    if (addEllipsis) {
      str += '...';
    }
  }
  return str;
};

/**
 * 删除对象指定的属性并返回该值
 * @param {Object} obj
 * @param {String} keys 多个用，号隔开
 * @return {String | Array} String 
 */
function removeProperty (obj = {}, keys) {
  const v = [];
  keys.split(',').forEach(key => {
    if (obj.hasOwnProperty(key)) {
      const val = obj[key];
      delete obj[key];
      v.push(val);
    } else {
      v.push('');
    }
  });
  if (v.length === 1) { //只有一个参数时返回string
    return v.join('');
  } 
  return v;
};

//把Object转成&的string
function queryString(obj = {}) {
  let arr = [];
  for (let k in obj) {
    let ov = obj[k];
    k = encodeURIComponent(k);
    let type = typeof ov;
    if (type === 'undefined') {
      arr.push(k, '=&');
    } else if (type !== 'function' && type !== 'object'){
      arr.push(k, '=', encodeURIComponent(ov), '&');
    } else if (ov instanceof Array){
      if (ov.length) {
        for (let i = 0, len = ov.length; i < len; i++) {
          arr.push(k, '=', encodeURIComponent(ov[i] === undefined ? '' : ov[i]), '&');
        }
      } else {
        arr.push(k, '=&');
      }
    } else if (type === 'object'){
      // 例如'extra_params':{'interview_id':'27'}形式
      for (let kk in ov) {
        arr.push(k, '[', kk, ']', '=', encodeURIComponent(ov[kk]), '&');
      }
    }
  }
  arr.pop();
  return arr.join('');
};

// // 读取cookie   
// function getCookie(name) {
//   if (document.cookie.length > 0) {
//     let c_start = document.cookie.indexOf(name + '=');
//     if (c_start !== -1) {
//       c_start = c_start + name.length + 1;
//       let c_end = document.cookie.indexOf(';', c_start);
//       if (c_end === -1) {
//         c_end = document.cookie.length;
//       }
//       return unescape(document.cookie.substring(c_start, c_end));
//     }
//   }
//   return '';
// };

//把选择的直播时间转成秒,如(02:15)
function changeLiveTime(orgTime) {
  let result = 0;
  if (orgTime) {
    let arr = orgTime.split(':');
    result = Number(arr[0]) * 3600 + Number(arr[1]) * 60;
  }
  return result;
}


// 秒数转 AA:BB,如果要显示全(01:25:00)isAll 为true
function formatSeconds(value, isAll) {
  let h = 0, i = 0, s = parseInt(value);
  if (s >= 60) {
    i = parseInt(s / 60);
    s = parseInt(s % 60);
    if (i >= 60) {
      h = parseInt(i / 60);
      i = parseInt(i % 60);
    }
  }
  // 补零
  var zero = function(v) {
    return (v >> 0) <10 ? '0' + v : v;
  };
  let result = [zero(h), zero(i), zero(s)].join(':');
  if (isAll) {
    return result;
  } else {
    return result.slice(0, -3);
  }
}

function isTreeId(fid, treeData) {

  let res = false;
  if (treeData.length === 0) {
    return res;
  }
  let _isTreeId = function(id, data) {
    for (let i=0; i<data.length; i++) {
      if (Number(data[i].id) === Number(id)) {
        res = true;
        break;
      }
      if (data[i].children && data[i].children.length) {
        _isTreeId(id, data[i].children);
      }
    }
  };
  _isTreeId(fid, treeData);
  return res;
}

// const IMGARR = ['jpg', 'jpeg', 'png', 'gif'];
// const PDFARR = ['pdf', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'doc', 'docx'];
function judgementCover (item, retureOrg) {
  return item.thumbnailUrl || this.getIcon(19);
  // let fileExt = (item.fileExt || 'ext').toLocaleLowerCase();
  // if (IMGARR.includes(fileExt)) { // 图片
  //   if (retureOrg) {
  //     return item.thumbnailUrl;
  //   } else {
  //     return this.getIcon(5);
  //   }
  // } else if (PDFARR.includes(fileExt)) { // word之类
  //   return this.getIcon(fileExt);
  // } else {
  //   return this.getIcon(fileExt);
  // }
}

// 判断语言类型，暂时只支持中、英
function languageType () {
  let lang = localStorage.getItem('3i_lang');
  if (!lang) {
    let browserLang = navigator.browserLanguage ? navigator.browserLanguage : navigator.language;
    if (browserLang.indexOf('zh') > -1) {
      lang = 'cn';
    } else {
      lang = 'en';
    }
  }
  return lang;
}

function fileIsPic (fileName, fileExt) {
  try {
    return ['jpg', 'jpeg', 'png', 'bmp', 'gif'].includes(fileExt || fileName.split('.').pop().toLocaleLowerCase());
  } catch (e) {
    return false;
  }
}

module.exports = { 
  getAttribute, 
  byteLen, 
  byteCut, 
  removeProperty, 
  queryString, 
  changeLiveTime, 
  formatSeconds, 
  isTreeId,
  judgementCover,
  languageType,
  fileIsPic
};
