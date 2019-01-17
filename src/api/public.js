import axios from 'axios'
/**请求配置 */
axios.defaults.timeout = 2*60*60*1000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www=form-urlencoded'
let port = '';
/**请求方法*/
export default {
  fetchGet(url, data={}) {//传参get
    let params = data.params ? this.setParams(data.params) : {};
    return new Promise((resolve, reject) => {
      axios.get(this.getPocPort() + url, {
        params
      }).then(res => {
        if (res.data.status===200) {
          resolve(res.data)
        } else {
          if (data.Vue) {
            data.Vue.$message.error(res.data.message);
          }
          reject();//错误自行处理回调
        }
      }).catch(error => {
        if (data.Vue) {
          data.Vue.$message.error('系统异常');
        }
      })
    })
  },
  fetchQuickSearch(url,Vue) {//不传参get
    return new Promise((resolve, reject) => {
      axios.get(this.getPocPort() + url).then(res => {
        if (res.data.status===200) {
          resolve(res.data)
        } else {
          if (Vue) {
            Vue.$message.error(res.data.message);
          }
          reject();//错误自行处理回调
        }
      }).catch(error => {
        if (Vue) {
            Vue.$message.error('系统异常');
        }
      })
    })
  },
  fetchPost(url, data={},progressCall) {//fromData提交
    let params = '';
    if(data.update){
      params = data.params;
    }else{
      params = data.params ? this.setParams(data.params) : {};
      url = this.getPocPort() + url
    }
    return new Promise((resolve, reject) => {
      axios({url,
             method:'post', 
             data:params,
             onUploadProgress:function(e){
                     if(progressCall)progressCall(e);//返回上传进度
             }}).then(res => {
       if (res.data.status===true||res.data.status===200||res.data.result) {
          resolve(res.data)
        } else {
          if (data.Vue) {
            data.Vue.$message({
              showClose: true,
              message: res.data.message,
              duration:1500,
              type: 'error'
            });
          }
          if(reject) reject();//错误自行处理回调
        }
      }).catch(error => {
        if (data.Vue) {
          data.Vue.$message({
            showClose: true,
            message: '系统异常',
            duration:1500,
            type: 'error'
          });
          if(reject) reject();//错误自行处理回调
        }
      })
    })
  },
  fetchPostJson(url, data={}) {//json提交
    return new Promise((resolve, reject) => {
      axios.post(this.getPocPort() + url, data.params).then(res => {
        if (res.data.status===200) {
          resolve(res.data)
        } else {
          if (data.Vue) {
            data.Vue.$message.error(res.data.message);
          }
          reject();//错误自行处理回调
        }
      }).catch(error => {
        if (data.Vue) {
          data.Vue.$message.error('系统异常');
        }
      })
    })
  },
  setParams(params) {//表单提交格式处理
    let fdata = new URLSearchParams();
    for (let attr in params) {
      if(params[attr]!==null&&params[attr]!==undefined){//去除多余属性
        fdata.append(attr, params[attr]);
      }
    }
    return fdata;
  },
  getPocPort() {//获取本地端口
    if (!port) {
      port = localStorage.getItem('jcChatPort');
    }
    return port;
  }
}
