// ─── Types ───────────────────────────────────────────────────────────────────

export type Region = {
  id: string
  name: string
  nameEn: string
  flag: string
  tagline: string
  color: string
}

export type Grade = {
  id: string
  label: string
  nameZh: string
  subtitle: string
  fuel: string
  fuelColor: string
  desc: string
  color: string
  available: boolean
}

export type Config = {
  id: string
  label: string
  bandwidth: string
  route: string
  traffic: string
  seats: number
  pricePerSeat: number
  totalSeats: number
  note?: string
}

export type Vehicle = {
  id: string
  gradeId: string
  regionId: string
  modelName: string
  modelSub: string
  badge?: string
  occupiedSeats: number   // current passengers already on board
  maxSeats: number        // total capacity (usually 4)
  configs: Config[]
}

// ─── Regions ─────────────────────────────────────────────────────────────────

export const REGIONS: Region[] = [
  {
    id: "hk",
    name: "香港",
    nameEn: "HONG KONG",
    flag: "🇭🇰",
    tagline: "中国特供合资 / 国产旗舰",
    color: "#ff2d78",
  },
  {
    id: "jp",
    name: "日本",
    nameEn: "JAPAN",
    flag: "🇯🇵",
    tagline: "原装进口 · 东京直连",
    color: "#00e6ff",
  },
  {
    id: "us",
    name: "美国",
    nameEn: "UNITED STATES",
    flag: "🇺🇸",
    tagline: "原装进口 · 洛杉矶/圣何塞",
    color: "#ffb800",
  },
  {
    id: "sg",
    name: "新加坡",
    nameEn: "SINGAPORE",
    flag: "🇸🇬",
    tagline: "东南亚枢纽 · 低延迟出口",
    color: "#a3e635",
  },
]

// ─── Grades ───────────────────────────────────────────────────────────────────

export const GRADES: Grade[] = [
  {
    id: "a",
    label: "A",
    nameZh: "A 级车",
    subtitle: "ECONOMY CLASS",
    fuel: "92号油",
    fuelColor: "#94a3b8",
    desc: "普通 BGP 线路，晚高峰较拥挤，极致性价比入门之选。",
    color: "#94a3b8",
    available: false,
  },
  {
    id: "b",
    label: "B",
    nameZh: "B 级车",
    subtitle: "BUSINESS CLASS",
    fuel: "92号油",
    fuelColor: "#00e6ff",
    desc: "单程优化线路，去/回程之一采用普通专线，晚高峰波动一般，价格适中。",
    color: "#00e6ff",
    available: true,
  },
  {
    id: "c",
    label: "C",
    nameZh: "C 级车",
    subtitle: "FIRST CLASS",
    fuel: "95号油",
    fuelColor: "#ff2d78",
    desc: "双程优化线路，晚高峰波动较小，定价偏高，稳定性更强。",
    color: "#ff2d78",
    available: true,
  },
  {
    id: "d",
    label: "D",
    nameZh: "D 级车",
    subtitle: "PREMIUM SEDAN",
    fuel: "98号油",
    fuelColor: "#ffb800",
    desc: "双程精品专线 + SLA 保护 + 抗 DDoS，附赠原生 ISP 落地出口，全天候无波动。",
    color: "#ffb800",
    available: false,
  },
]

// ─── Vehicles ─────────────────────────────────────────────────────────────────

