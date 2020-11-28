//cos mixins
import { fileIsPic } from '@/common/util';
export const cosMixins = {
  data() {
    return {};
  },
  created() {},
  methods: {
    /**
     * 腾讯云-上传
     * @param {Object} 上传文件对象
     * @signCb {Object}  签名信息
     * @successFn {Function}  成功回调
     * @onProgressFn {Function}  上传过程回调
     * @failFn {Function}  失败回调
     * @onTaskReadyFn {Function}  上传任务创建回调
     */
    cosPutFn(data, signCb, successFn, onProgressFn, failFn, onTaskReadyFn) {
      let _this = this;
      _this.cos.putObject({
          Bucket: signCb.bucketName, // 必须
          Region: signCb.region, // 存储桶所在地域，必须字段
          CacheControl: fileIsPic(data.file.name) ? 'no-cache' : '', // 上传图片时加上no-cache,不然下载时会跨域，腾讯云的问题
          Key: signCb.sourceStorePath, // 必须
          Body: data.file, // 上传文件对象
          onProgress: function (progressData) {
            onProgressFn && onProgressFn(progressData);
          },
          onTaskReady: function (taskId) { //上传任务创建时的回调函数，返回一个 taskId，唯一标识上传任务，可用于上传任务的取消（cancelTask），停止（pauseTask）和重新开始（restartTask）
            onTaskReadyFn && onTaskReadyFn(taskId);
          }
        },
        function (err, cos_data) {
          if (cos_data && cos_data.statusCode === 200) {
            //上传成功得到的资源地址
            let successData = {
              path: 'https://' + signCb.bucketName + '.cos.ap-guangzhou.myqcloud.com' + signCb.sourceStorePath,
              folder: signCb.sourceStorePath,
              onlyFileName: signCb.fileName, // cos 唯一文件名标识
              localFileName: data.file.name, // 本地上传时原来的文件名
              resType: signCb.resType
            };
            successFn(successData);
          } else {
            // _this.$message.error(`上传失败: ${err.error}`);
            failFn && failFn(err);
          }
        });
    },
    /**腾讯云- 删除文件 或 终止上传
     *  @row {Object}  进行中的传taskId 结束的传fileIdKey 
     *  @signCb {Object}  签名信息
     *  @successFn {Function}  成功回调
     *  @failFn {Function}  失败回调
     */
    cosDeleteFn(row, signCb, successFn, failFn, onlyCanelTask = false) {
      let _this = this;
      console.log('cosDeleteFn', row);
      try {
        let ex = !row.fileIdKey ? false : _this.cosCheck(row.fileIdKey, signCb);

        if (!ex || onlyCanelTask) { // 上传任务的取消
          // console.log(`cosDeleteFn-taskid${taskId}`);
          _this.cos.cancelTask(row.taskId); //读取对应的taskId 取消进行中的任务
          successFn && successFn();
        } else { // 已上传的删除
          _this.cos.deleteObject({
              Bucket: signCb.bucketName, // 必须
              Region: signCb.region, // 存储桶所在地域，必须字段
              Key: row.fileIdKey // 必须  能删文件 不能删文件夹
            },
            function (err, data) {
              // console.log(err || data);
              if (data && data.statusCode === 204) {
                console.log(`cosDeleteFn-204:${err}-${data}`);
                successFn && successFn(err, data);
              } else {
                _this.$message.error(`删除失败: ${err.error}`);
                failFn && failFn(err, data);
              }
            }
          );
        }
      } catch (err) {
        console.log(`cosDeleteFn-catch:${err}`);
        successFn && successFn(err);
      }
    },
    /**
     * 腾讯云- 查询是否存在
     * @param {Object} 文件key
     * @signCb {Object} 签名信息
     * @return {Boolean} 
     */
    async cosCheck(fileIdKey, signCb) {
      let res = false; // 是否找到
      await this.cos.headObject({
          Bucket: signCb.bucketName, // 必须
          Region: signCb.region, // 存储桶所在地域，必须字段
          Key: fileIdKey // 必须
        },
        function (err, data) {
          if (data && data.statusCode == 200) {
            console.log('已存在');
            res = true;
          } else {
            console.log('不存在');
          }
        }
      );
      return res;
    },
    /**
     * 腾讯云-复制文件
     * @param {Object} 文件key
     * @param {string} 目的路径
     * @param {Function} 迁移过程
     * @param {Function} 成功函数
     * @param {Function} 失败函数
     * @return {String}
     */
    cosCopyFn(row, url) {
      let _this = this;
      _this.cos.sliceCopyFile({
          Bucket: signCb.bucketName, // 必须
          Region: signCb.region, // 存储桶所在地域，必须字段
          Key: row.fileIdKey, // 必须
          CopySource: 'https://' + signCb.bucketName + '.cos.ap-guangzhou.myqcloud.com' + url, // 必须
          onProgress: function (progressData) {
            // 非必须
            console.log(JSON.stringify(progressData));
          }
        },
        function (err, data) {
          console.log(err || data);
        }
      );
    },
    // 腾讯云-下载  鉴于下载的是流 暂时用不上
    cosDownLoadFn(fileIdKey) {
      let _this = this;
      _this.cos.getObject({
          Bucket: signCb.bucketName, // 必须
          Region: signCb.region, // 存储桶所在地域，必须字段
          Key: fileIdKey // 必须
        },
        function (err, res) {
          console.log('cosDownLoadFn：', err || res);
          // console.log('cosDownLoadFn：', err || res.Body);

          // 利用a标签自定义下载文件名
          const link = document.createElement('a');
          // 创建Blob对象，设置文件类型
          // const fileType = res.headers.content-type;
          let blob = new Blob([res.Body], {
            type: 'image/jpeg'
          });
          let objectUrl = URL.createObjectURL(blob); // 创建URL
          link.href = objectUrl;
          link.download = 'aaa'; // 自定义文件名
          link.click(); // 下载文件
          URL.revokeObjectURL(objectUrl); // 释放内存
        }
      );
    },
  }
};
