# AGENTS.md — DarkcraneStore 项目开发指南

## 项目简介

DarkcraneStore 是一个 VPS 拼车/合租电商平台，采用“汽车与加油”的创意包装体系。
用户通过“上车”购买 VPS 座位，通过“加油”充值续费，通过“停车场”管理已购服务。

- 产品定位：面向中国大陆有网络加速需求的用户群体。
- 核心参考文档：`readme.md`（产品 PRD）、`src/app/DIY.md`（首页设计草图与样式说明）。
- 当前实现状态：已实现门户首页沉浸式驾驶视角；其他业务页面和数据库模型尚未接入。

## 技术栈

| 层级 | 技术 | 当前版本/状态 |
| --- | --- | --- |
| 框架 | Next.js App Router | 16.2.10 |
| React | React / React DOM | 19.2.4 |
| 语言 | TypeScript | 5.x，`strict: true` |
| 样式 | Tailwind CSS | v4，CSS-first `@theme inline` |
| 数据库 | PostgreSQL | 15-alpine，已在 Docker Compose 中配置 |
| ORM | Prisma | 尚未接入 |
| 容器 | Docker + Docker Compose | web + db |
| 包管理 | npm | 使用 `package-lock.json` |

## 当前文件结构

```text
DarkcraneStore/
├── AGENTS.md
├── docker-compose.yml
├── Dockerfile
├── package.json
├── readme.md
├── tsconfig.json
├── eslint.config.mjs
├── public/
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── portal.css
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── favicon.ico
    │   └── DIY.md
    └── components/
        └── SynthwaveGrid.tsx
```

## 运行与验证

### Docker 开发环境

- 启动：`docker-compose up -d`
- 重启前端：`docker-compose restart web`
- 查看日志：`docker-compose logs -f web`
- 前端访问：`http://localhost:3200`
- 容器内 Next.js 监听：`3000`

### 本地 npm 命令

- 开发：`npm run dev`
- 构建：`npm run build`
- 生产启动：`npm run start`
- 静态检查：`npm run lint`

### 数据库

- Compose 服务名：`db`
- PostgreSQL 镜像：`postgres:15-alpine`
- 连接串：`postgresql://postgres:darkcrane123@db:5432/darkcrane_store?schema=public`
- 数据卷：`pgdata`
- 不要直接执行 `DROP`、`TRUNCATE`、删除数据卷等破坏性操作，除非用户明确确认。

## 当前页面与路由

| 路由 | 状态 | 说明 |
| --- | --- | --- |
| `/` | 已实现 | 门户首页，后排驾驶视角沉浸式场景 |
| `/parking` | 未实现 | 当前首页 CTA 和导航会跳转到该路由 |
| `/fuel` | 未实现 | 当前顶部导航“加油站”指向该路由 |
| `/garage` | 未实现 | PRD 规划的选车/车库页 |
| `/gas-station` | 未实现 | PRD 规划的加油站路由；当前代码暂未使用 |
| `/login` | 未实现 | 登录页 |
| `/register` | 未实现 | 注册页 |

新建页面时优先遵循 PRD 路由规划；如果继续使用当前代码中的 `/fuel`，需要同步更新文档和导航命名，避免 `/fuel` 与 `/gas-station` 并存造成语义分裂。

## 首页实现约束

`src/app/page.tsx` 当前是客户端组件，负责组合首页全部视觉层：

- `BackgroundLayer`：夜空、城市剪影、霓虹氛围。
- `RoadLayer`：道路、隧道、路线旗帜、赛博网格。
- `WindshieldLayer`：挡风玻璃和当前地区标识。
- `CockpitLayer`：仪表台、方向盘、座椅、司机剪影。
- `BoardingPanel`：核心 CTA。
- `SpeedBoard`：JP/US/HK/TW 路况延迟面板，自动轮播并支持手动切换。
- `TopNav`：顶部导航。
- `InteractionLayer`：底部动态路线读数。

`src/components/SynthwaveGrid.tsx` 使用 Canvas 绘制动态透视网格，并尊重 `prefers-reduced-motion`。修改该组件时必须保留客户端渲染边界和窗口 resize 清理逻辑。

## 视觉设计规范

### 暗色模式

本项目不提供亮色/白色模式。页面、组件、弹窗和工具面板背景必须使用暗色设计令牌或已有暗色组件类。禁止新增浅色主题分支。

### 设计令牌

全局设计令牌定义在 `src/app/globals.css` 的 `@theme inline` 中：

