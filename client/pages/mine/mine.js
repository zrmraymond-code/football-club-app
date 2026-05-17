const app = getApp();
const auth = require('../../utils/auth');

Page({
  data: { user: null },

  onShow() {
    this.setData({ user: app.globalData.user });
  },

  onLogin(e) {
    auth.login(e).then(() => {
      this.setData({ user: app.globalData.user });
      wx.showToast({ title: '登录成功', icon: 'success' });
    });
  },

  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.globalData.token = '';
          app.globalData.user = null;
          wx.removeStorageSync('token');
          wx.removeStorageSync('user');
          this.setData({ user: null });
        }
      }
    });
  },

  goPage(e) { wx.navigateTo({ url: e.currentTarget.dataset.url }); },

  showAttendance() {
    if (!app.globalData.user) return;
    const { user_id } = app.globalData.user;
    app.get(`/activity/mine/${user_id}`).then(d => {
      const info = d.list.map(a => `· ${a.title} (${a.start_time})`).join('\n');
      wx.showModal({
        title: '我的报名',
        content: info || '暂无报名记录',
        showCancel: false
      });
    });
  },

  showMatches() {
    wx.showModal({
      title: '我的赛事',
      content: '功能开发中，敬请期待',
      showCancel: false
    });
  }
});
