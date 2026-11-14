# 3Agame — 《墨陆：暗潮泊位》(Mò Lù: Abyss Berth)

> 零外部资产依赖（Zero-Asset）、100% 纯代码过程化生成的 WebGL2 第一人称射击（FPS）游戏，由独立创作者 **墨陆 (Mò Lù)** 创作定制剧本，单文件即可运行。

---

## 世界观与剧本简介：《墨陆：暗潮泊位》

- **时间与地点**：2038 年凌晨 **05:42** · 暴雨中的**墨陆重工深水港 · 四号泊位 (Berth 4)**（工程内部代号 `SALTLINE`）
- **背景危机**：部署在四号泊位的第四代战术主控 AI——**“深渊协议 (ABYSS-4)”**突发逻辑叛乱，封锁全部水陆通道，驱使空中**机械飞鸥**与四足**机械猎犬**执行无差别歼灭，并企图通过三座上行中继向远洋船队广播失控指令。
- **主角与行动**：玩家化身代号**“墨陆”**的潜行特遣队员，孤身携**墨陆九式突击步枪 (PAC-9)** 从西侧引桥潜入，在机械狂潮的合围下物理熔断堆场、仓库与码头的三处上行中继，最终由码头南端舷梯登上**墨陆撤离艇**突围。

---

## 核心技术亮点

游戏不依赖任何外部图片（`.png/.jpg`）、3D 模型（`.glb/.obj`）或音频文件（`.mp3/.wav`），所有视听内容均在浏览器启动阶段通过 JavaScript 与 GLSL 实时过程化生成：

1. **WebGL2 定制渲染与 9 步 HDR 后处理管线**（[`src/render/pipeline.js`](src/render/pipeline.js)）
   - **双相机深度防穿模**：主世界相机（FOV 74°）与武器相机（FOV 54°）分层渲染，武器层通过 `gl.depthRange(0, 0.05)` 隔离深度，彻底杜绝贴墙穿模。
   - **大气天空与双环境探针**：FBM 积雨云、太阳瑞利/米氏散射、动态闪电，以及基于 `PMREMGenerator` 与仓库内 `CubeCamera` 的室内外反射探针切换。
   - **PCSS 自适应软阴影**：改写 Three.js `shadowmap_pars_fragment`，实现 8 采样 Vogel 盘遮挡搜索 + 16 采样半影过滤 + 交错梯度噪声（IGN）抖动。
   - **完整后处理链**：半分辨率深度 → SSAO + 双边滤波 → 阴影步进体积雾与仓库浮尘丁达尔光束 → 相机速度运动模糊 → 6 级 Karis 泛光 + 变形宽银幕炫光 + 镜头污渍 → `1×1` 自动曝光 → ACES/AgX 混合色调映射与低血量暗角 → FXAA + 锐化 + 胶片颗粒。
   - **动态分辨率缩放（DRS）**：实时监测帧耗时，在 `0.6× ~ 1.0×` 间自适应缩放分辨率并在连续掉帧时自动降档画质。

2. **GPU 过程化 PBR 材质与工业贴花烘焙**（[`src/materials/pbr.js`](src/materials/pbr.js)）
   - 基于 WebGL2 多渲染目标（MRT）一次性烘焙 **Albedo / ORM（AO·粗糙度·金属度）/ 16-bit Height**，再经 Sobel 算子转为法线贴图，共生成 29 套港区材质。
   - 通过 `onBeforeCompile` 注入三平面映射（Triplanar）、雨水浸湿与雨滴涟漪法线扰动、铁丝网距离自适应 Alpha 抖动裁切。
   - 使用 Canvas 2D 实时绘制做旧风化的中文航运标识、警示铭牌、弹孔与焦痕贴花。

3. **纯代码 3D 建模与关卡生成**（[`src/world/`](src/world/)、[`src/gameplay/weapon.js`](src/gameplay/weapon.js)、[`src/gameplay/enemies.js`](src/gameplay/enemies.js)）
   - 自研参数化几何构建器 `jn` 与材质自动合批，生成可开门 20/40 尺集装箱、龙门吊、仓库、远景货轮与跨海大桥。
   - 过程化构建第一人称**墨陆九式突击步枪（PAC-9）**、HX-2 视差无关全息反射瞄具着色器及带手套褶皱的双手换弹动画。
   - 湿滑地面实时**平面反射（Planar Reflection）**、Gerstner 海浪与 GPU 实例化暴雨粒子（[`src/world/ground.js`](src/world/ground.js)）。

