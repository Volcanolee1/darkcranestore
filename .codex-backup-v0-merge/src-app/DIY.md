# DarkcraneStore 门户首页 — 设计文档 & CSS 实现

## 1. 草图解读

基于手绘草图，门户首页采用**后排第一视角**的沉浸式驾驶场景：

```
┌──────────────────────────────────────────────────────┐
│  [停车场]    [首页]    [加油站]       顶部导航栏       │
├──────────────────────────────────┬───────────────────┤
│                                  │ ┌─路况指示牌─────┐ │
│          ▲ 隧道入口（半圆）       │ │ US: 150ms ...  │ │
│     JP  US  HK  TW               │ │ JP: <100ms ... │ │
│      ⚑   ⚑   ⚑   ⚑ (国旗)       │ │ HK: ...        │ │
│    ═══════════════════            │ │ (动态轮播)      │ │
│    ╲    黄色道路标线    ╱          │ └────────────────┘ │
│     ╲                ╱            │                    │
│  ┌───挡风玻璃──────────┐          │                    │
│  │    [现在上车] CTA    │          │                    │
│  └─────────────────────┘          │                    │
│      🪞 后视镜                     │                    │
│   👤 司机剪影  🎡 方向盘            │                    │
│   ▓▓▓▓ 仪表台 ▓▓▓▓▓▓▓             │                    │
│   ████ 座椅 ████████████           │                    │
└──────────────────────────────────┴───────────────────┘
```

### 组件拆分
| 层级 | 组件名 | 作用 |
|------|--------|------|
| z-0 | `TunnelScene` | 隧道背景 + 透视网格 + 黄色标线动画 |
| z-1 | `CountryFlags` | 隧道顶上的国家/地区旗帜标识 (JP, US, HK, TW) |
| z-2 | `CarInterior` | 汽车内饰层：挡风玻璃轮廓、仪表台、后视镜、方向盘、司机剪影 |
| z-3 | `WindshieldCTA` | 挡风玻璃上的"现在上车"按钮（跳转到空位最少的车辆） |
| z-10 | `TopNav` | 顶部导航栏：停车场 / 首页 / 加油站 |
| z-10 | `SpeedBoard` | 右侧路况指示牌（各地区各运营商延迟数据轮播） |

---

## 2. 门户首页专属 CSS

以下 CSS 代码应添加到 `globals.css` 的 `@layer utilities` 块内，或单独创建 `portal.css` 后在 `page.tsx` 中引入。

