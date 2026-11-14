export const TARGET_HTML = "几猫国产3A大作_V1.html";

export const MODULES = [
  { path: "src/template/head.html", marker: null, desc: "HTML 头部与 Meta 定义" },
  { path: "src/styles/ui.css", marker: "/* game/ui.css", desc: "HUD、菜单、触屏摇杆与响应式全局样式" },
  { path: "src/template/body.html", marker: "\n</style>\n</head>", desc: "Canvas 挂载点与启动加载进度条 DOM" },
  { path: "src/vendor/three.r180.js", marker: "var _M=Object.defineProperty;", desc: "内联 Three.js r180 WebGL2 渲染引擎" },
  { path: "src/core/shared.js", marker: "var oi={min:new W(-40,0,-30)", desc: "全局常量、画质档位检测、事件总线、随机数与几何工具函数" },
  { path: "src/render/pipeline.js", marker: "var Vg={};br(Vg,{create:()=>Hg,showcase:()=>sA});", desc: "大气天空、PCSS 软阴影、9 步后处理管线与动态分辨率渲染器" },
  { path: "src/materials/pbr.js", marker: "var qg={};br(qg,{applyPatch:()=>h3,create:()=>Gg,showcase:()=>wA});", desc: "GPU MRT 过程化 PBR 材质烘焙器与 Canvas 2D 工业贴花生成" },
  { path: "src/physics/world.js", marker: "var u1=.42,Ls=.5,", desc: "AABB 碰撞检测、Slab 射线求交、胶囊体扫掠移动与 0.5m 网格 A* 寻路" },
  { path: "src/world/props.js", marker: "var $g={};br($g,{PROP_SIZES:()=>Gi,create:()=>Yg,register:()=>_i,showcase:()=>AA});", desc: "参数化几何构建器 (jn) 与 36 种港区道具/集装箱生成" },
  { path: "src/world/level.js", marker: "var cv={};br(cv,{create:()=>C1,showcase:()=>mR});", desc: "四号泊位关卡布局、仓库、掩体点、中继站与镜头轨迹" },
  { path: "src/world/backdrop.js", marker: "var mv={};br(mv,{create:()=>pv,showcase:()=>MR});", desc: "远景龙门吊、集装箱货轮、拖船、跨海大桥与天际线" },
  { path: "src/world/ground.js", marker: "var vv={};br(vv,{create:()=>O1,showcase:()=>BR});", desc: "积水港区地面、实时平面反射、Gerstner 海浪与 GPU 实例化暴雨" },
  { path: "src/fx/particles.js", marker: "var Sv={};br(Sv,{create:()=>Cf,showcase:()=>JR});", desc: "受光烟火序列帧粒子、火花曳光弹、3D 抛壳物理与弹孔贴花池" },
  { path: "src/audio/synth.js", marker: "var vt=Math.PI*2;function ao(i){", desc: "WebAudio 过程化音效/配乐合成器与 3D 空间混响混音台" },
  { path: "src/gameplay/input.js", marker: 'var h_={KeyW:"forward",', desc: "键鼠、触屏双摇杆与标准手柄统一输入层" },
  { path: "src/gameplay/player.js", marker: "var Mt={walk:3.8,", desc: "第一人称角色移动物理、呼吸摇晃、后坐力与受击反馈" },
  { path: "src/gameplay/combat.js", marker: "function zv(i){let e={shots:0,hits:0,kills:0};", desc: "射线命中判定、弱点倍率与爆炸范围伤害计算" },
  { path: "src/gameplay/weapon.js", marker: "var Xv={};br(Xv,{create:()=>dm,showcase:()=>PC});", desc: "几猫九式突击步枪 (PAC-9) 建模、全息瞄具着色器与换弹动作状态机" },
  { path: "src/gameplay/enemies.js", marker: "var ex={};br(ex,{TUNE:()=>Ui,create:()=>Em,showcase:()=>VC});", desc: "骨骼绑定系统、四足猎犬三关节解析 IK、无人机与令牌制战术 AI" },
  { path: "src/ui/hud.js", marker: "var tx=4,nx=-90,WC=450,", desc: "战术罗盘、目标追踪、动态准星、受击方向弧与无线电字幕" },
  { path: "src/ui/menus.js", marker: 'var fM="saltline.settings.v1",', desc: "主菜单、暂停/阵亡/战报界面与画质/灵敏度持久化设置面板" },
  { path: "src/gameplay/flow.js", marker: "var Yi={introSeconds:3.5,", desc: "战役流程状态机、中继切断交互、波次刷怪与行动评级" },
  { path: "src/main.js", marker: "var gM={mats:qg,level:cv,backdrop:mv,", desc: "异步启动引导 (QC)、展厅/基准测试模式与主渲染循环" },
  { path: "src/template/foot.html", marker: "})();\n\n</script>", desc: "脚本闭包收尾与 HTML 结束标签" }
];
