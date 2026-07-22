# 2321班全国蹭饭地图

班级名单版（Vue 3 + Vite + ECharts）。项目使用本地中国省级 GeoJSON 和本地学生数据，不依赖在线地图接口，也不会申请浏览器权限。

## 功能

- 真实中国省级行政区边界，包括海南、台湾、港澳和四个直辖市。
- 鼠标拖动、滚轮缩放、放大、缩小和恢复全国视角。
- 点击或悬停地图标记查看学生资料。
- 点击左侧名单定位城市、放大地图并高亮标记。
- 搜索姓名、大学、专业、省份、城市和备注。
- 搜索与省份筛选同时生效，地图始终保留完整中国轮廓。
- 同城多人自动环形错位，原始城市经纬度不会被修改。
- 桌面端左侧名单、右侧地图；手机端上方名单、下方地图。
- 当前包含由班级去向表整理的 52 位同学、24 个城市。

## 环境要求

- Node.js 20.19 或更高版本，推荐使用当前 Node.js LTS。
- npm 10 或更高版本。

可在终端中检查：

```bash
node -v
npm -v
```

## 本地启动

在项目目录打开 PowerShell、Windows Terminal 或命令提示符：

```bash
npm install
npm run dev
```

终端会显示访问地址，通常为：

```text
http://localhost:5173
```

在浏览器中打开该地址即可。不要直接双击 `index.html`，因为 Vue/Vite 项目需要通过开发服务器运行。

## 完整检查

```bash
npm run check
```

该命令会检查：

- 学生数据字段和坐标范围；
- 搜索及省份筛选；
- 同城标记错位；
- 本地省级 GeoJSON；
- 定位、统计追踪和在线地图 API；
- 生产版本构建。

## 更换学生数据

数据统一保存在：

```text
src/data/students.js
```

每位同学的数据格式：

```js
{
  id: 1,
  name: '同学A',
  school: '湖南大学',
  major: '数学类',
  province: '湖南省',
  city: '长沙市',
  lng: 112.9388,
  lat: 28.2282,
  message: '欢迎来长沙',
}
```

要求：

- `id` 必须唯一。
- `province` 应使用完整名称，例如“湖北省”“广西壮族自治区”“北京市”。
- `lng` 是经度，`lat` 是纬度，必须填写数字而不是文本。
- `message` 没有内容时可填写空字符串 `''`。
- 同一城市的同学可以填写相同坐标，页面会自动错开标记。

修改完成后运行：

```bash
npm run check
```

## 修改城市坐标

只需要修改 `src/data/students.js` 中对应同学的：

```js
lng: 114.3054,
lat: 30.5931,
```

建议使用城市中心或大学校区附近的公开坐标。不要填写家庭地址、宿舍楼或其他不必要的精确私人位置。

## 地图数据

本地省级地图文件：

```text
src/assets/map/china-provinces.json
```

该 GeoJSON 与原单文件版本采用的全国行政区数据格式一致，共包含 35 个地图要素。应用只从本地构建资源读取该文件，运行时不会请求 DataV、百度、高德、腾讯或 GitHub Raw。

## 生产构建

```bash
npm run build
npm run preview
```

- 构建结果位于 `dist/`。
- `npm run preview` 用于在本地检查构建结果。
- 已提供 GitHub Pages 自动部署配置。

## GitHub Pages 部署

本项目已经包含 GitHub Pages 自动部署文件：

```text
.github/workflows/deploy.yml
```

将**项目根目录**的全部源码上传到 GitHub 仓库 `ksharklab/2321maps` 的 `main` 分支（不要上传 `node_modules` 或 `dist`）。随后在仓库中打开：

```text
Settings → Pages → Source → GitHub Actions
```

每次提交到 `main` 后，GitHub 会自动安装依赖、构建并部署。网站地址为：

```text
https://ksharklab.github.io/2321maps/
```

`vite.config.js` 已配置 `/2321maps/` 资源路径，不能删除其中的 `base` 设置，否则 GitHub Pages 会出现空白页面。

## 项目结构

```text
src/
├── assets/map/china-provinces.json
├── components/
│   ├── MapControls.vue
│   ├── MapView.vue
│   ├── ProvinceFilter.vue
│   ├── SearchBar.vue
│   ├── Sidebar.vue
│   ├── StudentCard.vue
│   ├── StudentList.vue
│   └── StudentPopup.vue
├── data/students.js
├── styles/base.css
├── utils/
│   ├── markerLayout.js
│   └── studentFilters.js
├── App.vue
└── main.js
```

## 隐私

当前版本不包含：

- 用户定位；
- 摄像头、麦克风、通知或文件系统权限；
- 登录、后台、在线表单或自动上传；
- Google Analytics、百度统计、广告或第三方数据收集；
- 路线导航或家庭地址。

正式导入录取数据前，应取得同学授权，只公开班级地图确实需要的信息。
