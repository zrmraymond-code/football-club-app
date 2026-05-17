const app = getApp();
Page({
  data: { team: {} },
  onLoad(opt) {
    app.get(`/team/detail/${opt.id}`).then(d => this.setData({ team: d.team }));
  }
});
