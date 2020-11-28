//上传 mixins
import COS from 'cos-js-sdk-v5';
import {
  cosMixins
} from '@/common/cos-mixins2.0.js'; //腾讯云 cos
export const uploadMixins = {
  mixins: [cosMixins],
  data() {
    return {
      cos: null, //cos实例默认是null
      tcVod: null, //云点播的实例默认是null
      // config: {}
    };
  },
  created() {},
  methods: {
    // 上传前 尺寸拦截
    beforeUpload(file) {
      if (file.size === 0) {
        this.$message.warning('');
        return false;
      }
      if (this.examineFileType(file, true) === false) {
        return false;
      }
      if (file.size > 1024 * 1024 * 1024) {
        //文件过大时
        // this.$message.error("尺寸过大");
        return false;
      }
    },
    uploadChange(file) {
      if (this.examineFileType(file) === false || file.size === 0) {
        return;
      }
    },
    examineFileType(file, tips = false) {
      // console.log(file, tips);
      if ((file.raw && file.raw.type === '') || file.type === '') {
        // 特殊电脑在上传docx、xlsx之类的文件会没有后缀
        if (/\.[a-z]{3}x?$/i.test(file.name) === false) {
          tips && this.$message.warning('');
          return false;
        }
      }
      return true;
    },
    /**
     * 开始授权签名 获取上传签名
     * @data {Object} 上传文件对象
     */
    async startGetSign(data) {
      let _this = this;

      // 同步获取密钥签名配置
      let getSignCb = await _this.reqFilter('student.getSign', {
        fileName: data.file.name
      }, {
        noCancel: true,
        selfHandle: true 
      }).then(res => {
        if (res) {
          _this.instantiation(res.data);
          return res.data;
        } else {
          this.$message.error('签名获取失败，请检查'); //签名失败
          return false;
        }
      }).catch(r => {
        return false;
      });

      return getSignCb;
    },
    /**
     * 实例化上传 
     * @signCb {Object} 签名对象
     */
    instantiation(signCb) {
      let _this = this;
      // 实例化
      if (signCb.resType == 2 || signCb.resType == 5) {
        _this.tcVod = new TcVod({
          getSignature: function () { //签名
            return signCb.vodSignature
          }
        });
      } else {
        _this.cos = _this.cos || new COS({
          getAuthorization: function (options, callback) { //必选参数
            callback({
              TmpSecretId: signCb.tmpSecretId,
              TmpSecretKey: signCb.tmpSecretKey,
              XCosSecurityToken: signCb.sessionToke,
              StartTime: signCb.startTime, // 时间戳，单位秒，如：1580000000 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
              ExpiredTime: signCb.expiredTime // 时间戳，单位秒，如：1580000900
            });
          },
          // 可选参数
          FileParallelLimit: 9, // 控制文件上传并发数
          ChunkParallelLimit: 9, // 控制单个文件下分片上传并发数
          ProgressInterval: 100 // 控制上传的 onProgress 回调的间隔
        });
      }
    },
    /**
     * 上传公共事件
     * @data {Object} 上传文件对象
     * data 结构：{ file: File|Blob }
     */
    async commonUploadFn(data, successFn, onProgressFn, failFn, onTaskReadyFn) {
      let signCb = await this.startGetSign(data);
      if (!signCb) {
        failFn && failFn("签名失败结束操作");
        return false; //签名失败结束操作
      }
      // 事件分发
      if (signCb.resType == 2 || signCb.resType == 5) {
        await this.cloudUpload(data, signCb, successFn, onProgressFn, failFn, onTaskReadyFn);
      } else {
        await this.cosPutFn(data, signCb, successFn, onProgressFn, failFn, onTaskReadyFn);
      }
    },
    /** 删除公共事件 》删除文件 或 终止上传
     *  @row {Object}  
     *          fileName： 必传 用于获取类型 
     *          taskId： 非音视频 上传中的传 
     *          fileIdKey： 非音视频 已上传了的传
     *          uid：  音视频 上传中的传
     */
    async commonDeleteFn(row, successFn, failFn, onlyCanelTask = false) {
      let data = {
        file: {
          name: row.fileName
        }
      };
      let signCb = await this.startGetSign(data);
      if (!signCb) {
        failFn && failFn("签名失败结束操作");
        return false; //签名失败结束操作
      }
      if (signCb.resType == 2 || signCb.resType == 5) {
        this.cancelPostFn(row, successFn, failFn); //只有取消没有删除
      } else {
        this.cosDeleteFn(row, signCb, successFn, failFn, onlyCanelTask); //有取消有删除
      }
    }
  }
};