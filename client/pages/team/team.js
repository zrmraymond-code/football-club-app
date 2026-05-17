const app = getApp();
Page({
  data: { list: [] },
  onShow() { app.get('/team/list').then(d => this.setData({ list: d.list })); },
  goDetail(e) { wx.navigateTo({ url: `/pages/team/detail?id=${e.currentTarget.dataset.id}` }); }
});
