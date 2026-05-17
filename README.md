# 足球俱乐部小程序

## 项目结构

```
football-club/
├── server/               # 后端 API（Node.js + Express + SQLite）
│   ├── package.json
│   ├── app.js            # 入口文件
│   ├── db.js             # 数据库模型（7张表）
│   ├── routes/
│   │   ├── auth.js       # 登录 + 用户资料
│   │   ├── activity.js   # 活动 + 报名
│   │   ├── team.js       # 球队 + 球员
│   │   └── schedule.js   # 赛程 + Banner
│   └── data/             # SQLite 数据库（自动创建）
│
├── client/               # 微信小程序
│   ├── project.config.json
│   ├── app.js / app.json / app.wxss
│   ├── pages/
│   │   ├── index/        # 首页（Banner轮播 + 快捷导航 + 近期活动 + 下一场）
│   │   ├── activity/     # 活动列表 + 活动详情（含报名）
│   │   ├── team/         # 球队列表 + 球队详情（含球员名单）
│   │   ├── schedule/     # 赛程列表 + 赛程详情
│   │   └── mine/         # 我的（微信登录 + 资料 + 我的报名）
│   └── utils/
│       ├── api.js        # (见 app.js 内置)
│       └── auth.js       # 登录工具
│
└── README.md
```

## 步骤一：准备服务器（大陆服务器，已备案域名）

### 买服务器
推荐阿里云 / 腾讯云 **大陆节点** 轻量应用服务器（2核2G，~60元/月）

### 装 Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx
```

### 上传后端代码
```bash
scp -r /Users/ray/Desktop/football-club/server root@<服务器IP>:~/football-server
```

### 部署后端
```bash
cd ~/football-server
npm install
npm install -g pm2
pm2 start app.js --name football-api
pm2 save
```

### 配置 Nginx 反向代理
```nginx
# /etc/nginx/sites-available/football
server {
    listen 80;
    server_name 你的域名.com;

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    client_max_body_size 20M;
}

# SSL 证书
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d 你的域名.com
```

## 步骤二：配置微信小程序

### 安装开发者工具
1. 下载微信开发者工具：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. 安装后用微信扫码登录

### 导入项目
1. 打开开发者工具 → 导入项目
2. 项目目录选择 `football-club/client`
3. AppID 填写你的小程序 AppID
4. 点击导入

### 修改 API 地址
在 `client/app.js` 中，找到 `baseUrl`，把 `http://localhost:3001/api` 改为你的服务器域名：
```js
baseUrl: 'https://你的域名.com/api'
```

### 添加 tabBar 图标
需要准备 10 个 tab 图标（每个标签 2 个：未选中 + 选中），放在 `client/images/` 目录：

| 文件 | 说明 |
|------|------|
| home.png / home_active.png | 首页 |
| team.png / team_active.png | 球队 |
| activity.png / activity_active.png | 活动 |
| schedule.png / schedule_active.png | 赛程 |
| mine.png / mine_active.png | 我的 |

图标规格：81×81px PNG（会自动缩放）

## 步骤三：数据管理

### 管理后台接口
部署后可直接用浏览器或 API 工具调用：

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/team/list | GET | 查看球队 |
| /api/activity/create | POST | 创建活动 |
| /api/activity/list | GET | 查看活动 |
| /api/schedule/list | GET | 查看赛程 |
| /api/health | GET | 健康检查 |

**推荐**：后续我可以帮你写一个管理后台页面，方便在浏览器中创建活动、管理数据。

## API 接口一览

| 功能 | 方法 | 路径 | 参数 |
|------|------|------|------|
| 微信登录 | POST | /api/auth/wx-login | { code, rawData } |
| 获取用户 | GET | /api/auth/profile | Header: Authorization |
| 更新资料 | POST | /api/auth/profile/update | { name, phone } |
| 活动列表 | GET | /api/activity/list | ?filter=all/ongoing/ended |
| 活动详情 | GET | /api/activity/detail/:id | - |
| 创建活动 | POST | /api/activity/create | { title, start_time, ... } |
| 报名 | POST | /api/activity/signup | { activity_id, user_id } |
| 取消报名 | POST | /api/activity/cancel | { activity_id, user_id } |
| 我的报名 | GET | /api/activity/mine/:user_id | - |
| 球队列表 | GET | /api/team/list | - |
| 球队详情 | GET | /api/team/detail/:id | - |
| 赛程列表 | GET | /api/schedule/list | - |
| 赛程详情 | GET | /api/schedule/detail/:id | - |
| Banner列表 | GET | /api/schedule/banners | - |
