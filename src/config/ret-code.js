/*
 * @author  xiezhiwen
 * 服务端返回码对照表
 */
const RetCode = {
  Success: 0, //成功
  Fail: -1, //失败
  ArgsError: 2, //参数错误
  UserExisted: 10, //用户已经存在
  UsernameOrPasswordError: 11, //用户名或者密码错误
  UserNotExist: 12, //用户不存在
  tokenError: -2, //token错误
  tokenNull: -3, //token为空
  Fulled: -4, //人数限制
  OverTime: -5, //活动过期
  CloseSignin: -6, //关闭签到
  SessionExpired: -7, //session过期
  Timeout: -8 //请求超时
};

module.exports = RetCode;