```css
/* ================================================================
   DarkcraneStore — 门户首页专属样式
   ================================================================ */

/* --- 顶部导航栏 --- */
.portal-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  height: 48px;
  background: rgba(7, 7, 20, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 245, 255, 0.12);
}

.portal-nav-item {
  position: relative;
  padding: 0 32px;
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: color 0.2s, text-shadow 0.2s;
  text-transform: uppercase;
  border-left: 1px solid rgba(0, 245, 255, 0.08);
}

.portal-nav-item:first-child {
  border-left: none;
}

.portal-nav-item:hover,
.portal-nav-item.active {
  color: var(--color-neon-cyan);
  text-shadow: 0 0 12px rgba(0, 245, 255, 0.6);
}

.portal-nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20%;
  right: 20%;
  height: 2px;
  background: var(--color-neon-cyan);
  box-shadow: 0 0 8px var(--color-neon-cyan);
}

/* --- 主场景容器 --- */
.portal-scene {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--color-dark-base);
}

/* --- 隧道入口（半圆拱门） --- */
.tunnel-arch {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  width: 52vw;
  height: 26vw;
  border-radius: 52vw 52vw 0 0;
  border: 2px solid rgba(0, 245, 255, 0.3);
  box-shadow:
    0 0 30px rgba(0, 245, 255, 0.15),
    inset 0 0 60px rgba(0, 245, 255, 0.05);
  background: radial-gradient(
    ellipse at 50% 120%,
    rgba(7, 7, 20, 0.2) 0%,
    rgba(7, 7, 20, 0.95) 70%
  );
  z-index: 1;
}

/* 隧道内部透视线条 */
.tunnel-arch::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  background:
    repeating-conic-gradient(
      from 180deg at 50% 100%,
      rgba(0, 245, 255, 0.06) 0deg 2deg,
      transparent 2deg 12deg
    );
}

/* --- 道路 & 黄色标线 --- */
.road-surface {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55%;
  /* 透视梯形效果 */
  background: linear-gradient(
    to top,
    rgba(20, 20, 35, 0.95) 0%,
    rgba(10, 10, 25, 0.6) 60%,
    transparent 100%
  );
  z-index: 0;
}

/* 中央黄色虚线 */
.road-center-line {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 55%;
  z-index: 2;
  /* 重复渐变模拟虚线 */
  background: repeating-linear-gradient(
    to top,
    var(--color-neon-yellow) 0px,
    var(--color-neon-yellow) 30px,
    transparent 30px,
    transparent 60px
  );
  opacity: 0.7;
  /* 透视模拟：底部粗，顶部细 */
  clip-path: polygon(40% 0%, 60% 0%, 80% 100%, 20% 100%);
}

/* 左右车道边线 */
.road-lane-left,
.road-lane-right {
  position: absolute;
  bottom: 0;
  width: 2px;
  height: 50%;
  background: linear-gradient(
    to top,
    rgba(255, 214, 10, 0.5),
    transparent
  );
  z-index: 2;
}

.road-lane-left {
  left: 50%;
  transform: translateX(-50%) rotate(25deg);
  transform-origin: bottom center;
}

.road-lane-right {
  left: 50%;
  transform: translateX(-50%) rotate(-25deg);
  transform-origin: bottom center;
}

/* --- 国旗标记 --- */
.country-flags {
  position: absolute;
  bottom: 45%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6vw;
  z-index: 3;
}

.flag-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: flag-sway 3s ease-in-out infinite alternate;
}

.flag-pole {
  width: 2px;
  height: 24px;
  background: rgba(255, 255, 255, 0.5);
}

.flag-label {
  padding: 2px 8px;
  font-size: 0.65rem;
  font-weight: 800;
  font-family: var(--font-mono);
  letter-spacing: 0.1em;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  clip-path: polygon(0% 0%, 100% 0%, 85% 50%, 100% 100%, 0% 100%);
  padding-right: 14px;
}

/* 各旗帜颜色标识 */
.flag-label[data-region="JP"] { border-color: #ff4444; color: #ff6666; }
.flag-label[data-region="US"] { border-color: #4488ff; color: #66aaff; }
.flag-label[data-region="HK"] { border-color: #ff2d78; color: #ff5599; }
.flag-label[data-region="TW"] { border-color: #30d158; color: #50e178; }

@keyframes flag-sway {
  0%   { transform: rotate(-2deg); }
  100% { transform: rotate(2deg); }
}

/* --- 汽车内饰层 --- */
.car-interior {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 45%;
  z-index: 5;
  pointer-events: none;
}

/* 仪表台 */
.dashboard {
  position: absolute;
  bottom: 15%;
  left: 5%;
  right: 5%;
  height: 18%;
  background: linear-gradient(
    to top,
    rgba(25, 25, 40, 0.95),
    rgba(35, 35, 55, 0.8)
  );
  border-radius: 8px 8px 0 0;
  border-top: 1px solid rgba(0, 245, 255, 0.15);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
}

/* 仪表台上的霓虹指示灯带 */
.dashboard::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--color-neon-cyan),
    var(--color-neon-pink),
    var(--color-neon-cyan),
    transparent
  );
  opacity: 0.6;
  border-radius: 1px;
}

/* 方向盘 */
.steering-wheel {
  position: absolute;
  bottom: 20%;
  left: 18%;
  width: 12vw;
  height: 12vw;
  max-width: 120px;
  max-height: 120px;
  border-radius: 50%;
  border: 3px solid rgba(0, 245, 255, 0.3);
  box-shadow:
    0 0 15px rgba(0, 245, 255, 0.1),
    inset 0 0 20px rgba(0, 0, 0, 0.5);
  z-index: 6;
}

/* 方向盘中心 */
.steering-wheel::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  height: 30%;
  border-radius: 50%;
  background: rgba(0, 245, 255, 0.1);
  border: 1px solid rgba(0, 245, 255, 0.2);
}

/* 后视镜 */
.rearview-mirror {
  position: absolute;
  top: 38%;
  left: 50%;
  transform: translateX(-50%);
  width: 10vw;
  height: 3.5vw;
  max-width: 120px;
  max-height: 42px;
  border-radius: 4px;
  background: linear-gradient(135deg, rgba(30, 30, 50, 0.9), rgba(50, 50, 80, 0.7));
  border: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

/* 司机剪影 */
.driver-silhouette {
  position: absolute;
  bottom: 18%;
  left: 10%;
  width: 14vw;
  height: 28%;
  max-width: 160px;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 50% 50% 20% 20%;
  z-index: 7;
  clip-path: ellipse(50% 55% at 50% 55%);
}

/* 座椅（底部暗色块） */
.car-seats {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 16%;
  background: linear-gradient(to top, rgba(10, 10, 18, 1), rgba(20, 20, 35, 0.9));
  z-index: 8;
}

/* --- 挡风玻璃 "现在上车" CTA --- */
.windshield-cta {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  pointer-events: auto;
}

.windshield-cta .btn-neon {
  font-size: 1.2rem;
  padding: 16px 48px;
  letter-spacing: 0.15em;
  box-shadow:
    0 0 30px rgba(0, 245, 255, 0.5),
    0 0 60px rgba(0, 245, 255, 0.2),
    0 8px 32px rgba(0, 0, 0, 0.6);
  animation: cta-pulse 2.5s ease-in-out infinite;
}

@keyframes cta-pulse {
  0%, 100% { box-shadow: 0 0 30px rgba(0, 245, 255, 0.5), 0 0 60px rgba(0, 245, 255, 0.2); }
  50%      { box-shadow: 0 0 40px rgba(0, 245, 255, 0.8), 0 0 80px rgba(0, 245, 255, 0.4); }
}

/* --- 右侧路况指示牌 --- */
.speed-board {
  position: fixed;
  top: 64px;
  right: 24px;
  width: 320px;
  z-index: 40;
  padding: 16px;
  font-family: var(--font-mono);
}

.speed-board-title {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-neon-cyan);
  text-shadow: 0 0 8px rgba(0, 245, 255, 0.5);
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 245, 255, 0.2);
  text-align: center;
}

/* 各地区网速行 */
.speed-row {
  display: flex;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.speed-region {
  width: 36px;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--color-neon-yellow);
  text-shadow: 0 0 6px rgba(255, 214, 10, 0.4);
}

.speed-values {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  text-align: center;
}

.speed-cell {
  font-size: 0.7rem;
  padding: 3px 6px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
}

/* 网速颜色编码 */
.speed-cell.fast     { color: var(--color-neon-green); }  /* < 100ms */
.speed-cell.moderate { color: var(--color-neon-yellow); } /* 100-200ms */
.speed-cell.slow     { color: var(--color-neon-pink); }   /* > 200ms */

.speed-carrier-header {
  display: grid;
  grid-template-columns: 36px repeat(3, 1fr);
  gap: 4px;
  padding: 0 0 6px 0;
  font-size: 0.6rem;
  color: var(--color-text-muted);
  text-align: center;
  letter-spacing: 0.1em;
}

/* 指示牌动态轮播指示器 */
.speed-board-indicators {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
}

.speed-board-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: background 0.3s, box-shadow 0.3s;
}

.speed-board-dot.active {
  background: var(--color-neon-cyan);
  box-shadow: 0 0 8px var(--color-neon-cyan);
}

/* --- 响应式适配 --- */
@media (max-width: 768px) {
  .speed-board {
    display: none; /* 移动端隐藏路况面板，通过底部抽屉访问 */
  }

  .tunnel-arch {
    width: 80vw;
    height: 40vw;
  }

  .country-flags {
    gap: 8vw;
    bottom: 50%;
  }

  .steering-wheel {
    left: 12%;
    width: 18vw;
    height: 18vw;
  }

  .windshield-cta .btn-neon {
    font-size: 1rem;
    padding: 12px 32px;
  }
}
```

