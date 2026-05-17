const app = getApp();
Page({
  data: { list: [] },
  onShow() { app.get('/schedule/list').then(d => this.setData({ list: d.list })); },
  goDetail(e) { wx.navigateTo({ url: `/pages/schedule/detail?id=${e.currentTarget.dataset.id}` }); }
});
