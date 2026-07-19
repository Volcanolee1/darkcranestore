"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SynthwaveGrid from "@/components/SynthwaveGrid";
import "./portal.css";

const stats = [
  { label: "总车辆", value: 24 },
  { label: "已发车", value: 18 },
  { label: "空位车", value: 6 },
];

const regions = ["JP", "US", "HK", "TW"] as const;

type Region = (typeof regions)[number];
type SpeedLevel = "fast" | "moderate" | "slow";

type SpeedRegion = {
  region: Region;
  route: string;
  carriers: Array<{
    label: "电信" | "联通" | "移动";
    ms: number;
    level: SpeedLevel;
  }>;
};

const speedData: SpeedRegion[] = [
  {
    region: "JP",
    route: "东京精品线",
    carriers: [
      { label: "电信", ms: 89, level: "fast" },
      { label: "联通", ms: 113, level: "moderate" },
      { label: "移动", ms: 69, level: "fast" },
    ],
  },
  {
    region: "US",
    route: "美西回程优化",
    carriers: [
      { label: "电信", ms: 150, level: "moderate" },
      { label: "联通", ms: 151, level: "moderate" },
      { label: "移动", ms: 155, level: "moderate" },
    ],
  },
  {
    region: "HK",
    route: "香港低延迟",
    carriers: [
      { label: "电信", ms: 45, level: "fast" },
      { label: "联通", ms: 52, level: "fast" },
      { label: "移动", ms: 48, level: "fast" },
    ],
  },
  {
    region: "TW",
    route: "台湾家宽出口",
    carriers: [
      { label: "电信", ms: 62, level: "fast" },
      { label: "联通", ms: 76, level: "fast" },
      { label: "移动", ms: 108, level: "moderate" },
    ],
  },
];

const navItems = [
  { label: "停车场", href: "/parking" },
  { label: "首页", href: "/", active: true },
  { label: "加油站", href: "/fuel" },
];

export default function Home() {
  const [activeRegion, setActiveRegion] = useState<Region>("JP");

  return (
    <main className="portal-scene">
      <BackgroundLayer />
      <RoadLayer activeRegion={activeRegion} onRegionChange={setActiveRegion} />
      <WindshieldLayer activeRegion={activeRegion} />
      <CockpitLayer />
      <BoardingPanel activeRegion={activeRegion} />
      <SpeedBoard activeRegion={activeRegion} onRegionChange={setActiveRegion} />
      <TopNav />
      <InteractionLayer activeRegion={activeRegion} />
    </main>
  );
}

function BackgroundLayer() {
  return (
    <section className="portal-layer layer-0" aria-hidden="true">
      <div className="night-sky" />
      <div className="city-shadow city-shadow-left" />
      <div className="city-shadow city-shadow-right" />
      <div className="neon-atmosphere" />
    </section>
  );
}

function RoadLayer({
  activeRegion,
  onRegionChange,
}: {
  activeRegion: Region;
  onRegionChange: (region: Region) => void;
}) {
  return (
    <section className="portal-layer layer-1" aria-label="道路与线路入口">
      <SynthwaveGrid />
      <div className="tunnel-arch">
        <div className="tunnel-rings" />
      </div>
      <div className="road-surface" />
      <div className="road-vanish-glow" />
      <div className="road-center-line" />
      <div className="road-lane-left" />
      <div className="road-lane-right" />
      <div className="speed-streaks" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="country-flags" aria-label="线路地区">
        {regions.map((region) => (
          <FlagMarker
            active={region === activeRegion}
            key={region}
            onSelect={() => onRegionChange(region)}
            region={region}
          />
        ))}
      </div>
    </section>
  );
}

function WindshieldLayer({ activeRegion }: { activeRegion: Region }) {
  return (
    <section className="portal-layer layer-2" aria-hidden="true">
      <div className="windshield-glass" />
      <div className="windshield-top-rail" />
      <div className="windshield-left-pillar" />
      <div className="windshield-right-pillar" />
      <div className="windshield-region-chip">{activeRegion}</div>
    </section>
  );
}

