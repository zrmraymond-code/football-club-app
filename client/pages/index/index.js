const app = getApp();

Page({
  data: { banners: [], activities: [], nextMatch: null },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    app.get('/schedule/banners').then(d => this.setData({ banners: d.banners }));
    app.get('/activity/list', { filter: 'ongoing' }).then(d => this.setData({ activities: d.list.slice(0, 3) }));
    app.get('/schedule/list').then(d => {
      const now = new Date().toISOString();
      const next = d.list.find(m => m.status === 'pending' && m.match_time > now);
      this.setData({ nextMatch: next });
    });
  },

  goPage(e) { wx.switchTab({ url: e.currentTarget.dataset.url }); },
  goDetail(e) { wx.navigateTo({ url: `/pages/activity/detail?id=${e.currentTarget.dataset.id}` }); },
  goMatch(e) { wx.navigateTo({ url: `/pages/schedule/detail?id=${e.currentTarget.dataset.id}` }); },
  onBannerTap(e) {
    const item = e.currentTarget.dataset.item;
    if (item.link_type === 'activity') wx.navigateTo({ url: `/pages/activity/detail?id=${item.link_id}` });
    else if (item.link_type === 'match') wx.navigateTo({ url: `/pages/schedule/detail?id=${item.link_id}` });
  }
});