| 变量 | 用途 |
| --- | --- |
| `--color-neon-cyan` | 主品牌色、链接、按钮渐变起点 |
| `--color-neon-pink` | 强调色、地平线发光、警告态 |
| `--color-neon-purple` | 主按钮渐变终点、方向盘高光 |
| `--color-neon-yellow` | 道路标线、区域标签、中等延迟 |
| `--color-neon-green` | 可用状态、低延迟 |
| `--color-dark-base` / `--color-dark-*` | 页面和组件暗色背景 |
| `--color-glass-*` | 毛玻璃边框与背景 |
| `--color-text-*` | 文本层级 |
| `--font-sans` / `--font-mono` | 中文正文与数据字体 |

新增颜色必须先进入 `@theme inline`，再通过 `var()` 或 Tailwind 令牌使用。组件中不要硬编码 HEX/RGB；如果维护既有硬编码颜色，优先在顺手修改时迁移到令牌。

### 预置组件类

- `.glass-card`：毛玻璃卡片容器。
- `.neon-text-cyan` / `.neon-text-pink`：霓虹发光文字。
- `.neon-border-cyan` / `.neon-border-pink`：霓虹边框。
- `.btn-neon`：主 CTA 按钮。
- `.btn-ghost`：幽灵按钮。
- `.synthwave-grid`：CSS 网格背景。

复杂页面专属样式可以放入独立 CSS 文件，例如首页使用 `src/app/portal.css` 并在 `page.tsx` 中直接引入。

## 业务领域术语

| 业务概念 | 代码命名 | UI 文案 |
| --- | --- | --- |
| VPS 实例 | `vehicle` | 车 / 车辆 |
| VPS 座位 | `seat` | 座位 / 车位 |
| 线路等级 | `tier` | A级车 / B级车 / C级车 / D级车 / SuperCar / HyperCar |
| 套餐/计费 | `fuel` | 加油 / 油费 |
| 充值 | `refuel` | 加油 |
| 用户面板 | `parking` | 停车场 |
| 商品列表 | `garage` | 选车 / 车库 |
| 充值页 | `gas-station` 或当前代码的 `fuel` | 加油站 |
| 满员启动 | `depart` / `launch` | 发车 |
| 中途退出 | `bail` | 跳车 |
| 中途加入 | `hopOn` | 中途上车 / 补位 |

代码变量使用英文业务名，面向用户的中文文案保持“上车、加油、停车场、发车、跳车、补位”的包装体系。

## 编码规范

- 所有代码注释必须使用中文。
- TypeScript 保持严格模式，禁止引入 `any`。需要未知数据时使用 `unknown` 后收窄。
- React 组件使用函数式组件和 Hooks。
- 组件文件使用 PascalCase，例如 `SynthwaveGrid.tsx`。
- 工具函数、普通变量使用 camelCase。
- 路径别名使用 `@/*`，对应 `src/*`。
- 客户端交互组件必须显式使用 `"use client"`。
- 修改动画时必须考虑 `prefers-reduced-motion`。
- 不要把业务假数据散落到多个页面；当数据结构开始复用时，抽到同一模块维护。

## 编码与中文内容

当前部分源码和文档中的中文内容存在乱码现象，优先按 UTF-8 修复。修改包含中文的文件时：

- 使用 UTF-8 保存。
- 不要复制已有乱码作为新文案。
- 如果触碰 `src/app/page.tsx`、`src/app/layout.tsx`、`src/components/SynthwaveGrid.tsx` 或 `src/app/DIY.md`，应顺手将相关中文文案、注释、元数据恢复为正常中文。
- `AGENTS.md` 必须保持正常中文可读。

## Docker 与依赖规范

- 新增服务必须纳入 `docker-compose.yml`。
- 不要新增额外 Dockerfile，除非明确新增独立微服务。
- 新增 npm 依赖后需要更新 `package-lock.json`，并在 Docker 环境中重新构建：`docker-compose up --build -d`。
- 安装超过 10MB 的大型依赖前必须先与用户确认。
- 不要修改 Compose 端口映射或数据库配置，除非用户明确要求。

## 高危操作确认

执行以下操作前必须先得到用户明确确认：

- 删除或覆盖已有文件。
- 修改 `docker-compose.yml` 中的端口映射、数据库账号、密码、库名或数据卷。
- 直接操作数据库中的破坏性 SQL，例如 `DROP`、`TRUNCATE`、批量删除。
- 删除 Docker volume。
- 安装大型新依赖。

## 质量要求

- 完成代码修改后至少运行 `npm run lint`。
- 涉及路由、构建、Next.js 配置或 CSS 语法时，优先运行 `npm run build`。
- 前端视觉修改完成后，应在浏览器中检查桌面与移动宽度，确认没有空白画布、文字重叠或不可点击控件。
- 文档修改不需要启动开发服务器，但要确保 Markdown 结构清晰、无乱码。

## 沟通偏好

- 中文优先，直奔主题。
- 先给结论，再给必要细节。
- 优先给可执行命令、文件路径和代码位置。
- 不需要客套话，不写泛泛解释。