function CockpitLayer() {
  return (
    <section className="portal-layer layer-3" aria-label="车内驾驶舱">
      <div className="rearview-mirror" />
      <div className="dashboard">
        <div className="dashboard-screen">
          {stats.map((item) => (
            <span className="dashboard-stat" key={item.label}>
              <strong>{item.value}</strong>
              {item.label}
            </span>
          ))}
        </div>
        <div className="console-panel" />
        <div className="console-slots">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="steering-wheel">
        <span className="wheel-spoke wheel-spoke-top" />
        <span className="wheel-spoke wheel-spoke-left" />
        <span className="wheel-spoke wheel-spoke-right" />
      </div>
      <div className="driver-silhouette" />
      <div className="front-seat front-seat-left" />
      <div className="front-seat front-seat-right" />
      <div className="rear-seat" />
    </section>
  );
}

function BoardingPanel({ activeRegion }: { activeRegion: Region }) {
  return (
    <section className="portal-layer layer-4" aria-label="快速上车">
      <div className="windshield-cta">
        <div className="cta-glass">
          <p className="cta-kicker">Darkcrane / {activeRegion} 线路</p>
          <Link className="btn-neon cta-button" href={`/parking?region=${activeRegion}`}>
            立刻上车
          </Link>
          <p className="cta-note">满员即发车 / 中途可补位 / 原始权限交付</p>
        </div>
      </div>
    </section>
  );
}

function SpeedBoard({
  activeRegion,
  onRegionChange,
}: {
  activeRegion: Region;
  onRegionChange: (region: Region) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeIndex = speedData.findIndex((item) => item.region === activeRegion);
  const activeRoute = speedData[Math.max(activeIndex, 0)];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (media.matches) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      const currentIndex = speedData.findIndex((item) => item.region === activeRegion);
      const nextIndex = (Math.max(currentIndex, 0) + 1) % speedData.length;
      onRegionChange(speedData[nextIndex].region);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [activeRegion, onRegionChange]);

  return (
    <aside
      className={`portal-layer layer-5 speed-board-shell ${mobileOpen ? "open" : ""}`}
      aria-label="路况指示牌"
    >
      <button
        className="speed-board-toggle"
        type="button"
        aria-expanded={mobileOpen}
        onClick={() => setMobileOpen((open) => !open)}
      >
        路况 {activeRegion}
      </button>

      <div className="speed-board glass-card">
        <div className="speed-board-scanline" aria-hidden="true" />
        <p className="speed-board-title">路况指示牌</p>
        <p className="speed-board-subtitle">{activeRoute.route}</p>
        <div className="speed-carrier-header" aria-hidden="true">
          <span>区域</span>
          <span>电信</span>
          <span>联通</span>
          <span>移动</span>
        </div>

        {speedData.map((item) => (
          <button
            className={`speed-row ${item.region === activeRegion ? "active" : ""}`}
            key={item.region}
            type="button"
            onClick={() => onRegionChange(item.region)}
          >
            <span className="speed-region">{item.region}</span>
            <span className="speed-values">
              {item.carriers.map((carrier) => (
                <span className={`speed-cell ${carrier.level}`} key={carrier.label}>
                  {carrier.ms}ms
                </span>
              ))}
            </span>
          </button>
        ))}

        <div className="speed-board-indicators" aria-label="切换路况地区">
          {speedData.map((item) => (
            <button
              aria-label={`查看 ${item.region} 路况`}
              className={`speed-board-dot ${item.region === activeRegion ? "active" : ""}`}
              key={item.region}
              type="button"
              onClick={() => onRegionChange(item.region)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

function TopNav() {
  return (
    <nav className="portal-nav portal-layer layer-6" aria-label="主导航">
      {navItems.map((item) => (
        <Link
          className={`portal-nav-item ${item.active ? "active" : ""}`}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function InteractionLayer({ activeRegion }: { activeRegion: Region }) {
  const routeText = useMemo(() => {
    const active = speedData.find((item) => item.region === activeRegion);
    return active ? `${active.region} / ${active.route}` : activeRegion;
  }, [activeRegion]);

  return (
    <section className="portal-layer layer-7" aria-live="polite">
      <div className="motion-readout">
        <span className="readout-label">AUTO ROUTE</span>
        <span>{routeText}</span>
      </div>
    </section>
  );
}

function FlagMarker({
  active,
  onSelect,
  region,
}: {
  active: boolean;
  onSelect: () => void;
  region: Region;
}) {
  return (
    <button
      className={`flag-marker ${active ? "active" : ""}`}
      type="button"
      onClick={onSelect}
    >
      <span className="flag-label" data-region={region}>
        {region}
      </span>
      <span className="flag-pole" aria-hidden="true" />
    </button>
  );
}