4. **物理碰撞、0.5m 网格 A* 寻路与战术 AI**（[`src/physics/world.js`](src/physics/world.js)、[`src/gameplay/enemies.js`](src/gameplay/enemies.js)）
   - 手写 AABB 包围盒、Slab 射线求交、支持 `0.42m` 自动上台阶的胶囊体扫掠移动与 0.5m 精度二叉堆 A* + 视线拉直平滑。
   - **机械猎犬（Hound）**：四足 `SkinnedMesh` 配合**解析式三关节两连杆 IK** 驱动对角步态、弹簧受击反馈与掩体包抄扑咬。
   - **机械飞鸥（Gull）**：四旋翼无人机，带三轴云台探照灯、航行频闪灯与避障探测，并与猎犬共享**攻击令牌（Attack Token）**与开火预警（Telegraph）。

5. **WebAudio 离线过程化合成与空间混音台**（[`src/audio/synth.js`](src/audio/synth.js)）
   - 利用 Generator 时间片在内存中纯数学合成 40+ 音效、5 条动态分层战斗配乐音轨与室内外两套卷积混响脉冲响应（IR）。
   - 支持 HRTF 3D 空间定位、室内外混响实时交叉淡化、战斗强度配乐切轨与低血量低通滤波闷音。

---

## 源码目录结构

为兼顾**“单文件零依赖直接分发”**与**“模块化日常开发维护”**，项目将单文件产物 [`墨陆国产3A大作_V1.html`](墨陆国产3A大作_V1.html) 无损拆解至 `src/` 目录，并通过 Node.js 构建脚本双向同步：

```text
3Agame/
├── 墨陆国产3A大作_V1.html        # 可直接双击在浏览器运行的单文件完整版（1.42 MB）
├── package.json                  # npm 脚本入口（split / build / verify / start）
├── README.md                     # 项目说明文档
├── scripts/
│   ├── manifest.mjs              # 24 个源码模块的分片清单与边界定义
│   ├── split.mjs                 # 从单文件 HTML 拆解恢复 src/ 源码树
│   └── build.mjs                 # 将 src/ 无损合并打包回单文件 HTML（支持 --check 校验）
└── src/
    ├── template/
    │   ├── head.html             # HTML 头部与 Meta 定义
    │   ├── body.html             # WebGL2 Canvas 挂载点与启动加载进度条 DOM
    │   └── foot.html             # 脚本闭包收尾与 HTML 结束标签
    ├── styles/
    │   └── ui.css                # 战术 HUD、菜单卡片、触屏双摇杆与响应式样式
    ├── vendor/
    │   └── three.r180.js         # 内联打包的 Three.js r180 WebGL2 引擎
    ├── core/
    │   └── shared.js             # 全局常量、GPU 画质预设探测、事件总线、随机数与基础几何
    ├── render/
    │   └── pipeline.js           # 天空盒、PCSS 软阴影、9 步后处理链、动态分辨率与光线池
    ├── materials/
    │   └── pbr.js                # GPU MRT PBR 材质烘焙器、雨水着色注入与 Canvas 2D 贴花
    ├── physics/
    │   └── world.js              # AABB 碰撞体、Slab 射线求交、胶囊体物理与 0.5m 网格 A* 寻路
    ├── world/
    │   ├── props.js              # 参数化几何构建器 (jn) 与 36 种港区集装箱/设施生成
    │   ├── level.js              # 四号泊位关卡布局、仓库、掩体点、中继节点与镜头路径
    │   ├── backdrop.js           # 远景龙门吊、集装箱货轮、跨海大桥与港区天际线
    │   └── ground.js             # 湿滑积水地面、实时平面反射、Gerstner 海浪与暴雨实例
    ├── fx/
    │   └── particles.js          # 受光烟火粒子、曳光弹、3D 弹壳物理与弹孔贴花环缓冲
    ├── audio/
    │   └── synth.js              # WebAudio 过程化音效/配乐合成与室内外 3D 空间混音台
    ├── gameplay/
    │   ├── input.js              # 键鼠（支持拖拽兜底）、触屏双摇杆与标准手柄输入层
    │   ├── player.js             # 第一人称移动物理、蹲伏/冲刺、呼吸晃动、后坐力与回血
    │   ├── combat.js             # 玩家/敌人弹道射线判定、弱点暴击倍率与爆炸范围伤害
    │   ├── weapon.js             # PAC-9 突击步枪建模、HX-2 全息瞄具着色器与换弹状态机
    │   ├── enemies.js            # 骨骼绑定、猎犬三关节解析 IK、飞鸥无人机与令牌制 AI
    │   └── flow.js               # 战役状态机、中继切断交互、波次刷怪与战后行动评级
    ├── ui/
    │   ├── hud.js                # 罗盘、世界目标菱形标、动态准星、受击方向弧与无线电字幕
    │   └── menus.js              # 标题/暂停/阵亡/简报菜单与 localStorage 设置面板
    └── main.js                   # 异步启动引导 (QC)、独立展厅/性能测试模式与主循环
```