---

## 3. 组件结构参考 (JSX)

```tsx
{/* 整体布局 */}
<div className="portal-scene">

  {/* 顶部导航 */}
  <nav className="portal-nav">
    <a className="portal-nav-item" href="/parking">停车场</a>
    <a className="portal-nav-item active" href="/">首页</a>
    <a className="portal-nav-item" href="/fuel">加油站</a>
  </nav>

  {/* 隧道背景 */}
  <div className="tunnel-arch" />

  {/* 透视网格动画 (复用现有 SynthwaveGrid 组件) */}
  <SynthwaveGrid />

  {/* 道路 */}
  <div className="road-surface" />
  <div className="road-center-line" />
  <div className="road-lane-left" />
  <div className="road-lane-right" />

  {/* 国旗标记 */}
  <div className="country-flags">
    <FlagMarker region="JP" />
    <FlagMarker region="US" />
    <FlagMarker region="HK" />
    <FlagMarker region="TW" />
  </div>

  {/* 汽车内饰 */}
  <div className="car-interior">
    <div className="rearview-mirror" />
    <div className="dashboard" />
    <div className="steering-wheel" />
    <div className="driver-silhouette" />
    <div className="car-seats" />
  </div>

  {/* 挡风玻璃 CTA */}
  <div className="windshield-cta">
    <button className="btn-neon">现在上车</button>
  </div>

  {/* 右侧路况指示牌 */}
  <SpeedBoard />

</div>
```

---

## 4. 路况指示牌数据结构

```tsx
const speedData = [
  {
    region: 'US',
    carriers: {
      telecom: { label: '电信', ms: 150, level: 'moderate' },
      unicom:  { label: '联通', ms: 151, level: 'moderate' },
      mobile:  { label: '移动', ms: 155, level: 'moderate' },
    }
  },
  {
    region: 'JP',
    carriers: {
      telecom: { label: '电信', ms: 89,  level: 'fast' },
      unicom:  { label: '联通', ms: 113, level: 'moderate' },
      mobile:  { label: '移动', ms: 69,  level: 'fast' },
    }
  },
  {
    region: 'HK',
    carriers: {
      telecom: { label: '电信', ms: 45,  level: 'fast' },
      unicom:  { label: '联通', ms: 52,  level: 'fast' },
      mobile:  { label: '移动', ms: 48,  level: 'fast' },
    }
  },
];
```

---

## 5. 交互逻辑备注

| 交互元素 | 行为 |
|---------|------|
| **现在上车** 按钮 | 查询数据库中当前空位最少（最快满员发车）的车辆，直接跳转到该车辆的购买/占座页 |
| **路况指示牌** | 每 5 秒自动轮播下一个地区的数据，支持手动点击切换 |
| **国旗标记** | 带微风摆动动画（`flag-sway`），点击后过滤该地区的车型列表 |
| **导航栏** | 固定在顶部，`backdrop-filter` 毛玻璃效果，滚动时不消失 |
