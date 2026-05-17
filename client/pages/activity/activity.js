const app = getApp();

Page({
  data: { list: [], filter: 'all' },

  onLoad() { this.loadList(); },
  onShow() { this.loadList(); },

  loadList() {
    const filter = this.data.filter === 'all' ? '' : this.data.filter;
    app.get('/activity/list', { filter }).then(d => this.setData({ list: d.list }));
  },

  setFilter(e) {
    this.setData({ filter: e.currentTarget.dataset.filter }, () => this.loadList());
  },

  goDetail(e) { wx.navigateTo({ url: `/pages/activity/detail?id=${e.currentTarget.dataset.id}` }); }
});