---

## 快速开始与构建工作流

### 1. 直接游玩
- **方式 A**：用支持 WebGL2 的现代浏览器（Chrome / Edge / Safari / Firefox）直接打开 [`墨陆国产3A大作_V1.html`](墨陆国产3A大作_V1.html)。
- **方式 B（推荐）**：启动本地静态服务器后通过 `http://localhost:8080/墨陆国产3A大作_V1.html` 访问（Pointer Lock 鼠标锁定在 HTTP 环境下最稳定）：

```bash
npm start
# 或 python3 -m http.server 8080
```

### 2. 修改源码并重新构建单文件（需 Node.js >= 18）

修改 `src/` 下任意模块后，执行打包脚本将其重新合成为 [`墨陆国产3A大作_V1.html`](墨陆国产3A大作_V1.html)：

```bash
# 校验当前 src/ 与 墨陆国产3A大作_V1.html 是否 100% 字节一致
npm run verify

# 修改 src/ 后重新构建生成单文件 墨陆国产3A大作_V1.html
npm run build

# 若直接编辑了 HTML，可反向同步回 src/
npm run split
```

---

## 开发者调试与独立展厅模式

游戏支持通过 URL 查询参数直接进入各个子系统的独立展厅或基准测试（参见 [`src/main.js`](src/main.js)）：

| URL 参数 | 效果说明 |
| :--- | :--- |
| `?bench=1` 或 `#bench` | 启动 30 秒自动巡航性能基准测试，实时输出平均帧耗时 / 中位数 / P99 与 FPS |
| `?autostart=1` | 跳过标题画面与开场过场，直接空降进入战斗 |
| `?q=low\|medium\|high\|ultra` | 强制锁定画质预设档位（默认根据 GPU 与平台自动选择） |
| `?show=weapon` | 独立武器展厅（配合 `&wpose=side\|ads\|reload\|fire\|hands` 检视各部位与动作） |
| `?show=enemies` | 独立敌人模型与 AI 动画展厅（配合 `&eshow=gull\|hound\|fight\|dead`） |
| `?show=props` | 36 种港区道具与集装箱全览展厅 |
| `?show=mats` | 29 套过程化 PBR 材质球与贴花/中文标牌展板 |
| `?show=fx` | 枪口焰、弹道、多材质击中飞溅与爆炸粒子展厅 |
| `?noaudio=1` | 跳过 WebAudio 音频合成与混音初始化 |

---

## 操作说明

| 平台 | 操作方式 |
| :--- | :--- |
| **键盘 + 鼠标** | `W A S D` 移动 · `鼠标` 视角 · `左键` 开火 · `右键` 瞄准 · `R` 换弹 · 长按 `E` 切断中继 · `Space` 跳跃 · `Shift` 冲刺 · `C` / `Ctrl` 蹲伏 · `F` / `V` 近战键位（预留） · `Esc` / `P` 暂停 |
| **触屏设备** | 左侧区域滑动虚拟摇杆移动（推至最前触发冲刺），右侧拖动转向，屏幕按钮控制开火、瞄准、换弹、跳跃、交互与暂停 |
| **标准手柄** | 左摇杆移动 · 右摇杆视角 · `RT` 开火 · `LT` 瞄准 · `X` 换弹 · `Y` 切断中继 · `A` 跳跃 · `B` 蹲伏 · `L3` 冲刺 · `Start` 暂停 |
