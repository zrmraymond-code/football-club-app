const app = getApp();
const auth = require('../../utils/auth');

Page({
  data: { act: {}, signedUp: false },

  onLoad(opt) {
    this.activityId = opt.id;
    this.loadDetail();
  },

  loadDetail() {
    app.get(`/activity/detail/${this.activityId}`).then(d => {
      const user = app.globalData.user;
      this.setData({ act: d.activity });
      if (user) {
        app.get(`/activity/mine/${user.user_id}`).then(r => {
          const signed = r.list.some(item => item.activity_id == this.activityId && item.status === 'confirmed');
          this.setData({ signedUp: signed });
        });
      }
    });
  },

  onSignup() {
    const user = app.globalData.user;
    if (!user) { auth.login().then(() => this.loadDetail()); return; }

    app.post('/activity/signup', { activity_id: this.activityId, user_id: user.user_id }).then(() => {
      wx.showToast({ title: '报名成功', icon: 'success' });
      this.loadDetail();
    });
  }
});