export const VEHICLES: Vehicle[] = [

  // ══════════════════════════════════════════════════
  // HK · B 级
  // ══════════════════════════════════════════════════
  {
    id: "hk-b-a6l",
    gradeId: "b", regionId: "hk",
    modelName: "A6L", modelSub: "AUDI A6L · 香港直连",
    badge: "热门",
    occupiedSeats: 2, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "300 Mbps", route: "CN2 GIA 回程优化", traffic: "800 GB / 月", seats: 2, pricePerSeat: 38, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "500 Mbps", route: "CN2 GIA 回程优化", traffic: "无限流量", seats: 4, pricePerSeat: 22, totalSeats: 4 },
      { id: "c3", label: "整车包", bandwidth: "500 Mbps", route: "CN2 GIA 回程优化", traffic: "无限流量", seats: 1, pricePerSeat: 88, totalSeats: 1, note: "独享全车" },
    ],
  },
  {
    id: "hk-b-530li",
    gradeId: "b", regionId: "hk",
    modelName: "530Li", modelSub: "BMW 530Li · 香港直连",
    occupiedSeats: 1, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "200 Mbps", route: "BGP 回程优化", traffic: "600 GB / 月", seats: 2, pricePerSeat: 28, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "300 Mbps", route: "BGP 回程优化", traffic: "无限流量", seats: 4, pricePerSeat: 18, totalSeats: 4 },
    ],
  },
  {
    id: "hk-b-525i",
    gradeId: "b", regionId: "hk",
    modelName: "525i", modelSub: "BMW 525i · 香港直连",
    occupiedSeats: 3, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "200 Mbps", route: "BGP 回程优化", traffic: "500 GB / 月", seats: 2, pricePerSeat: 26, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "300 Mbps", route: "BGP 回程优化", traffic: "无限流量", seats: 4, pricePerSeat: 16, totalSeats: 4 },
    ],
  },
  {
    id: "hk-b-es200",
    gradeId: "b", regionId: "hk",
    modelName: "ES200", modelSub: "LEXUS ES200 · 香港直连",
    occupiedSeats: 0, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "300 Mbps", route: "移动 CMI 回程优化", traffic: "600 GB / 月", seats: 2, pricePerSeat: 32, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "500 Mbps", route: "移动 CMI 回程优化", traffic: "无限流量", seats: 4, pricePerSeat: 20, totalSeats: 4 },
    ],
  },

  // ══════════════════════════════════════════════════
  // HK · C 级
  // ══════════════════════════════════════════════════
  {
    id: "hk-c-e300l",
    gradeId: "c", regionId: "hk",
    modelName: "E300L", modelSub: "MERCEDES E300L · 香港精品",
    badge: "旗舰",
    occupiedSeats: 2, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "500 Mbps", route: "CN2 GIA 双程优化", traffic: "1 TB / 月", seats: 2, pricePerSeat: 65, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "1 Gbps", route: "CN2 GIA 双程优化", traffic: "无限流量", seats: 4, pricePerSeat: 42, totalSeats: 4 },
      { id: "c3", label: "整车包", bandwidth: "1 Gbps", route: "CN2 GIA 双程优化", traffic: "无限流量", seats: 1, pricePerSeat: 168, totalSeats: 1, note: "独享全车" },
    ],
  },
  {
    id: "hk-c-h9",
    gradeId: "c", regionId: "hk",
    modelName: "红旗 H9", modelSub: "HONGQI H9 · 国产旗舰",
    occupiedSeats: 1, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "300 Mbps", route: "移动 CMI 双程优化", traffic: "600 GB / 月", seats: 2, pricePerSeat: 55, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "500 Mbps", route: "移动 CMI 双程优化", traffic: "无限流量", seats: 4, pricePerSeat: 36, totalSeats: 4 },
    ],
  },
  {
    id: "hk-c-a7l",
    gradeId: "c", regionId: "hk",
    modelName: "A7L", modelSub: "AUDI A7L · 香港精品",
    badge: "新车",
    occupiedSeats: 0, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "500 Mbps", route: "CN2 GIA 双程优化", traffic: "800 GB / 月", seats: 2, pricePerSeat: 70, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "1 Gbps", route: "CN2 GIA 双程优化", traffic: "无限流量", seats: 4, pricePerSeat: 45, totalSeats: 4 },
    ],
  },
  {
    id: "hk-c-su7",
    gradeId: "c", regionId: "hk",
    modelName: "小米 SU7", modelSub: "XIAOMI SU7 · 香港直连",
    badge: "NEW",
    occupiedSeats: 4, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "500 Mbps", route: "联通 CU 双程优化", traffic: "1 TB / 月", seats: 2, pricePerSeat: 60, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "500 Mbps", route: "联通 CU 双程优化", traffic: "无限流量", seats: 4, pricePerSeat: 38, totalSeats: 4 },
    ],
  },

  // ══════════════════════════════════════════════════
  // JP · B 级
  // ══════════════════════════════════════════════════
  {
    id: "jp-b-430",
    gradeId: "b", regionId: "jp",
    modelName: "430i", modelSub: "BMW 430i · 东京直连",
    occupiedSeats: 2, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "200 Mbps", route: "软银 SoftBank 回程优化", traffic: "500 GB / 月", seats: 2, pricePerSeat: 32, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "300 Mbps", route: "软银 SoftBank 回程优化", traffic: "无限流量", seats: 4, pricePerSeat: 20, totalSeats: 4 },
    ],
  },
  {
    id: "jp-b-525i",
    gradeId: "b", regionId: "jp",
    modelName: "525i", modelSub: "BMW 525i · 东京直连",
    occupiedSeats: 1, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "200 Mbps", route: "NTT 回程优化", traffic: "500 GB / 月", seats: 2, pricePerSeat: 30, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "300 Mbps", route: "NTT 回程优化", traffic: "无限流量", seats: 4, pricePerSeat: 19, totalSeats: 4 },
    ],
  },
  {
    id: "jp-b-prius",
    gradeId: "b", regionId: "jp",
    modelName: "Prius", modelSub: "TOYOTA PRIUS · 东京直连",
    occupiedSeats: 3, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "150 Mbps", route: "KDDI 回程优化", traffic: "400 GB / 月", seats: 2, pricePerSeat: 25, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "200 Mbps", route: "KDDI 回程优化", traffic: "无限流量", seats: 4, pricePerSeat: 15, totalSeats: 4 },
    ],
  },

  // ══════════════════════════════════════════════════
  // JP · C 级
  // ══════════════════════════════════════════════════
  {
    id: "jp-c-giulia",
    gradeId: "c", regionId: "jp",
    modelName: "Giulia", modelSub: "ALFA ROMEO GIULIA · 东京精品",
    badge: "旗舰",
    occupiedSeats: 2, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "500 Mbps", route: "IIJ 双程精品优化", traffic: "800 GB / 月", seats: 2, pricePerSeat: 72, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "1 Gbps", route: "IIJ 双程精品优化", traffic: "无限流量", seats: 4, pricePerSeat: 48, totalSeats: 4 },
    ],
  },
  {
    id: "jp-c-a7",
    gradeId: "c", regionId: "jp",
    modelName: "A7", modelSub: "AUDI A7 · 东京精品",
    badge: "新车",
    occupiedSeats: 0, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "500 Mbps", route: "软银 SoftBank 双程精品", traffic: "1 TB / 月", seats: 2, pricePerSeat: 75, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "1 Gbps", route: "软银 SoftBank 双程精品", traffic: "无限流量", seats: 4, pricePerSeat: 50, totalSeats: 4 },
    ],
  },
  {
    id: "jp-c-lc500",
    gradeId: "c", regionId: "jp",
    modelName: "LC500h", modelSub: "LEXUS LC500h · 东京精品",
    occupiedSeats: 1, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "500 Mbps", route: "NTT 双程精品优化", traffic: "800 GB / 月", seats: 2, pricePerSeat: 68, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "1 Gbps", route: "NTT 双程精品优化", traffic: "无限流量", seats: 4, pricePerSeat: 44, totalSeats: 4 },
    ],
  },

  // ══════════════════════════════════════════════════
  // US · B 级
  // ══════════════════════════════════════════════════
  {
    id: "us-b-xt5",
    gradeId: "b", regionId: "us",
    modelName: "XT5", modelSub: "CADILLAC XT5 · 洛杉矶",
    occupiedSeats: 2, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "300 Mbps", route: "AS9929 回程优化", traffic: "500 GB / 月", seats: 2, pricePerSeat: 28, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "500 Mbps", route: "AS9929 回程优化", traffic: "无限流量", seats: 4, pricePerSeat: 18, totalSeats: 4 },
    ],
  },
  {
    id: "us-b-525i",
    gradeId: "b", regionId: "us",
    modelName: "525i", modelSub: "BMW 525i · 圣何塞",
    occupiedSeats: 0, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "200 Mbps", route: "AS4837 回程优化", traffic: "500 GB / 月", seats: 2, pricePerSeat: 26, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "300 Mbps", route: "AS4837 回程优化", traffic: "无限流量", seats: 4, pricePerSeat: 17, totalSeats: 4 },
    ],
  },
  {
    id: "us-b-model3",
    gradeId: "b", regionId: "us",
    modelName: "Model 3", modelSub: "TESLA MODEL 3 · 洛杉矶",
    badge: "热门",
    occupiedSeats: 3, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "300 Mbps", route: "Cogent 回程优化", traffic: "600 GB / 月", seats: 2, pricePerSeat: 30, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "500 Mbps", route: "Cogent 回程优化", traffic: "无限流量", seats: 4, pricePerSeat: 19, totalSeats: 4 },
    ],
  },

  // ══════════════════════════════════════════════════
  // US · C 级
  // ══════════════════════════════════════════════════
  {
    id: "us-c-escalade",
    gradeId: "c", regionId: "us",
    modelName: "Escalade", modelSub: "CADILLAC ESCALADE · 洛杉矶精品",
    badge: "热门",
    occupiedSeats: 2, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "500 Mbps", route: "AS4837 双程优化", traffic: "1 TB / 月", seats: 2, pricePerSeat: 60, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "1 Gbps", route: "AS4837 双程优化", traffic: "无限流量", seats: 4, pricePerSeat: 40, totalSeats: 4 },
      { id: "c3", label: "整车包", bandwidth: "1 Gbps", route: "AS4837 双程优化", traffic: "无限流量", seats: 1, pricePerSeat: 158, totalSeats: 1, note: "独享全车" },
    ],
  },
  {
    id: "us-c-a7",
    gradeId: "c", regionId: "us",
    modelName: "A7", modelSub: "AUDI A7 · 圣何塞精品",
    occupiedSeats: 1, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "500 Mbps", route: "AS9929 双程优化", traffic: "800 GB / 月", seats: 2, pricePerSeat: 62, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "1 Gbps", route: "AS9929 双程优化", traffic: "无限流量", seats: 4, pricePerSeat: 42, totalSeats: 4 },
    ],
  },
  {
    id: "us-c-su7",
    gradeId: "c", regionId: "us",
    modelName: "小米 SU7", modelSub: "XIAOMI SU7 Ultra · 洛杉矶精品",
    badge: "NEW",
    occupiedSeats: 0, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "1 Gbps", route: "Lumen 双程精品", traffic: "1 TB / 月", seats: 2, pricePerSeat: 65, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "1 Gbps", route: "Lumen 双程精品", traffic: "无限流量", seats: 4, pricePerSeat: 42, totalSeats: 4 },
    ],
  },

  // ══════════════════════════════════════════════════
  // SG · B 级
  // ══════════════════════════════════════════════════
  {
    id: "sg-b-camry",
    gradeId: "b", regionId: "sg",
    modelName: "Camry", modelSub: "TOYOTA CAMRY · 新加坡直连",
    occupiedSeats: 1, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "200 Mbps", route: "联通 CU 回程优化", traffic: "400 GB / 月", seats: 2, pricePerSeat: 25, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "300 Mbps", route: "联通 CU 回程优化", traffic: "无限流量", seats: 4, pricePerSeat: 16, totalSeats: 4 },
    ],
  },
  {
    id: "sg-b-525i",
    gradeId: "b", regionId: "sg",
    modelName: "525i", modelSub: "BMW 525i · 新加坡直连",
    occupiedSeats: 2, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "200 Mbps", route: "电信 CT 回程优化", traffic: "500 GB / 月", seats: 2, pricePerSeat: 28, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "300 Mbps", route: "电信 CT 回程优化", traffic: "无限流量", seats: 4, pricePerSeat: 18, totalSeats: 4 },
    ],
  },
  {
    id: "sg-b-model3",
    gradeId: "b", regionId: "sg",
    modelName: "Model 3", modelSub: "TESLA MODEL 3 · 新加坡直连",
    occupiedSeats: 0, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "200 Mbps", route: "移动 CMI 回程优化", traffic: "400 GB / 月", seats: 2, pricePerSeat: 24, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "300 Mbps", route: "移动 CMI 回程优化", traffic: "无限流量", seats: 4, pricePerSeat: 15, totalSeats: 4 },
    ],
  },

  // ══════════════════════════════════════════════════
  // SG · C 级
  // ══════════════════════════════════════════════════
  {
    id: "sg-c-ls500",
    gradeId: "c", regionId: "sg",
    modelName: "LS500h", modelSub: "LEXUS LS500h · 新加坡精品",
    occupiedSeats: 3, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "500 Mbps", route: "电信 CT 双程精品", traffic: "800 GB / 月", seats: 2, pricePerSeat: 58, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "500 Mbps", route: "电信 CT 双程精品", traffic: "无限流量", seats: 4, pricePerSeat: 38, totalSeats: 4 },
    ],
  },
  {
    id: "sg-c-a7",
    gradeId: "c", regionId: "sg",
    modelName: "A7", modelSub: "AUDI A7 · 新加坡精品",
    badge: "新车",
    occupiedSeats: 0, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "500 Mbps", route: "联通 CU 双程精品", traffic: "1 TB / 月", seats: 2, pricePerSeat: 62, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "1 Gbps", route: "联通 CU 双程精品", traffic: "无限流量", seats: 4, pricePerSeat: 40, totalSeats: 4 },
    ],
  },
  {
    id: "sg-c-su7",
    gradeId: "c", regionId: "sg",
    modelName: "小米 SU7", modelSub: "XIAOMI SU7 · 新加坡精品",
    badge: "NEW",
    occupiedSeats: 2, maxSeats: 4,
    configs: [
      { id: "c1", label: "双人拼", bandwidth: "500 Mbps", route: "移动 CMI 双程精品", traffic: "800 GB / 月", seats: 2, pricePerSeat: 55, totalSeats: 4 },
      { id: "c2", label: "四人拼", bandwidth: "1 Gbps", route: "移动 CMI 双程精品", traffic: "无限流量", seats: 4, pricePerSeat: 36, totalSeats: 4 },
    ],
  },
]
