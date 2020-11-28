/**
 * 取time的日期段
 * @param  {String} fullTime 时间
 * @return {String}
 */
// export function getFullTimeDate (fullTime) {
//   if (fullTime) {
//     return fullTime.split(' ')[0];
//   }  
//   return '';
// };


const obj = {
  /**
   * 取time的日期段
   * @param  {String} fullTime 时间
   * @return {String}
   */
  getFullTimeDate (fullTime) {
    if (fullTime) {
      return fullTime.split(' ')[0];
    }  
    return '';
  },
  /**
   * 计算字符长度
   * @param {String} text
   * @return {String} cutString
   */
  byteLen (text) {
    if (text) {
      let len = text.length;
      let matcher = text.match(/[^\x00-\xff]/g);
      if (matcher) {
        len += matcher.length;
      }
      return len;
    }
  },
  /**
   * 以字节为长度计算单位截取字符串，一个字两个字节
   * @param {String} text
   * @param {Number} length
   * @param {Boolean} ellipsis 是加省略号
   * @return {String} cutString
   */
  byteCut (str, length, addEllipsis) {
    let wlen = obj.byteLen(str);
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
  }
};

module.exports = obj;