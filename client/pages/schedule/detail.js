const app = getApp();
Page({
  data: { match: {} },
  onLoad(opt) {
    app.get(`/schedule/detail/${opt.id}`).then(d => this.setData({ match: d.match }));
  }
});
