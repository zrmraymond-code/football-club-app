const app = getApp();

// 登录
function login(e) {
  return new Promise((resolve) => {
    wx.login({
      success: (res) => {
        const rawData = e && e.detail ? e.detail.rawData : '{}';
        app.post('/auth/wx-login', { code: res.code, rawData }).then(data => {
          app.globalData.token = data.token;
          app.globalData.user  = data.user;
          wx.setStorageSync('token', data.token);
          wx.setStorageSync('user', data.user);
          resolve(data.user);
        });
      }
    });
  });
}

// 检查登录态
function checkLogin() {
  const user = app.globalData.user;
  if (!user) {
    wx.navigateTo({ url: '/pages/mine/mine' });
    return null;
  }
  return user;
}

module.exports = { login, checkLogin };
