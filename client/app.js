App({
  globalData: {
    token: '',
    user: null,
    baseUrl: 'http://localhost:3001/api'  // 部署时改为真实域名
  },

  onLaunch() {
    const token = wx.getStorageSync('token');
    const user  = wx.getStorageSync('user');
    if (token) {
      this.globalData.token = token;
      this.globalData.user  = user;
    }
  },

  // API 请求封装
  request(method, url, data) {
    return new Promise((resolve, reject) => {
      const header = { 'Content-Type': 'application/json' };
      if (this.globalData.token) {
        header['Authorization'] = 'Bearer ' + this.globalData.token;
      }

      wx.request({
        method,
        url: this.globalData.baseUrl + url,
        data,
        header,
        success: (res) => {
          if (res.data.ok) {
            resolve(res.data);
          } else {
            wx.showToast({ title: res.data.message || '请求失败', icon: 'none' });
            reject(res.data);
          }
        },
        fail: (err) => {
          wx.showToast({ title: '网络错误', icon: 'none' });
          reject(err);
        }
      });
    });
  },

  get(url, data)    { return this.request('GET', url, data); },
  post(url, data)   { return this.request('POST', url, data); }
});
